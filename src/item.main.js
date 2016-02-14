import "babel-polyfill";
import md5 from "md5";
import { Buffer } from "buffer/";
import Difficulty from "./difficulty";
import Item from "./item";
import Config from "./config";

new Vue({
    el: ".container",
    data: {
        selectedGachaString: "Difficulty 0",
        selectedItemString: "null",
        selectedTargetString: "Difficulty 0",
        isCocoafulString: "true",
        trophies: (collectedItems => Item.all.map(item => collectedItems.includes(item.id)))(Config.load().collectedItems),
        isLoading: false
    },
    computed: {
        Difficulty: () => Difficulty,
        Item: () => Item,
        selectedTarget: {
            get() {
                const [kindString, idString] = this.selectedTargetString.split(/ /);
                return this[kindString].all[parseInt(idString, 10)];
            },
            set(value) {
                if (value instanceof Difficulty) {
                    this.selectedGachaString = this.selectedTargetString = `Difficulty ${value.id}`;
                    this.selectedItemString = "null";
                } else if (value instanceof Item) {
                    this.selectedGachaString = "null";
                    this.selectedItemString = this.selectedTargetString = `Item ${value.id}`;
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
        uncollectedItems() {
            const trophies = Array.from(this.trophies); // 毎回this.trophiesにアクセスすると遅いのでキャッシュ
            return Item.all.filter(item => !trophies[item.id]);
        },
        collectedItems() {
            const trophies = Array.from(this.trophies);
            return Item.all.filter(item => trophies[item.id]);
        },
        result() {
            let rows = this.selectedTarget instanceof Difficulty
                ? Item.all.filter(item => this.selectedTarget.canSee(item)).map(item => ({
                    entity: item,
                    dropProbability: this.selectedTarget.calcDropProbability(item, this.uncollectedItems, this.isCocoaful)
                }))
                : Difficulty.all.filter(gacha => gacha.canSee(this.selectedTarget)).map(gacha => ({
                    entity: gacha,
                    dropProbability: gacha.calcDropProbability(this.selectedTarget, this.uncollectedItems, this.isCocoaful)
                }));
            rows = _(rows).orderBy(["dropProbability", "entity.order"], ["desc", "asc"]).value();

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
            this.trophies = Item.all.map(item => true);
        },
        uncheckAllTrophies() {
            this.trophies = Item.all.map(item => false);
        },
        importTrophies: async function () {
            if (!confirm("まりストのセーブデータからアイテム獲得状況をインポートします。\nインポートにはまりストアカウントのIDとパスワードを入力する必要があります。\n（IDとパスワードの情報はアイテム獲得状況のインポート以外には使用しません）")) return;
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

            const itemMap = new Map(Item.all.map(item => [item.idAsString, item]));
            const itemSet = new Set(
                new Buffer(saveData, "base64").toString()
                    .split(/::/)
                    .find(p => p.split(/==/)[0] === "my_item")
                    .split(/==/)[1]
                    .split(/##/)
                    .filter(idAsString => itemMap.has(idAsString))
                    .map(idAsString => itemMap.get(idAsString))
            );
            this.trophies = Item.all.map(item => itemSet.has(item));
        },
        reloadSelectedItem() {
            const selectedItemString = this.selectedItemString;
            this.selectedItemString = "null";
            this.selectedItemString = selectedItemString;
        }
    },
    watch: {
        selectedGachaString(newValue, oldValue) {
            if (newValue === "null") return;
            this.selectedItemString = "null";
            this.selectedTargetString = newValue;
        },
        selectedItemString(newValue, oldValue) {
            if (newValue === "null") return;
            this.selectedGachaString = "null";
            this.selectedTargetString = newValue;
        },
        trophies: {
            handler(newValue, oldValue) {
                Config.update(config => {
                    config.collectedItems = _.range(newValue.length).filter(i => newValue[i]);
                });
            },
            immediate: true
        }
    }
});
