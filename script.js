Array.prototype.flatMap = function(flatMapper, thisArg) {
    var result = [];
    this.forEach(function(element) {
        Array.prototype.push.apply(result, flatMapper.call(thisArg, element));
    });
    return result;
};
if (!("find" in Array.prototype)) {
    Array.prototype.find = function(condition, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if (condition.call(thisArg, this[i])) return this[i];
        }
        return void(0);
    };
}
Array.prototype.groupBy = function(keyMapper) {
    var result = new Hash();
    this.forEach(function(element) {
        var key = keyMapper(element);
        var elements = result[key.toString()];
        if (elements === void(0)) {
            elements = [];
            result._put(key, elements);
        }
        elements.push(element);
    }, this);
    return result;
};
Array.prototype.includes = function(targetElement) {
    return this.some(function(element){return element == targetElement});
};
Array.prototype.isEmpty = function() {
    return this.length == 0;
};
Array.prototype.product = function(action) {
    var arrays = this.concat();
    var argumentsToAction = [];
    function recur() {
        if (arrays.length == 0) {
            action(argumentsToAction);
        } else {
            var array = arrays.shift();
            array.forEach(function(element) {
                argumentsToAction.push(element);
                recur();
                argumentsToAction.pop();
            });
            arrays.unshift(array);
        }
    }
    recur();
};
Array.prototype.toHash = function() {
    return new Hash(this);
};
Array.prototype.uniq = function() {
    return this.map(function(element){return [element, element]}).toHash().keys();
};

function Hash(object) {
    this._keys = [];
    if (arguments.length == 0) return;

    if (object instanceof Array) {
        object.forEach(function(keyValuePair) {
            this._put(keyValuePair[0], keyValuePair[1]);
        }, this);
    } else {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                this._put(key, object[key]);
            }
        }
    }
}
Hash.prototype._put = function(key, element) {
    if (this[key.toString()] === void(0)) this._keys.push(key);
    this[key.toString()] = element;
};
Hash.prototype.clone = function() {
    return new Hash(this._keys.map(function(key){return [key, this[key.toString()]]}, this));
};
Hash.prototype.forEach = function(action) {
    this._keys.forEach(function(key) {
        action(key, this[key.toString()]);
    }, this);
};
Hash.prototype.keys = function() {
    return this._keys;
};
Hash.prototype.map = function(mapper) {
    var result = [];
    this._keys.forEach(function(key) {
        result.push(mapper(key, this[key.toString()]));
    }, this);
    return result;
};
Hash.prototype.toArray = function() {
    var result = [];
    this._keys.forEach(function(key) {
        result.push([key, this[key.toString()]]);
    }, this);
    return result;
};
Hash.prototype.toString = function() {
    return this._keys.map(function(key){return key.toString()}).sort().map(function(keyAsString){return keyAsString + ":" + this[keyAsString]}, this).join(",");
};

var Range = {
    closed: function(min, max) {
        var result = [];
        for (var x = min; x <= max; x++) {
            result.push(x);
        }
        return result;
    }
};

function mySetCookie(key, value, day) {
    var date = new Date();
    date.setTime(date.getTime() + (day * 24 * 60 * 60 * 1000));
    document.cookie = "@" + key + "=" + encodeURIComponent(value) + ";expires=" + date.toGMTString();
}
function myGetCookie(key) {
    key = "@" + key + "=";
    var value = null;
    var cookie = document.cookie + ";";
    var offset = cookie.indexOf(key);
    if (offset > -1) {
        var start = offset + key.length;
        var end = cookie.indexOf(";", start);
        value = decodeURIComponent(cookie.substring(start, end));
    }
    var valueAsNumber = Number(value);
    if (value === null || isNaN(valueAsNumber)) return value;
    return valueAsNumber;
}

function formatProbability(probability) {
    var str = ("\u00A0\u00A0\u00A0\u00A0" + Math.round(probability * 1000)).slice(-4)
    if (str.match(/\u00A0{3}(\d)/)) return "\u00A0\u00A00." + RegExp.$1 + "%"
    return str.slice(0, 3) + "." + str.charAt(3) + "%"
}
function C(n, r) {
    return Range.closed(n - r + 1, n).reduce(PROD, 1) / Range.closed(1, r).reduce(PROD, 1);
}
function f(propertyName) {
    return function(element) {
        return element[propertyName];
    };
}
function SUM(sum, x) {
    return sum + x;
};
function PROD(prod, x) {
    return prod * x;
};

function Chara(id, name, trophyOrder) {
    this.id = id;
    this.name = name;
    this.trophyOrder = trophyOrder;
}
Chara.prototype.toString = function() {
    return this.id;
};
Chara.prototype.calcDropProbability = function(uncaughtCharas) {
    return Quest.all.flatMap(function(quest) {
        return quest.difficulties.filter(function(difficulty){return difficulty.appears(this)}, this).map(function(difficulty) {
            return [
                quest.name + "(" + difficulty.name + ")",
                difficulty.calcDropProbability(uncaughtCharas).toArray().find(function(pair){return pair[0] == this}, this)[1]
            ];
        }, this);
    }, this).toHash();
};
Chara.prototype.createLink = function() {
    var self = this;
    return $(document.createElement("a")).attr("href", "javascript:void(0);").text(self.name).click(function() {
        target = self;
        redraw();
    });
};
Chara.all = [
new Chara(0, "RIM姉貴", 0),
new Chara(1, "UDK姉貴", 1),
new Chara(2, "ALC姉貴", 2),
new Chara(3, "DIYUSI", 3),
new Chara(4, "INU", 4),
new Chara(5, "RMA姉貴", 5),
new Chara(6, "CRNちゃん", 6),
new Chara(7, "MSTA姉貴", 7),
new Chara(8, "UTH", 8),
new Chara(9, "SIK姉貴", 9),
new Chara(10, "MIRN姉貴", 10),
new Chara(11, "KSDB姉貴", 11),
new Chara(12, "PCLY姉貴", 12),
new Chara(13, "釣りキチおばさん", 13),
new Chara(14, "SKY姉貴", 14),
new Chara(15, "RMLA姉貴", 15),
new Chara(16, "FLNちゃん", 16),
new Chara(17, "YUK姉貴", 17),
new Chara(18, "野獣先輩", 18),
new Chara(19, "遠野", 19),
new Chara(20, "KMR", 20),
new Chara(21, "MUR大先輩", 21),
new Chara(22, "サイクロップス先輩", 22),
new Chara(23, "ひで", 23),
new Chara(24, "関西チャラ男", 24),
new Chara(25, "医師TRN", 25),
new Chara(26, "SNJ", 26),
new Chara(27, "KBTIT", 27),
new Chara(28, "虐待おじさん", 28),
new Chara(29, "平野源五郎", 29),
new Chara(30, "ONDISK", 30),
new Chara(31, "HND△", 31),
new Chara(32, "KBSトリオK", 32),
new Chara(33, "KBSトリオB", 33),
new Chara(34, "KBSトリオS", 34),
new Chara(35, "TNOK", 35),
new Chara(36, "中野くん", 36),
new Chara(37, "MYN", 37),
new Chara(38, "課長", 38),
new Chara(39, "AKYS", 39),
new Chara(40, "ドラゴン田中", 40),
new Chara(41, "HGKM様", 41),
new Chara(42, "TKNUC", 42),
new Chara(43, "SIY", 43),
new Chara(44, "GO", 44),
new Chara(45, "レッドセミ兄貴", 125),
new Chara(46, "ブルーセミ兄貴", 126),
new Chara(47, "セミ兄貴", 127),
new Chara(48, "光に満ちたセミ兄貴", 128),
new Chara(49, "闇に堕ちたセミ兄貴", 129),
new Chara(50, "メガカイロSIK", 130),
new Chara(51, "サマーMSTA姉貴", 140),
new Chara(52, "バレンタインRIM", 144),
new Chara(53, "バレンタインUDK", 145),
new Chara(54, "バレンタインALC", 146),
new Chara(55, "YKR姉貴", 168),
new Chara(56, "邪神GO", 169),
new Chara(57, "SNE姉貴", 99),
new Chara(58, "SWK様", 100),
new Chara(59, "風神KNK", 101),
new Chara(60, "神々の頂点SWK", 102),
new Chara(61, "イワナを焼くUDK", 93),
new Chara(62, "サマーRIM姉貴", 141),
new Chara(63, "サマーUDK姉貴", 142),
new Chara(64, "サマーALC姉貴", 143),
new Chara(65, "サマーHZR姉貴", 147),
new Chara(66, "サマーピンキー姉貴", 153),
new Chara(67, "MRKM先生", 45),
new Chara(68, "鬼畜教師KN", 46),
new Chara(69, "ゴーグル先生", 49),
new Chara(70, "マスクド永谷園", 48),
new Chara(71, "ラヴォイル校長", 47),
new Chara(72, "メガデス怪人", 50),
new Chara(73, "メガデス戦闘員", 51),
new Chara(74, "草薙ケン", 52),
new Chara(75, "松平ジョー", 53),
new Chara(76, "YMMちゃん", 106),
new Chara(77, "PLSY姉貴", 107),
new Chara(78, "YUG姉貴", 108),
new Chara(79, "STR姉貴", 109),
new Chara(80, "ORN姉貴", 110),
new Chara(81, "KISちゃん", 111),
new Chara(82, "太陽神NDK", 112),
new Chara(83, "殺人鬼MNR", 54),
new Chara(84, "一般通過爺", 55),
new Chara(85, "山崎まさゆき", 56),
new Chara(86, "ISI君", 57),
new Chara(87, "金泰均", 58),
new Chara(88, "ISHR先生", 59),
new Chara(89, "ピンキー姉貴", 60),
new Chara(90, "たまドラ田中", 167),
new Chara(91, "MMJ姉貴", 139),
new Chara(92, "いなり男", 61),
new Chara(93, "AKG", 62),
new Chara(94, "関西クレーマー", 63),
new Chara(95, "現場監督", 64),
new Chara(96, "変態郵便屋", 86),
new Chara(97, "インパルスITKR", 87),
new Chara(98, "小森", 88),
new Chara(99, "ホリ・トオル", 89),
new Chara(100, "ラザマリナ", 94),
new Chara(101, "BNKRG姉貴", 65),
new Chara(102, "KNN姉貴", 66),
new Chara(103, "SNNN姉貴", 67),
new Chara(104, "スライムナイトESK", 68),
new Chara(105, "KNNフェニックス", 69),
new Chara(106, "ポジ子", 70),
new Chara(107, "TIS姉貴", 71),
new Chara(108, "ボイスドラマ業者TIS", 72),
new Chara(109, "植木鉢くん", 85),
new Chara(110, "PSR姉貴", 103),
new Chara(111, "化物と化したPSR姉貴", 104),
new Chara(112, "全てを狩る先輩", 131),
new Chara(113, "花嫁と化した先輩", 148),
new Chara(114, "嫁TIT", 149),
new Chara(115, "花嫁ピンキー", 150),
new Chara(116, "ノンケスレイヤー", 151),
new Chara(117, "BSTIT", 152),
new Chara(118, "ビリー兄貴", 132),
new Chara(119, "木吉カズヤ", 133),
new Chara(120, "井上カブレラ", 134),
new Chara(121, "いかりやビオランテ", 135),
new Chara(122, "TDNコスギ", 136),
new Chara(123, "赤さん", 137),
new Chara(124, "VAN様", 138),
new Chara(125, "カグラ=ウヅキ", 95),
new Chara(126, "ESKちゃん", 154),
new Chara(127, "YW姉貴", 155),
new Chara(128, "ITUASK", 156),
new Chara(129, "バンホーテンダー", 96),
new Chara(130, "MZ姉貴", 157),
new Chara(131, "AZS姉貴", 158),
new Chara(132, "RI姉貴", 159),
new Chara(133, "朗読兄貴", 160),
new Chara(134, "デビルひで", 114),
new Chara(135, "ナイトメアビリー兄貴", 115),
new Chara(136, "ベルモンド先輩", 116),
new Chara(137, "ナイトメアMIRN姉貴", 117),
new Chara(138, "ナイトメアKSDB姉貴", 118),
new Chara(139, "ナイトメアPCLY姉貴", 119),
new Chara(140, "ナイトメアSKY姉貴", 120),
new Chara(141, "ナイトメアRMLA姉貴", 121),
new Chara(142, "ナイトメアFLNちゃん", 122),
new Chara(143, "スカーレット内閣", 123),
new Chara(144, "黄金のSWK様", 105),
new Chara(145, "ZNM姉貴", 113),
new Chara(146, "AOK", 73),
new Chara(147, "NRK姉貴", 74),
new Chara(148, "変態糞親父", 75),
new Chara(149, "変態糞娘", 76),
new Chara(150, "我修院", 77),
new Chara(151, "TKGW様", 78),
new Chara(152, "貴乃信", 79),
new Chara(153, "篤太郎", 80),
new Chara(154, "創造神KMR", 81),
new Chara(155, "中盤に出てくる鳥", 166),
new Chara(156, "ダークロウ先輩", 97),
new Chara(157, "交通整理DIちゃん", 84),
new Chara(158, "世界のトオノ", 90),
new Chara(159, "ビューティ先輩", 91),
new Chara(160, "ミミックおばさん", 124),
new Chara(161, "メカNDK", 98),
new Chara(162, "AY姉貴", 161),
new Chara(163, "TNS姉貴", 162),
new Chara(164, "HTT姉貴", 163),
new Chara(165, "MDCNちゃん", 164),
new Chara(166, "RNNSK兄貴", 165),
new Chara(167, "逝かせ隊", 82),
new Chara(168, "ポイテーロ", 83),
new Chara(169, "ウルトラマンタクヤ", 92)
];

function Enemy(chara, dropCandidateProbabilityAsChara) {
    this.chara = chara;
    this.dropCandidateProbabilityAsChara = dropCandidateProbabilityAsChara;
}

function Wave(enemies) {
    this.enemies = enemies;
}

function Difficulty(name, waves) {
    this.name = name;
    this.waves = waves;
}
Difficulty.prototype.appears = function(chara) {
    return this.waves.flatMap(f("enemies")).map(f("chara")).includes(chara);
};
Difficulty.prototype.calcDropProbability = function(uncaughtCharas) {
    function safeProd() {
        var operands = Array.prototype.slice.call(arguments);
        return operands.map(function(pair) {
            var numerator = pair[0];
            var denominator = pair[1];
            return numerator > 0 && denominator > 0 ? numerator / denominator : 0;
        }).reduce(PROD, 1);
    }
    var generateId = (function() {
        var id = -1;
        return function() {
            id++;
            return id;
        };
    })();
    var charaHash = this.waves.flatMap(f("enemies")).map(f("chara")).uniq().map(function(chara){return [chara, {cocoaful: 0, cocoaless: 0}]}).toHash();
    this.waves.flatMap(f("enemies")).groupBy(f("chara")).map(function(chara, enemies) {
        return [
            new Hash({
                charaInfoSet: [new Hash({chara: chara, density: 1, weight: uncaughtCharas.includes(chara) ? 10 : 1})],
                probability: 1 - enemies.map(function(enemy){return 1 - enemy.dropCandidateProbabilityAsChara}).reduce(PROD, 1)
            }),
            new Hash({
                charaInfoSet: [],
                probability: enemies.map(function(enemy){return 1 - enemy.dropCandidateProbabilityAsChara}).reduce(PROD, 1)
            })
        ].filter(function(secondLevelEvent){return secondLevelEvent.probability > 0});
    }).filter(function(firstLevelEvent) {
        return !(firstLevelEvent.length == 1 && firstLevelEvent[0].charaInfoSet.isEmpty());
    }).groupBy(function(firstLevelEvent) {
        switch (firstLevelEvent.length) {
        case 1:
            return generateId();
            break;
        case 2:
            return new Hash({
                probability: firstLevelEvent[0].probability,
                weight: firstLevelEvent[0].charaInfoSet[0].weight
            });
            break;
        }
    }).map(function(intersection, firstLevelEvents) {
        if (firstLevelEvents.length == 1) return firstLevelEvents[0];
        
        return Range.closed(0, firstLevelEvents.length).map(function(count) {
            return new Hash({
                charaInfoSet: count == 0 ? [] : firstLevelEvents.map(function(firstLevelEvent) {
                    var charaInfoSet = firstLevelEvent[0].charaInfoSet[0].clone();
                    charaInfoSet.density = count / firstLevelEvents.length;
                    return charaInfoSet;
                }),
                probability: C(firstLevelEvents.length, count) *
                    Math.pow(intersection.probability, count) * Math.pow(1 - intersection.probability, firstLevelEvents.length - count)
            });
        });
    }).product(function(secondLevelEvents) {
        var dropCandidateCharaInfoSet = secondLevelEvents.flatMap(f("charaInfoSet"));
        var dropCandidateCharaCount = dropCandidateCharaInfoSet.map(f("density")).reduce(SUM, 0);
        var w1DropCandidateCount = dropCandidateCharaInfoSet.
              filter(function(charaInfo) {return charaInfo.weight == 1}).
              map(function(charaInfo){return charaInfo.density * charaInfo.weight}).
              reduce(SUM, 0);
        var w10DropCandidateCount = dropCandidateCharaInfoSet.
              filter(function(charaInfo) {return charaInfo.weight == 10}).
              map(function(charaInfo){return charaInfo.density * charaInfo.weight}).
              reduce(SUM, 0);
        var dropCandidateCount = w1DropCandidateCount + w10DropCandidateCount;
        var eventProbability = secondLevelEvents.map(f("probability")).reduce(PROD, 1);
        
        switch (dropCandidateCharaCount) {
        case 0:
            break;
        case 1:
            dropCandidateCharaInfoSet.forEach(function(charaInfo) {
                charaHash[charaInfo.chara].cocoaful += eventProbability * charaInfo.density / 3;
                charaHash[charaInfo.chara].cocoaless += eventProbability * charaInfo.density / 3;
            });
            break;
        default:
            function calcDropProbability(w1, w10, selfWeight) {
                return safeProd(
                    [selfWeight, dropCandidateCount]
                ) +
                safeProd(
                    [w1, dropCandidateCount],
                    [selfWeight, dropCandidateCount - 1]
                ) +
                safeProd(
                    [w10, dropCandidateCount],
                    [selfWeight, dropCandidateCount - 10]
                ) +
                safeProd(
                    [w1, dropCandidateCount],
                    [w1 - 1, dropCandidateCount - 1],
                    [2 * selfWeight, (dropCandidateCount - 1) + (dropCandidateCount - 1 - 1)]
                ) +
                safeProd(
                    [w1, dropCandidateCount],
                    [w10, dropCandidateCount - 1],
                    [2 * selfWeight, (dropCandidateCount - 1) + (dropCandidateCount - 1 - 10)]
                ) +
                safeProd(
                    [w10, dropCandidateCount],
                    [w1, dropCandidateCount - 10],
                    [2 * selfWeight, (dropCandidateCount - 10) + (dropCandidateCount - 10 - 1)]
                ) +
                safeProd(
                    [w10, dropCandidateCount],
                    [w10 - 10, dropCandidateCount - 10],
                    [2 * selfWeight, (dropCandidateCount - 10) + (dropCandidateCount - 10 - 10)]
                );
            }
            function calcDoubleDropProbability(w1, w10, selfWeight) {
                return safeProd(
                    [w1, dropCandidateCount],
                    [selfWeight, dropCandidateCount - 1],
                    [selfWeight, (dropCandidateCount - 1) + (dropCandidateCount - 1 - selfWeight)]
                ) +
                safeProd(
                    [w10, dropCandidateCount],
                    [selfWeight, dropCandidateCount - 10],
                    [selfWeight, (dropCandidateCount - 10) + (dropCandidateCount - 10 - selfWeight)]
                );
            }
            // ココアが十分あるとき1個以上ドロップする確率
            var cocoafulDropProbability = {
                "1": calcDropProbability(w1DropCandidateCount - 1, w10DropCandidateCount, 1),
                "10": calcDropProbability(w1DropCandidateCount, w10DropCandidateCount - 10, 10)
            };
            // ココアが十分あるとき2個ドロップする確率
            var cocoafulDoubleDropProbability = {
                "1": calcDoubleDropProbability(w1DropCandidateCount - 1, w10DropCandidateCount, 1),
                "10": calcDoubleDropProbability(w1DropCandidateCount, w10DropCandidateCount - 10, 10)
            }
            // ココアが不足しているとき1個以上ドロップする確率
            var cocoalessDropProbability = {
                "1":  (1 / 3) * (cocoafulDropProbability["1"] - cocoafulDoubleDropProbability["1"]) +
                      (2 / 3) * cocoafulDoubleDropProbability["1"],
                "10": (1 / 3) * (cocoafulDropProbability["10"] - cocoafulDoubleDropProbability["10"]) +
                      (2 / 3) * cocoafulDoubleDropProbability["10"]
            };
            dropCandidateCharaInfoSet.forEach(function(charaInfo) {
                charaHash[charaInfo.chara].cocoaful += eventProbability * charaInfo.density * cocoafulDropProbability[charaInfo.weight];
                charaHash[charaInfo.chara].cocoaless += eventProbability * charaInfo.density * cocoalessDropProbability[charaInfo.weight];
            });
            break;
        }
    });
    return charaHash;
};

function Quest(id, name, finished, difficulties) {
    this.id = id;
    this.name = name;
    this.finished = finished;
    this.difficulties = difficulties;
}
Quest.all = [
new Quest(0, "博麗神社", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)])])]),
new Quest(1, "妖怪の森", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51)]), new Wave([new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[11], 0.31)])])]),
new Quest(2, "人間の里", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[9], 0.11), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51)]), new Wave([new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[12], 0.11)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[12], 0.51)])])]),
new Quest(3, "神社上空", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[8], 0.11), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51)]), new Wave([new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[12], 0.11)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[12], 0.51)])])]),
new Quest(4, "紅魔館", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[12], 0.11), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.11), new Enemy(Chara.all[12], 0.11)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51)]), new Wave([new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[16], 0.51), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[14], 1.0)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[13], 1.0)])])]),
new Quest(5, "太陽の畑", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[9], 0.31), new Enemy(Chara.all[11], 0.31)]), new Wave([new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.11), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[3], 0.11), new Enemy(Chara.all[4], 0.11)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[11], 0.51)]), new Wave([new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)])])]),
new Quest(6, "下北沢", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31), new Enemy(Chara.all[11], 0.31)]), new Wave([new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[8], 1.0)]), new Wave([new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[21], 0.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31), new Enemy(Chara.all[11], 0.31)]), new Wave([new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[8], 1.0)]), new Wave([new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[19], 0.51), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 0.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0)]), new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[8], 1.0)]), new Wave([new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 0.51)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[157], 0.51), new Enemy(Chara.all[9], 1.0)]), new Wave([new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[13], 1.0), new Enemy(Chara.all[16], 1.0)]), new Wave([new Enemy(Chara.all[159], 0.51), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[109], 1.0)])])]),
new Quest(7, "新宿調教センター", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[27], 0.11), new Enemy(Chara.all[18], 0.11), new Enemy(Chara.all[23], 0.11), new Enemy(Chara.all[28], 0.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[27], 0.51), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[23], 0.51), new Enemy(Chara.all[28], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 1.0)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0)]), new Wave([new Enemy(Chara.all[168], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[152], 1.0)]), new Wave([new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[167], 0.51), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[29], 1.0)]), new Wave([new Enemy(Chara.all[169], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[29], 1.0)])])]),
new Quest(8, "豪尻商事", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 0.11)]), new Wave([new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 0.11), new Enemy(Chara.all[26], 0.11), new Enemy(Chara.all[28], 0.11)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 0.51)]), new Wave([new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[28], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[21], 1.0)])])]),
new Quest(9, "SGW急便本社", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.31), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 0.11)]), new Wave([new Enemy(Chara.all[37], 0.11), new Enemy(Chara.all[29], 0.11), new Enemy(Chara.all[26], 0.11), new Enemy(Chara.all[38], 0.11)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 0.51)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[38], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[21], 1.0)])])]),
new Quest(10, "谷岡組系事務所", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.31), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[37], 0.11)]), new Wave([new Enemy(Chara.all[35], 0.11), new Enemy(Chara.all[36], 0.11), new Enemy(Chara.all[24], 0.11), new Enemy(Chara.all[34], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[42], 0.51)]), new Wave([new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[36], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[21], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[42], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[42], 1.0)]), new Wave([new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[21], 1.0)]), new Wave([new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[36], 1.0)])])]),
new Quest(11, "迫真空手道場", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[10], 0.11), new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[18], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[18], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[18], 1.0)])])]),
new Quest(12, "スポーツメンズクラブ", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[40], 0.11), new Enemy(Chara.all[42], 0.11), new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[40], 0.51), new Enemy(Chara.all[42], 0.51), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[29], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0)])])]),
new Quest(13, "ヒゲクマ屋敷", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[41], 0.11), new Enemy(Chara.all[28], 0.11), new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[23], 0.51), new Enemy(Chara.all[42], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[36], 1.0)])])]),
new Quest(14, "邪神の塔", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[44], 0.11), new Enemy(Chara.all[43], 0.11), new Enemy(Chara.all[24], 0.11), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[56], 0.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[30], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31)]), new Wave([new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[56], 0.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 0.31)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[22], 1.0)]), new Wave([new Enemy(Chara.all[56], 0.0)])])]),
new Quest(15, "さくらんぼ小学校", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[70], 0.51), new Enemy(Chara.all[23], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[69], 0.71), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[70], 0.51), new Enemy(Chara.all[23], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0)]), new Wave([new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[70], 1.0)]), new Wave([new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[68], 1.0)])])]),
new Quest(16, "秘密結社メガデス", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[14], 1.0)]), new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[8], 1.0)]), new Wave([new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[14], 1.0)]), new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[8], 1.0)]), new Wave([new Enemy(Chara.all[74], 0.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51)]), new Wave([new Enemy(Chara.all[75], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[67], 1.0)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[73], 1.0)]), new Wave([new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[72], 1.0)]), new Wave([new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[4], 1.0)]), new Wave([new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[67], 1.0)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[73], 1.0)]), new Wave([new Enemy(Chara.all[75], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 0.51)])])]),
new Quest(17, "聖バビロン大学病院", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[68], 1.0)]), new Wave([new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0)]), new Wave([new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[18], 0.51)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[24], 1.0)]), new Wave([new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0)]), new Wave([new Enemy(Chara.all[37], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0)]), new Wave([new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0)]), new Wave([new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[67], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[24], 1.0)]), new Wave([new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[9], 1.0)]), new Wave([new Enemy(Chara.all[68], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0)]), new Wave([new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0)]), new Wave([new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0)]), new Wave([new Enemy(Chara.all[89], 0.31), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[67], 0.51)])])]),
new Quest(18, "赤城不動産", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[6], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[36], 1.0)]), new Wave([new Enemy(Chara.all[92], 0.31), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0)]), new Wave([new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[83], 1.0)]), new Wave([new Enemy(Chara.all[94], 0.31), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[69], 0.51)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 0.51), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0)]), new Wave([new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[83], 1.0)]), new Wave([new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 1.0)]), new Wave([new Enemy(Chara.all[94], 0.51), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[67], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[70], 1.0)]), new Wave([new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 0.51), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0)]), new Wave([new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[89], 1.0), new Enemy(Chara.all[71], 1.0)]), new Wave([new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[36], 1.0)]), new Wave([new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 1.0)]), new Wave([new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[95], 0.51), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[13], 0.0), new Enemy(Chara.all[67], 0.51)])])]),
new Quest(19, "よっちゃんイカ工場", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[19], 1.0)]), new Wave([new Enemy(Chara.all[101], 0.31), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0)]), new Wave([new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0)]), new Wave([new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0)]), new Wave([new Enemy(Chara.all[107], 0.31), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0)]), new Wave([new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0)]), new Wave([new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0)]), new Wave([new Enemy(Chara.all[103], 0.31), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[27], 1.0)]), new Wave([new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0)]), new Wave([new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0)]), new Wave([new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[29], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0)]), new Wave([new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[21], 1.0)]), new Wave([new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[104], 0.31), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[29], 1.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0)]), new Wave([new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0)]), new Wave([new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0)]), new Wave([new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0)]), new Wave([new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[69], 1.0)]), new Wave([new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[15], 1.0)]), new Wave([new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[71], 1.0)]), new Wave([new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[107], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[31], 0.51)]), new Wave([new Enemy(Chara.all[108], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[102], 1.0)])])]),
new Quest(20, "岡山県", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[146], 0.51), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0)]), new Wave([new Enemy(Chara.all[101], 0.31), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 1.0)]), new Wave([new Enemy(Chara.all[147], 0.51), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[26], 1.0)]), new Wave([new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0)]), new Wave([new Enemy(Chara.all[104], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0)]), new Wave([new Enemy(Chara.all[148], 0.11), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[10], 0.51)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0)]), new Wave([new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0)]), new Wave([new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[151], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0)]), new Wave([new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[68], 1.0)]), new Wave([new Enemy(Chara.all[150], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[89], 1.0)]), new Wave([new Enemy(Chara.all[106], 0.51), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[148], 0.51), new Enemy(Chara.all[149], 0.31), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[39], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[7], 1.0)]), new Wave([new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0)]), new Wave([new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0)]), new Wave([new Enemy(Chara.all[151], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0)]), new Wave([new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[152], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0)]), new Wave([new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[68], 1.0)]), new Wave([new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[75], 1.0)]), new Wave([new Enemy(Chara.all[150], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[89], 1.0)]), new Wave([new Enemy(Chara.all[106], 0.51), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[153], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[152], 0.51)]), new Wave([new Enemy(Chara.all[148], 0.31), new Enemy(Chara.all[149], 0.31), new Enemy(Chara.all[154], 0.31), new Enemy(Chara.all[11], 0.51)])])]),
new Quest(21, "守矢神社", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.51)]), new Wave([new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[58], 0.31), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[37], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.81)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0)]), new Wave([new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0)]), new Wave([new Enemy(Chara.all[59], 0.31), new Enemy(Chara.all[58], 1.0), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[39], 0.51)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0)]), new Wave([new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0)]), new Wave([new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.81)]), new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0)]), new Wave([new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[30], 1.0)]), new Wave([new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 1.0)]), new Wave([new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 0.31)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[25], 1.0)]), new Wave([new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[58], 1.0), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[39], 1.0)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[11], 0.0)]), new Wave([new Enemy(Chara.all[8], 0.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[12], 0.0)]), new Wave([new Enemy(Chara.all[15], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[13], 0.51)]), new Wave([new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[19], 0.0)]), new Wave([new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[30], 0.51)]), new Wave([new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[42], 0.51), new Enemy(Chara.all[28], 0.51)]), new Wave([new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[38], 0.51), new Enemy(Chara.all[41], 0.31)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[25], 0.51)]), new Wave([new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 0.51)]), new Wave([new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.0), new Enemy(Chara.all[25], 0.51)]), new Wave([new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[60], 1.0), new Enemy(Chara.all[57], 1.0)])])]),
new Quest(22, "真夏の水着ユニット乱入フェスティバル", true, [new Difficulty("サマーMSTA姉貴戦", [new Wave([new Enemy(Chara.all[51], 1.0), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[5], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[4], 0.51)])]), new Difficulty("サマーRIM姉貴戦", [new Wave([new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[5], 0.51), new Enemy(Chara.all[6], 0.51)])]), new Difficulty("サマーUDK姉貴戦", [new Wave([new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[7], 0.51)])]), new Difficulty("サマーALC姉貴戦", [new Wave([new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[11], 0.51)])]), new Difficulty("サマーHZR姉貴戦", [new Wave([new Enemy(Chara.all[65], 1.0), new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[64], 0.51)])]), new Difficulty("サマーピンキー姉貴戦", [new Wave([new Enemy(Chara.all[66], 1.0), new Enemy(Chara.all[51], 0.51), new Enemy(Chara.all[51], 0.51), new Enemy(Chara.all[51], 0.51)])])]),
new Quest(23, "地霊殿", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[7], 0.51)]), new Wave([new Enemy(Chara.all[77], 0.31), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 0.51)]), new Wave([new Enemy(Chara.all[78], 0.11), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[4], 0.51)]), new Wave([new Enemy(Chara.all[79], 0.06), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[7], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[5], 0.11), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[13], 0.0)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[4], 0.51), new Enemy(Chara.all[3], 0.51)]), new Wave([new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0)]), new Wave([new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.21), new Enemy(Chara.all[26], 0.0)]), new Wave([new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0)]), new Wave([new Enemy(Chara.all[78], 0.31), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51)]), new Wave([new Enemy(Chara.all[79], 0.21), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 0.31), new Enemy(Chara.all[7], 0.31), new Enemy(Chara.all[36], 0.31)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[15], 0.31)]), new Wave([new Enemy(Chara.all[68], 0.0), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[30], 0.0)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[12], 0.0)]), new Wave([new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[42], 0.0)]), new Wave([new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[67], 1.0)]), new Wave([new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[70], 0.31)]), new Wave([new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51)]), new Wave([new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[22], 0.51)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[80], 0.51)]), new Wave([new Enemy(Chara.all[79], 1.0), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 1.0), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[36], 0.31)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[69], 0.31)]), new Wave([new Enemy(Chara.all[68], 0.0), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[30], 0.0)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[12], 0.0)]), new Wave([new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[42], 0.0)]), new Wave([new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[67], 1.0)]), new Wave([new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[70], 0.31)]), new Wave([new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51)]), new Wave([new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[22], 0.51)]), new Wave([new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[80], 0.51)]), new Wave([new Enemy(Chara.all[79], 1.0), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 1.0), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[36], 0.31)]), new Wave([new Enemy(Chara.all[82], 1.0), new Enemy(Chara.all[81], 0.0), new Enemy(Chara.all[79], 0.0)])])]),
new Quest(24, "スマブラ発売記念乱入クエスト", true, [new Difficulty("変態郵便屋戦", [new Wave([new Enemy(Chara.all[96], 0.71), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[84], 0.51)])]), new Difficulty("インパルスITKR戦", [new Wave([new Enemy(Chara.all[97], 0.31), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[12], 0.51)])]), new Difficulty("小森戦", [new Wave([new Enemy(Chara.all[98], 1.0), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[6], 0.0)])]), new Difficulty("ホリ・トオル戦", [new Wave([new Enemy(Chara.all[99], 1.0), new Enemy(Chara.all[65], 1.0), new Enemy(Chara.all[89], 0.0)])])]),
new Quest(25, "まりりんぴっく　ちびっこの部", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0)]), new Wave([new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[7], 0.51)]), new Wave([new Enemy(Chara.all[126], 0.11), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[17], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[84], 0.51)]), new Wave([new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[95], 0.51), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[58], 0.51)]), new Wave([new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[7], 0.51)]), new Wave([new Enemy(Chara.all[126], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[109], 0.31)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[84], 0.31)]), new Wave([new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[67], 0.31)]), new Wave([new Enemy(Chara.all[104], 0.51), new Enemy(Chara.all[38], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[58], 0.51)]), new Wave([new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0)]), new Wave([new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[123], 0.31), new Enemy(Chara.all[89], 0.31)])])]),
new Quest(26, "まりりんぴっく　応援団の部", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[53], 1.0)]), new Wave([new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[10], 0.51)]), new Wave([new Enemy(Chara.all[127], 0.11), new Enemy(Chara.all[9], 0.31), new Enemy(Chara.all[51], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[25], 0.51)]), new Wave([new Enemy(Chara.all[36], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[19], 0.51), new Enemy(Chara.all[59], 0.51)]), new Wave([new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[7], 0.51)]), new Wave([new Enemy(Chara.all[127], 0.31), new Enemy(Chara.all[105], 0.31), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[7], 0.31)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[109], 0.31)]), new Wave([new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[67], 0.31)]), new Wave([new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[59], 0.51)]), new Wave([new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0)]), new Wave([new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[21], 0.31)])])]),
new Quest(27, "まりりんぴっく　父兄の部", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[54], 1.0)]), new Wave([new Enemy(Chara.all[64], 0.51), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[15], 0.51)]), new Wave([new Enemy(Chara.all[128], 0.11), new Enemy(Chara.all[13], 0.31), new Enemy(Chara.all[16], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[25], 0.51)]), new Wave([new Enemy(Chara.all[85], 0.51), new Enemy(Chara.all[74], 0.51), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[60], 0.51)]), new Wave([new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[7], 0.51)]), new Wave([new Enemy(Chara.all[128], 0.31), new Enemy(Chara.all[51], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[7], 0.31)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[15], 0.0), new Enemy(Chara.all[16], 0.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[13], 0.0)]), new Wave([new Enemy(Chara.all[64], 0.51), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[68], 0.31)]), new Wave([new Enemy(Chara.all[88], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[60], 0.51)]), new Wave([new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0)]), new Wave([new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[32], 0.31), new Enemy(Chara.all[33], 0.31), new Enemy(Chara.all[34], 0.31)])])]),
new Quest(28, "体育の日乱入クエスト", true, [new Difficulty("野獣&遠野戦", [new Wave([new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[128], 0.0), new Enemy(Chara.all[127], 0.0), new Enemy(Chara.all[126], 0.0)])])]),
new Quest(29, "UDK姉妹乱入クエスト", true, [new Difficulty("MZ姉貴戦", [new Wave([new Enemy(Chara.all[130], 1.0), new Enemy(Chara.all[126], 0.21), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[4], 0.0)])]), new Difficulty("AZS姉貴戦", [new Wave([new Enemy(Chara.all[131], 1.0), new Enemy(Chara.all[127], 0.21), new Enemy(Chara.all[17], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[14], 0.0)])]), new Difficulty("RI姉貴戦", [new Wave([new Enemy(Chara.all[132], 1.0), new Enemy(Chara.all[128], 0.21), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[7], 0.0)])]), new Difficulty("朗読兄貴戦", [new Wave([new Enemy(Chara.all[133], 1.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[1], 1.0)])])]),
new Quest(30, "立　教　大　学", true, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[12], 0.0)]), new Wave([new Enemy(Chara.all[52], 0.31), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[127], 0.31)]), new Wave([new Enemy(Chara.all[137], 0.31), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[17], 0.0)]), new Wave([new Enemy(Chara.all[53], 0.31), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[128], 0.31)]), new Wave([new Enemy(Chara.all[138], 0.31), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[7], 0.0)]), new Wave([new Enemy(Chara.all[54], 0.31), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[126], 0.31)]), new Wave([new Enemy(Chara.all[141], 0.06), new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[16], 0.31)]), new Wave([new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[22], 0.51)]), new Wave([new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[11], 0.0)]), new Wave([new Enemy(Chara.all[134], 0.31), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[127], 1.0)]), new Wave([new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0)]), new Wave([new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0)]), new Wave([new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[17], 1.0)]), new Wave([new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[101], 1.0)]), new Wave([new Enemy(Chara.all[141], 0.21), new Enemy(Chara.all[139], 0.31), new Enemy(Chara.all[137], 0.31), new Enemy(Chara.all[138], 0.31), new Enemy(Chara.all[35], 0.31)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[135], 0.31), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0)]), new Wave([new Enemy(Chara.all[52], 0.0), new Enemy(Chara.all[44], 0.0), new Enemy(Chara.all[71], 0.0), new Enemy(Chara.all[43], 0.0), new Enemy(Chara.all[39], 0.0)]), new Wave([new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[94], 0.0), new Enemy(Chara.all[127], 1.0)]), new Wave([new Enemy(Chara.all[134], 1.0), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[69], 0.0)]), new Wave([new Enemy(Chara.all[53], 0.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[107], 0.0)]), new Wave([new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0)]), new Wave([new Enemy(Chara.all[136], 0.31), new Enemy(Chara.all[21], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[104], 0.0)]), new Wave([new Enemy(Chara.all[54], 0.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[14], 0.0)]), new Wave([new Enemy(Chara.all[139], 0.0), new Enemy(Chara.all[70], 0.0), new Enemy(Chara.all[126], 0.0), new Enemy(Chara.all[93], 0.0), new Enemy(Chara.all[88], 0.0)]), new Wave([new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[103], 0.0), new Enemy(Chara.all[101], 0.0)]), new Wave([new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[138], 0.0)]), new Wave([new Enemy(Chara.all[141], 0.51), new Enemy(Chara.all[139], 0.51), new Enemy(Chara.all[137], 0.51), new Enemy(Chara.all[138], 0.51), new Enemy(Chara.all[140], 0.31)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[135], 1.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0)]), new Wave([new Enemy(Chara.all[52], 0.0), new Enemy(Chara.all[44], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[43], 0.0), new Enemy(Chara.all[39], 0.0)]), new Wave([new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[94], 0.0), new Enemy(Chara.all[127], 1.0)]), new Wave([new Enemy(Chara.all[134], 1.0), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[69], 0.0)]), new Wave([new Enemy(Chara.all[53], 0.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[107], 0.0)]), new Wave([new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[38], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[41], 0.0)]), new Wave([new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0)]), new Wave([new Enemy(Chara.all[136], 1.0), new Enemy(Chara.all[21], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[18], 0.0)]), new Wave([new Enemy(Chara.all[54], 0.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[14], 0.0)]), new Wave([new Enemy(Chara.all[139], 0.0), new Enemy(Chara.all[70], 0.0), new Enemy(Chara.all[126], 0.0), new Enemy(Chara.all[93], 0.0), new Enemy(Chara.all[88], 0.0)]), new Wave([new Enemy(Chara.all[140], 0.0), new Enemy(Chara.all[109], 0.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 0.0)]), new Wave([new Enemy(Chara.all[141], 1.0), new Enemy(Chara.all[142], 0.31), new Enemy(Chara.all[137], 0.51), new Enemy(Chara.all[139], 0.51), new Enemy(Chara.all[140], 0.31)]), new Wave([new Enemy(Chara.all[143], 1.0), new Enemy(Chara.all[141], 1.0), new Enemy(Chara.all[142], 1.0)])])]),
new Quest(31, "セミ兄貴の森", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[50], 0.31), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[50], 0.61), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)])]), new Difficulty("LEG", [new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[109], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]), new Wave([new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0)]), new Wave([new Enemy(Chara.all[112], 1.0), new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[109], 1.0)])])]),
new Quest(32, "妖精の森", false, [new Difficulty("EAS", [new Wave([new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[47], 0.0)]), new Wave([new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[46], 0.0)]), new Wave([new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[119], 1.0), new Enemy(Chara.all[121], 0.0), new Enemy(Chara.all[122], 0.0), new Enemy(Chara.all[120], 0.0)])]), new Difficulty("ADV", [new Wave([new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[47], 0.0)]), new Wave([new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[46], 0.0)]), new Wave([new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[49], 0.0)]), new Wave([new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[119], 0.51), new Enemy(Chara.all[121], 1.0), new Enemy(Chara.all[122], 1.0), new Enemy(Chara.all[120], 1.0)])]), new Difficulty("EXH", [new Wave([new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[47], 0.0)]), new Wave([new Enemy(Chara.all[119], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[46], 0.0)]), new Wave([new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[121], 0.0), new Enemy(Chara.all[123], 1.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[45], 0.0)]), new Wave([new Enemy(Chara.all[122], 1.0), new Enemy(Chara.all[49], 0.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 0.0)]), new Wave([new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[121], 1.0), new Enemy(Chara.all[124], 1.0), new Enemy(Chara.all[123], 1.0)])])])
];

var target;
function redraw() {
    mySetCookie("version", 1, 365);
    mySetCookie("trophy_setting", Chara.all.map(function(chara) {
        return $("#trophy_setting_" + chara.id);
    }).map(function(checkbox) {
        return checkbox.size() == 0 ? "x" : Number(checkbox.prop("checked")).toString();
    }).join(""), 365);

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);

    if (target instanceof Difficulty) {
        target.calcDropProbability(
          Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
        ).toArray().sort(function(x, y){
            var primaryCondition = y[1][$("#cocoa_setting").val()] - x[1][$("#cocoa_setting").val()];
            var secondaryCondition = x[0].trophyOrder - y[0].trophyOrder;
            return primaryCondition != 0 ? primaryCondition : secondaryCondition;
        }).toHash().forEach(function(chara, dropProbability) {
            var tr = $(document.createElement("tr")).append(
              $(document.createElement("th")).append(chara.createLink())
            ).append(
              $(document.createElement("td")).css("font-family", "monospace").text(
                formatProbability(dropProbability[$("#cocoa_setting").val()])
              )
            );
            tbody.append(tr);
        });
    } else if (target instanceof Chara) {
        target.calcDropProbability(
          Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
        ).toArray().sort(function(x, y){
            var primaryCondition = y[1][$("#cocoa_setting").val()] - x[1][$("#cocoa_setting").val()];
            var secondaryCondition = x[0].id - y[0].id;
            return primaryCondition != 0 ? primaryCondition : secondaryCondition;
        }).toHash().forEach(function(difficultyName, dropProbability) {
            var tr = $(document.createElement("tr")).append(
              $(document.createElement("th")).text(difficultyName)
            ).append(
              $(document.createElement("td")).css("font-family", "monospace").text(
                formatProbability(dropProbability[$("#cocoa_setting").val()])
              )
            );
            tbody.append(tr);
        });
    }
    
    $("#drop_probability").empty().append(table);
}

$(function() {
    Quest.all.forEach(function(quest) {
        quest.difficulties.forEach(function(difficulty, index) {
            var option = $(document.createElement("option")).attr({value: quest.id + "_" + index}).text(quest.name + "(" + difficulty.name + ")");
            $("#quest_setting").append(option);
        });
    });
    $("#quest_setting").on("change", function() {
        var quest = Quest.all[parseInt($("#quest_setting").val().split(/_/)[0], 10)];
        var difficulty = quest.difficulties[parseInt($("#quest_setting").val().split(/_/)[1], 10)];
        target = difficulty;
        redraw();
    });
    $("#cocoa_setting").on("change", redraw);
    var savedTrophySetting = Range.closed(0, 2).map(function(){return true}).
        concat(Range.closed(3, 54).map(function(){return false})).
        concat(Range.closed(55, 56).map(function(){return void(0)})).
        concat(Range.closed(57, Chara.all.length - 1).map(function(){return false}));
    if(myGetCookie("trophy_setting") !== null) {
        myGetCookie("trophy_setting").split("").map(function(flg){
            return (flg == "x") ? void(0) : (flg == "1");
        }).forEach(function(isTrophyCaught, id) {
            if (isTrophyCaught !== void(0)) {
                savedTrophySetting[id] = isTrophyCaught;
            }
        });
    }
    Chara.all.concat().sort(function(x, y){return x.trophyOrder - y.trophyOrder}).slice(0, Chara.all.length - 2).forEach(function(chara) {
        var checkbox = $(document.createElement("input")).attr({
            id: "trophy_setting_" + chara.id,
            type: "checkbox",
            value: chara.id,
        }).on("change", redraw);
        checkbox.prop("checked", savedTrophySetting[chara.id]);
        $("#trophy_setting").append(checkbox).append(chara.createLink()).append($(document.createElement("br")));
    });
    $("#trophy_all_check").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", true);
        redraw();
    });
    $("#trophy_all_uncheck").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", false);
        redraw();
    });
    
    $("#quest_setting").trigger("change");
});
