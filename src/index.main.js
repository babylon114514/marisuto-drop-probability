import "babel-polyfill";
import "./vue-extension";
import md5 from "md5";
import { Buffer } from "buffer/";
import Scout from "./scout";
import Difficulty from "./difficulty";
import Chara from "./chara";
import NonPlayableChara from "./non-playable-chara";
import Config from "./config";

new Vue({
    el: ".container",
    data: {
        selectedGachaString: "Scout 0",
        selectedCharaString: "null",
        selectedTargetString: "Scout 0",
        isCocoafulString: "true",
        trophies: (collectedCharas => Chara.all.map(chara => collectedCharas.includes(chara.id)))(Config.load().collectedCharas),
        isLoading: false
    },
    computed: {
        Scout: () => Scout,
        Difficulty: () => Difficulty,
        Chara: () => Chara,
        NonPlayableChara: () => NonPlayableChara,
        selectedTarget: {
            get() {
                const [kindString, idString] = this.selectedTargetString.split(/ /);
                return this[kindString].all[parseInt(idString, 10)];
            },
            set(value) {
                if (value instanceof Scout) {
                    this.selectedGachaString = this.selectedTargetString = `Scout ${value.id}`;
                    this.selectedCharaString = "null";
                } else if (value instanceof Difficulty) {
                    this.selectedGachaString = this.selectedTargetString = `Difficulty ${value.id}`;
                    this.selectedCharaString = "null";
                } else if (value instanceof Chara) {
                    this.selectedGachaString = "null";
                    this.selectedCharaString = this.selectedTargetString = `Chara ${value.id}`;
                }
            }
        },
        isCocoaful: {
            get() {
                return this.isCocoafulString === "true";
            },
            set(value) {
                this.isCocoafulString = value.toString();
            }
        },
        uncollectedCharas() {
            const trophies = Array.from(this.trophies); // 毎回this.trophiesにアクセスすると遅いのでキャッシュ
            return Chara.all.filter(chara => !trophies[chara.id]);
        },
        collectedCharas() {
            const trophies = Array.from(this.trophies);
            return Chara.all.filter(chara => trophies[chara.id]);
        },
        result() {
            let rows = this.selectedTarget instanceof Scout || this.selectedTarget instanceof Difficulty
                ? Chara.all.filter(chara => this.selectedTarget.canSee(chara)).map(chara => ({
                    entity: chara,
                    dropProbability: this.selectedTarget.calcDropProbability(chara, this.uncollectedCharas, this.isCocoaful)
                }))
                : Scout.all.concat(Difficulty.all).filter(gacha => gacha.canSee(this.selectedTarget)).map(gacha => ({
                    entity: gacha,
                    dropProbability: gacha.calcDropProbability(this.selectedTarget, this.uncollectedCharas, this.isCocoaful)
                }));
            rows = _(rows).orderBy([row => row.entity instanceof Scout ? 1 : row.entity instanceof Difficulty ? 2 : 3, "dropProbability", "entity.order"], ["asc", "desc", "asc"]).value();

            function formatProbability(probability) {
                const probability10000x = Math.round(probability * 10000);
                let str = probability10000x < 100 ? `00${probability10000x}`.slice(-3) : probability10000x.toString();
                str = `\u00A0\u00A0\u00A0\u00A0${str}`.slice(-5);
                return `${str.slice(0, 3)}.${str.slice(3, 5)}%`;
            }
            return {
                totalDropProbabilityString: formatProbability(_(rows).map("dropProbability").sum()),
                rows: rows.map(row => ({entity: row.entity, dropProbabilityString: formatProbability(row.dropProbability)}))
            };
        }
    },
    methods: {
        checkAllTrophies() {
            this.trophies = Chara.all.map(chara => true);
        },
        uncheckAllTrophies() {
            this.trophies = Chara.all.map(chara => false);
        },
        importTrophies: async function () {
            if (!confirm("まりストのセーブデータからトロフィー獲得状況をインポートします。\nインポートにはまりストアカウントのIDとパスワードを入力する必要があります。\n（IDとパスワードの情報はトロフィー獲得状況のインポート以外には使用しません）")) return;
            const userId = prompt("あなたのまりストアカウントのIDを入力してください", "");
            if (userId === null) return;
            const password = prompt("あなたのまりストアカウントのパスワードを入力してください", "");
            if (password === null) return;

            function crossOriginAjax(url) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: "http://query.yahooapis.com/v1/public/yql",
                        data: {
                            q: `select * from html where url='${url}'`,
                            format: "json"
                        },
                        success(data) {
                            if (data.query.results !== null) {
                                resolve(data.query.results.body);
                            } else {
                                reject(new Error("Invalid data body"));
                            }
                        },
                        error() {
                            reject(new Error("Access failed"));
                        }
                    });
                });
            }

            this.isLoading = true;
            let saveData;
            try {
                saveData = await crossOriginAjax(`http://sitappagames.zombie.jp/udk_story/udk/user_data/${md5(userId)}/${md5(password)}.txt`);
            } catch (e) {
                try {
                    saveData = await crossOriginAjax(`http://sitappagames.zombie.jp/udk_story/udk/user_data2/${md5(userId)}/${md5(password)}.txt`);
                } catch (e) {
                    alert("セーブデータの読み込みに失敗しました。");
                    return;
                }
            } finally {
                this.isLoading = false;
            }

            const charaMap = new Map(Chara.all.map(chara => [chara.idAsString, chara]));
            const charaSet = new Set(
                new Buffer(saveData, "base64").toString()
                    .split(/::/)
                    .find(p => p.split(/==/)[0] === "trophy_list")
                    .split(/==/)[1]
                    .split(/##/)
                    .filter(idAsString => charaMap.has(idAsString))
                    .map(idAsString => charaMap.get(idAsString))
            );
            this.trophies = Chara.all.map(chara => charaSet.has(chara));
        }
    },
    watch: {
        selectedGachaString(newValue, oldValue) {
            if (newValue === "null") return;
            this.selectedCharaString = "null";
            this.selectedTargetString = newValue;
        },
        selectedCharaString(newValue, oldValue) {
            if (newValue === "null") return;
            this.selectedGachaString = "null";
            this.selectedTargetString = newValue;
        },
        trophies: {
            handler(newValue, oldValue) {
                Config.update(config => {
                    config.collectedCharas = _.range(newValue.length).filter(i => newValue[i]);
                });
            },
            immediate: true
        }
    }
});
