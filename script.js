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
    var value = void(0);
    var cookie = document.cookie + ";";
    var offset = cookie.indexOf(key);
    if (offset > -1) {
        var start = offset + key.length;
        var end = cookie.indexOf(";", start);
        value = decodeURIComponent(cookie.substring(start, end));
    }
    var valueAsNumber = Number(value);
    if (isNaN(valueAsNumber)) return value;
    return valueAsNumber;
}

var SaveData = {
    save: function() {
        mySetCookie("version", 1, 365);
        mySetCookie("trophy_setting", Chara.all.map(function(chara) {
            return $("#trophy_setting_" + chara.id);
        }).map(function(checkbox) {
            return checkbox.size() == 0 ? "x" : Number(checkbox.prop("checked")).toString();
        }).join(""), 365);
    },
    load: function() {
        var savedTrophySetting = Range.closed(0, 2).map(function(){return true}).
            concat(Range.closed(3, 54).map(function(){return false})).
            concat(Range.closed(55, 56).map(function(){return void(0)})).
            concat(Range.closed(57, Chara.all.length - 1).map(function(){return false}));
        if(myGetCookie("trophy_setting") !== void(0)) {
            myGetCookie("trophy_setting").split("").map(function(flg){
                return (flg == "x") ? void(0) : (flg == "1");
            }).forEach(function(isTrophyCaught, id) {
                if (isTrophyCaught !== void(0)) {
                    savedTrophySetting[id] = isTrophyCaught;
                }
            });
        }
        return savedTrophySetting;
    }
};

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
Chara.prototype.calcDropProbabilities = function(uncaughtCharas) {
    return Difficulty.all.filter(function(difficulty){return difficulty.appears(this)}, this).map(function(difficulty) {
        return [
            difficulty,
            difficulty.calcDropProbabilities(uncaughtCharas).toArray().find(function(pair){return pair[0] == this}, this)[1]
        ];
    }, this).toHash();
};
Chara.prototype.createLink = function() {
    var self = this;
    return $(document.createElement("a")).attr("href", "javascript:void(0);").text(self.name).click(function() {
        $("#chara_setting").val(self.id.toString());
        $("#difficulty_setting").val("-1");
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
new Chara(18, "野獣先輩", 20),
new Chara(19, "遠野", 21),
new Chara(20, "KMR", 22),
new Chara(21, "MUR大先輩", 23),
new Chara(22, "サイクロップス先輩", 24),
new Chara(23, "ひで", 25),
new Chara(24, "関西チャラ男", 26),
new Chara(25, "医師TRN", 27),
new Chara(26, "SNJ", 28),
new Chara(27, "KBTIT", 29),
new Chara(28, "虐待おじさん", 30),
new Chara(29, "平野源五郎", 31),
new Chara(30, "ONDISK", 32),
new Chara(31, "HND△", 33),
new Chara(32, "KBSトリオK", 34),
new Chara(33, "KBSトリオB", 35),
new Chara(34, "KBSトリオS", 36),
new Chara(35, "TNOK", 37),
new Chara(36, "中野くん", 38),
new Chara(37, "MYN", 39),
new Chara(38, "課長", 40),
new Chara(39, "AKYS", 41),
new Chara(40, "ドラゴン田中", 42),
new Chara(41, "HGKM様", 43),
new Chara(42, "TKNUC", 44),
new Chara(43, "SIY", 45),
new Chara(44, "GO", 46),
new Chara(45, "レッドセミ兄貴", 171),
new Chara(46, "ブルーセミ兄貴", 172),
new Chara(47, "セミ兄貴", 173),
new Chara(48, "光に満ちたセミ兄貴", 174),
new Chara(49, "闇に堕ちたセミ兄貴", 175),
new Chara(50, "メガカイロSIK", 176),
new Chara(51, "サマーMSTA姉貴", 195),
new Chara(52, "バレンタインRIM", 199),
new Chara(53, "バレンタインUDK", 200),
new Chara(54, "バレンタインALC", 201),
new Chara(55, "YKR姉貴", 233),
new Chara(56, "邪神GO", 234),
new Chara(57, "SNE姉貴", 136),
new Chara(58, "SWK様", 137),
new Chara(59, "風神KNK", 138),
new Chara(60, "神々の頂点SWK", 139),
new Chara(61, "イワナを焼くUDK", 130),
new Chara(62, "サマーRIM姉貴", 196),
new Chara(63, "サマーUDK姉貴", 197),
new Chara(64, "サマーALC姉貴", 198),
new Chara(65, "サマーHZR姉貴", 202),
new Chara(66, "サマーピンキー姉貴", 208),
new Chara(67, "MRKM先生", 47),
new Chara(68, "鬼畜教師KN", 48),
new Chara(69, "ゴーグル先生", 51),
new Chara(70, "マスクド永谷園", 50),
new Chara(71, "ラヴォイル校長", 49),
new Chara(72, "メガデス怪人", 52),
new Chara(73, "メガデス戦闘員", 53),
new Chara(74, "草薙ケン", 54),
new Chara(75, "松平ジョー", 55),
new Chara(76, "YMMちゃん", 143),
new Chara(77, "PLSY姉貴", 144),
new Chara(78, "YUG姉貴", 145),
new Chara(79, "STR姉貴", 146),
new Chara(80, "ORN姉貴", 147),
new Chara(81, "KISちゃん", 148),
new Chara(82, "太陽神NDK", 149),
new Chara(83, "殺人鬼MNR", 56),
new Chara(84, "一般通過爺", 57),
new Chara(85, "山崎まさゆき", 58),
new Chara(86, "ISI君", 59),
new Chara(87, "金泰均", 60),
new Chara(88, "ISHR先生", 61),
new Chara(89, "ピンキー姉貴", 62),
new Chara(90, "たまドラ田中", 229),
new Chara(91, "MMJ姉貴", 194),
new Chara(92, "いなり男", 63),
new Chara(93, "AKG", 64),
new Chara(94, "関西クレーマー", 65),
new Chara(95, "現場監督", 66),
new Chara(96, "変態郵便屋", 121),
new Chara(97, "インパルスITKR", 122),
new Chara(98, "小森", 123),
new Chara(99, "ホリ・トオル", 124),
new Chara(100, "ラザマリナ", 131),
new Chara(101, "BNKRG姉貴", 67),
new Chara(102, "KNN姉貴", 68),
new Chara(103, "SNNN姉貴", 69),
new Chara(104, "スライムナイトESK", 70),
new Chara(105, "KNNフェニックス", 71),
new Chara(106, "ポジ子", 72),
new Chara(107, "TIS姉貴", 73),
new Chara(108, "ボイスドラマ業者TIS", 74),
new Chara(109, "植木鉢くん", 120),
new Chara(110, "PSR姉貴", 140),
new Chara(111, "化物と化したPSR姉貴", 141),
new Chara(112, "全てを狩る先輩", 177),
new Chara(113, "花嫁と化した先輩", 203),
new Chara(114, "嫁TIT", 204),
new Chara(115, "花嫁ピンキー", 205),
new Chara(116, "ノンケスレイヤー", 206),
new Chara(117, "BSTIT", 207),
new Chara(118, "ビリー兄貴", 178),
new Chara(119, "木吉カズヤ", 179),
new Chara(120, "井上カブレラ", 180),
new Chara(121, "いかりやビオランテ", 181),
new Chara(122, "TDNコスギ", 182),
new Chara(123, "赤さん", 183),
new Chara(124, "VAN様", 184),
new Chara(125, "カグラ=ウヅキ", 132),
new Chara(126, "ESKちゃん", 209),
new Chara(127, "YW姉貴", 210),
new Chara(128, "ITUASK", 211),
new Chara(129, "バンホーテンダー", 133),
new Chara(130, "MZ姉貴", 212),
new Chara(131, "AZS姉貴", 213),
new Chara(132, "RI姉貴", 214),
new Chara(133, "朗読兄貴", 215),
new Chara(134, "デビルひで", 151),
new Chara(135, "ナイトメアビリー兄貴", 152),
new Chara(136, "ベルモンド先輩", 153),
new Chara(137, "ナイトメアMIRN姉貴", 154),
new Chara(138, "ナイトメアKSDB姉貴", 155),
new Chara(139, "ナイトメアPCLY姉貴", 156),
new Chara(140, "ナイトメアSKY姉貴", 157),
new Chara(141, "ナイトメアRMLA姉貴", 158),
new Chara(142, "ナイトメアFLNちゃん", 159),
new Chara(143, "スカーレット内閣", 160),
new Chara(144, "黄金のSWK様", 142),
new Chara(145, "ZNM姉貴", 150),
new Chara(146, "AOK", 75),
new Chara(147, "NRK姉貴", 76),
new Chara(148, "変態糞親父", 77),
new Chara(149, "変態糞娘", 78),
new Chara(150, "我修院", 79),
new Chara(151, "TKGW様", 80),
new Chara(152, "貴乃信", 81),
new Chara(153, "篤太郎", 82),
new Chara(154, "創造神KMR", 83),
new Chara(155, "中盤に出てくる鳥", 228),
new Chara(156, "ダークロウ先輩", 134),
new Chara(157, "交通整理DIちゃん", 119),
new Chara(158, "世界のトオノ", 125),
new Chara(159, "ビューティ先輩", 126),
new Chara(160, "ミミックおばさん", 161),
new Chara(161, "メカNDK", 135),
new Chara(162, "AY姉貴", 223),
new Chara(163, "TNS姉貴", 224),
new Chara(164, "HTT姉貴", 225),
new Chara(165, "MDCNちゃん", 226),
new Chara(166, "RNNSK兄貴", 227),
new Chara(167, "逝かせ隊", 84),
new Chara(168, "ポイテーロ", 85),
new Chara(169, "ウルトラマンタクヤ", 127),
new Chara(170, "LNK", 86),
new Chara(171, "キモヲタ平野", 89),
new Chara(172, "TNKL", 87),
new Chara(173, "うさぎ", 88),
new Chara(174, "タナトスひで", 90),
new Chara(175, "Y.AOI", 162),
new Chara(176, "メガMTGRS先輩", 163),
new Chara(177, "須藤さん", 185),
new Chara(178, "池田茂美", 186),
new Chara(179, "妖精王チチラルー", 187),
new Chara(180, "ALISON兄貴", 220),
new Chara(181, "ZUN", 221),
new Chara(182, "チャリオット平野", 216),
new Chara(183, "剣聖おじさん", 217),
new Chara(184, "破面KBTIT", 218),
new Chara(185, "AKMRくん", 219),
new Chara(186, "CNTちゃん", 91),
new Chara(187, "EIL姉貴", 92),
new Chara(188, "RNK姉貴", 93),
new Chara(189, "GNHくん", 94),
new Chara(190, "NSDR兄貴", 95),
new Chara(191, "YOU THE ROCK★", 96),
new Chara(192, "根流し木こり", 97),
new Chara(193, "イワナ和尚", 98),
new Chara(194, "ぼうや先輩", 99),
new Chara(195, "MIRN姉貴~ZERO~", 18),
new Chara(196, "オーバーロードYUK姉貴", 19),
new Chara(197, "完全勝利した淫夢くんUC", 230),
new Chara(198, "風来人RU", 188),
new Chara(199, "ESKドラゴン", 189),
new Chara(200, "ジャボテンダーALC", 190),
new Chara(201, "多脚ひで", 191),
new Chara(202, "ピン鬼", 192),
new Chara(203, "ダークドレアム先輩", 193),
new Chara(204, "釣リスマスおばさん", 231),
new Chara(205, "GTさん", 128),
new Chara(206, "超能力者ONDISK", 129),
new Chara(207, "NZRN", 164),
new Chara(208, "KGSちゃん", 165),
new Chara(209, "ICRN姉貴", 166),
new Chara(210, "MRS姉貴", 167),
new Chara(211, "SYOU姉貴", 168),
new Chara(212, "HZR姉貴", 169),
new Chara(213, "NUEちゃん", 170),
new Chara(214, "KBTIT(詐欺師)", 100),
new Chara(215, "KBTIT(ギタリスト)", 101),
new Chara(216, "KBTIT(パイロット)", 102),
new Chara(217, "TITニング", 103),
new Chara(218, "KBTIT(調査兵団)", 104),
new Chara(219, "KBTIT(怪人)", 105),
new Chara(220, "KBTIT(漫画家)", 106),
new Chara(221, "ASTK姉貴", 107),
new Chara(222, "マジメくん", 108),
new Chara(223, "KYN", 109),
new Chara(224, "MMR部長", 110),
new Chara(225, "NSOK", 111),
new Chara(226, "DRVS", 112),
new Chara(227, "SBR", 113),
new Chara(228, "観葉植物くん", 114),
new Chara(229, "TDN", 115),
new Chara(230, "DB", 116),
new Chara(231, "HTN", 117),
new Chara(232, "真夏の夜の淫夢", 118),
new Chara(233, "斬月・真SIK", 222),
new Chara(234, "淫夢之一太刀SIK", 232)
];

function Enemy(chara, dropCandidateProbabilityAsChara) {
    this.chara = chara;
    this.dropCandidateProbabilityAsChara = dropCandidateProbabilityAsChara;
}

function Difficulty(id, name, finished, enemies) {
    this.id = id;
    this.name = name;
    this.finished = finished;
    this.enemies = enemies;
    this.cache = {};
}
Difficulty.prototype.toString = function() {
    return this.id.toString();
};
Difficulty.prototype.createLink = function() {
    var self = this;
    var link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(self.name).click(function() {
        $("#difficulty_setting").val(self.id.toString());
        $("#chara_setting").val("-1");
        redraw();
    });
    return self.finished ? $(document.createElement("del")).append(link) : link;
};
Difficulty.prototype.appears = function(chara) {
    return this.enemies.map(f("chara")).includes(chara);
};
Difficulty.prototype.calcDropProbabilities = function(uncaughtCharas) {
    var cacheKey = uncaughtCharas.map(function(_){return _.toString()}).sort().join(",");
    if (this.cache.hasOwnProperty(cacheKey)) {
        return this.cache[cacheKey];
    }
    function safeProd() {
        var operands = Array.prototype.slice.call(arguments);
        return operands.map(function(pair) {
            var numerator = pair[0];
            var denominator = pair[1];
            return numerator > 0 && denominator > 0 ? numerator / denominator : 0;
        }).reduce(PROD, 1);
    }
    var generateUniqueNumber = (function() {
        var number = -1;
        return function() {
            number++;
            return number;
        };
    })();
    var charaHash = this.enemies.map(f("chara")).uniq().map(function(chara){return [chara, {cocoaful: 0, cocoaless: 0}]}).toHash();
    this.enemies.groupBy(f("chara")).map(function(chara, enemies) {
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
            return generateUniqueNumber();
        case 2:
            return new Hash({
                probability: firstLevelEvent[0].probability,
                weight: firstLevelEvent[0].charaInfoSet[0].weight
            });
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
                charaHash[charaInfo.chara].cocoaful += eventProbability * charaInfo.density;
                charaHash[charaInfo.chara].cocoaless += eventProbability * charaInfo.density;
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
    return this.cache[cacheKey] = charaHash;
};
Difficulty.all = [
new Difficulty(0, "博麗神社(EAS)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 0.0)]),
new Difficulty(1, "博麗神社(ADV)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0)]),
new Difficulty(2, "博麗神社(EXH)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]),
new Difficulty(3, "妖怪の森(EAS)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0)]),
new Difficulty(4, "妖怪の森(ADV)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0)]),
new Difficulty(5, "妖怪の森(EXH)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[11], 0.31)]),
new Difficulty(6, "人間の里(EAS)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[9], 0.11), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0)]),
new Difficulty(7, "人間の里(ADV)", false, [new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[12], 0.11)]),
new Difficulty(8, "人間の里(EXH)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[12], 0.51)]),
new Difficulty(9, "神社上空(EAS)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[8], 0.11), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0)]),
new Difficulty(10, "神社上空(ADV)", false, [new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[12], 0.11)]),
new Difficulty(11, "神社上空(EXH)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[12], 0.51)]),
new Difficulty(12, "紅魔館(EAS)", false, [new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[12], 0.11), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.11), new Enemy(Chara.all[12], 0.11)]),
new Difficulty(13, "紅魔館(ADV)", false, [new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[11], 0.11), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 0.51)]),
new Difficulty(14, "紅魔館(EXH)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[16], 0.51), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[14], 1.0)]),
new Difficulty(15, "紅魔館(LEG)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[13], 1.0)]),
new Difficulty(16, "太陽の畑(EAS)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[9], 0.31), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.11), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[3], 0.11), new Enemy(Chara.all[4], 0.11)]),
new Difficulty(17, "太陽の畑(ADV)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]),
new Difficulty(18, "太陽の畑(EXH)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0)]),
new Difficulty(19, "太陽の畑(LEG)", false, [new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[195], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[16], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[157], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[196], 1.0), new Enemy(Chara.all[109], 0.0), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[157], 0.51)]),
new Difficulty(20, "下北沢(EAS)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[21], 0.0)]),
new Difficulty(21, "下北沢(ADV)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[19], 0.51), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 0.0)]),
new Difficulty(22, "下北沢(EXH)", false, [new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 0.51)]),
new Difficulty(23, "下北沢(LEG)", false, [new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[157], 0.51), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[13], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[159], 0.51), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[109], 1.0)]),
new Difficulty(24, "新宿調教センター(EAS)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[27], 0.11), new Enemy(Chara.all[18], 0.11), new Enemy(Chara.all[23], 0.11), new Enemy(Chara.all[28], 0.0)]),
new Difficulty(25, "新宿調教センター(ADV)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[27], 0.51), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[23], 0.51), new Enemy(Chara.all[28], 0.51)]),
new Difficulty(26, "新宿調教センター(EXH)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 1.0)]),
new Difficulty(27, "新宿調教センター(LEG)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[168], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[152], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[167], 0.51), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[169], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[29], 1.0)]),
new Difficulty(28, "豪尻商事(EAS)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 0.11), new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 0.11), new Enemy(Chara.all[26], 0.11), new Enemy(Chara.all[28], 0.11)]),
new Difficulty(29, "豪尻商事(ADV)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 0.51), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[28], 0.51)]),
new Difficulty(30, "豪尻商事(EXH)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[21], 1.0)]),
new Difficulty(31, "豪尻商事(LEG)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[205], 0.51), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[70], 0.51), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[19], 0.31), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[190], 0.51), new Enemy(Chara.all[85], 0.31), new Enemy(Chara.all[7], 0.11), new Enemy(Chara.all[147], 0.31), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[84], 0.31), new Enemy(Chara.all[32], 0.31), new Enemy(Chara.all[33], 0.11), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[206], 0.31), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[25], 0.0)]),
new Difficulty(32, "SGW急便本社(EAS)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.31), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 0.11), new Enemy(Chara.all[37], 0.11), new Enemy(Chara.all[29], 0.11), new Enemy(Chara.all[26], 0.11), new Enemy(Chara.all[38], 0.11)]),
new Difficulty(33, "SGW急便本社(ADV)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[38], 0.51)]),
new Difficulty(34, "SGW急便本社(EXH)", false, [new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[21], 1.0)]),
new Difficulty(35, "谷岡組系事務所(EAS)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 0.31), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[37], 0.11), new Enemy(Chara.all[35], 0.11), new Enemy(Chara.all[36], 0.11), new Enemy(Chara.all[24], 0.11), new Enemy(Chara.all[34], 1.0)]),
new Difficulty(36, "谷岡組系事務所(ADV)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[42], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[36], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[21], 0.51)]),
new Difficulty(37, "谷岡組系事務所(EXH)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[36], 1.0)]),
new Difficulty(38, "迫真空手道場(EAS)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[10], 0.11), new Enemy(Chara.all[17], 0.11), new Enemy(Chara.all[18], 1.0)]),
new Difficulty(39, "迫真空手道場(ADV)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[18], 1.0)]),
new Difficulty(40, "迫真空手道場(EXH)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[18], 1.0)]),
new Difficulty(41, "スポーツメンズクラブ(EAS)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[40], 0.11), new Enemy(Chara.all[42], 0.11), new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 1.0)]),
new Difficulty(42, "スポーツメンズクラブ(ADV)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[40], 0.51), new Enemy(Chara.all[42], 0.51), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[29], 1.0)]),
new Difficulty(43, "スポーツメンズクラブ(EXH)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0)]),
new Difficulty(44, "ヒゲクマ屋敷(EAS)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[41], 0.11), new Enemy(Chara.all[28], 0.11), new Enemy(Chara.all[30], 0.11), new Enemy(Chara.all[29], 1.0)]),
new Difficulty(45, "ヒゲクマ屋敷(ADV)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[23], 0.51), new Enemy(Chara.all[42], 1.0)]),
new Difficulty(46, "ヒゲクマ屋敷(EXH)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[36], 1.0)]),
new Difficulty(47, "邪神の塔(EAS)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[44], 0.11), new Enemy(Chara.all[43], 0.11), new Enemy(Chara.all[24], 0.11), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[56], 0.0)]),
new Difficulty(48, "邪神の塔(ADV)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[30], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[56], 0.0)]),
new Difficulty(49, "邪神の塔(EXH)", false, [new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[24], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[56], 0.0)]),
new Difficulty(50, "さくらんぼ小学校(EAS)", false, [new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[70], 0.51), new Enemy(Chara.all[23], 1.0)]),
new Difficulty(51, "さくらんぼ小学校(ADV)", false, [new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[69], 0.71), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[70], 0.51), new Enemy(Chara.all[23], 1.0)]),
new Difficulty(52, "さくらんぼ小学校(EXH)", false, [new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[68], 1.0)]),
new Difficulty(53, "秘密結社メガデス(EAS)", false, [new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51)]),
new Difficulty(54, "秘密結社メガデス(ADV)", false, [new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[74], 0.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[75], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[73], 0.51)]),
new Difficulty(55, "秘密結社メガデス(EXH)", false, [new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[73], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[73], 1.0), new Enemy(Chara.all[75], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 0.51)]),
new Difficulty(56, "聖バビロン大学病院(EAS)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[18], 0.51)]),
new Difficulty(57, "聖バビロン大学病院(ADV)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[37], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[67], 0.51)]),
new Difficulty(58, "聖バビロン大学病院(EXH)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[83], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[68], 0.31), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 0.31), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[89], 0.31), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[67], 0.51)]),
new Difficulty(59, "赤城不動産(EAS)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[92], 0.31), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[94], 0.31), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[69], 0.51)]),
new Difficulty(60, "赤城不動産(ADV)", false, [new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 0.51), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[94], 0.51), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[67], 0.51)]),
new Difficulty(61, "赤城不動産(EXH)", false, [new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 0.51), new Enemy(Chara.all[32], 1.0), new Enemy(Chara.all[33], 1.0), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[34], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[89], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[73], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[95], 0.51), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[13], 0.0), new Enemy(Chara.all[67], 0.51)]),
new Difficulty(62, "よっちゃんイカ工場(EAS)", false, [new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[101], 0.31), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[107], 0.31), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)]),
new Difficulty(63, "よっちゃんイカ工場(ADV)", false, [new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[103], 0.31), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)]),
new Difficulty(64, "よっちゃんイカ工場(EXH)", false, [new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[83], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[104], 0.31), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[30], 0.51)]),
new Difficulty(65, "よっちゃんイカ工場(LEG)", false, [new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[107], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[31], 0.51), new Enemy(Chara.all[108], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[102], 1.0)]),
new Difficulty(66, "岡山県(EAS)", false, [new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[146], 0.51), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[101], 0.31), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[147], 0.51), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[104], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[3], 1.0), new Enemy(Chara.all[148], 0.11), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[10], 0.51)]),
new Difficulty(67, "岡山県(ADV)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[151], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[150], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[89], 1.0), new Enemy(Chara.all[106], 0.51), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[148], 0.51), new Enemy(Chara.all[149], 0.31), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[39], 0.51)]),
new Difficulty(68, "岡山県(EXH)", false, [new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[151], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[152], 0.51), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[150], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[89], 1.0), new Enemy(Chara.all[106], 0.51), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[153], 0.31), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[152], 0.51), new Enemy(Chara.all[148], 0.31), new Enemy(Chara.all[149], 0.31), new Enemy(Chara.all[154], 0.31), new Enemy(Chara.all[11], 0.51)]),
new Difficulty(69, "少年市場(EAS)", false, [new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[148], 0.51), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[94], 0.31), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[36], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[170], 0.11), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[171], 0.11), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[18], 0.0)]),
new Difficulty(70, "少年市場(ADV)", false, [new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[158], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[172], 0.51), new Enemy(Chara.all[37], 1.0), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[151], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[148], 1.0), new Enemy(Chara.all[149], 0.51), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[170], 0.51), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[152], 1.0), new Enemy(Chara.all[4], 1.0), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[171], 0.51), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[21], 0.31), new Enemy(Chara.all[39], 0.51)]),
new Difficulty(71, "少年市場(EXH)", false, [new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[68], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[157], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[87], 1.0), new Enemy(Chara.all[172], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[173], 0.51), new Enemy(Chara.all[157], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[148], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[149], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[170], 0.31), new Enemy(Chara.all[153], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[152], 1.0), new Enemy(Chara.all[27], 0.51), new Enemy(Chara.all[174], 0.31), new Enemy(Chara.all[146], 0.31), new Enemy(Chara.all[171], 0.31), new Enemy(Chara.all[88], 0.51)]),
new Difficulty(72, "南会津(EAS)", false, [new Enemy(Chara.all[186], 0.51), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[159], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[84], 1.0), new Enemy(Chara.all[188], 0.51), new Enemy(Chara.all[86], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[150], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[170], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[153], 0.31), new Enemy(Chara.all[190], 0.31), new Enemy(Chara.all[191], 0.31), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[158], 0.0)]),
new Difficulty(73, "南会津(ADV)", false, [new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[170], 1.0), new Enemy(Chara.all[15], 0.0), new Enemy(Chara.all[16], 0.0), new Enemy(Chara.all[153], 0.31), new Enemy(Chara.all[191], 0.51), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[84], 0.51), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[186], 1.0), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[190], 1.0), new Enemy(Chara.all[189], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[158], 0.31), new Enemy(Chara.all[192], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[40], 0.0), new Enemy(Chara.all[36], 0.0), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[193], 0.51), new Enemy(Chara.all[173], 0.31), new Enemy(Chara.all[21], 0.31), new Enemy(Chara.all[39], 0.51)]),
new Difficulty(74, "南会津(EXH)", false, [new Enemy(Chara.all[172], 1.0), new Enemy(Chara.all[171], 1.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[94], 0.0), new Enemy(Chara.all[190], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[147], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[158], 0.0), new Enemy(Chara.all[186], 1.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[191], 1.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[73], 0.0), new Enemy(Chara.all[189], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[103], 0.0), new Enemy(Chara.all[188], 0.0), new Enemy(Chara.all[171], 0.0), new Enemy(Chara.all[40], 1.0), new Enemy(Chara.all[192], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[89], 0.0), new Enemy(Chara.all[174], 1.0), new Enemy(Chara.all[146], 0.0), new Enemy(Chara.all[36], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[193], 1.0), new Enemy(Chara.all[187], 0.51), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[194], 0.51), new Enemy(Chara.all[84], 0.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0)]),
new Difficulty(75, "古代遺跡キモティ=ダロ(EAS)", false, [new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[24], 0.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[218], 0.51), new Enemy(Chara.all[146], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[187], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[216], 0.51), new Enemy(Chara.all[191], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[220], 0.11), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[188], 0.0), new Enemy(Chara.all[190], 0.0)]),
new Difficulty(76, "古代遺跡キモティ=ダロ(ADV)", false, [new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[30], 0.0), new Enemy(Chara.all[167], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[218], 1.0), new Enemy(Chara.all[214], 0.51), new Enemy(Chara.all[168], 1.0), new Enemy(Chara.all[172], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[148], 1.0), new Enemy(Chara.all[149], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[191], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[190], 0.0), new Enemy(Chara.all[158], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[219], 0.51), new Enemy(Chara.all[173], 0.0), new Enemy(Chara.all[192], 0.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[215], 0.51), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[189], 0.0), new Enemy(Chara.all[190], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[193], 1.0), new Enemy(Chara.all[187], 0.0), new Enemy(Chara.all[31], 0.0), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[220], 0.51), new Enemy(Chara.all[186], 0.31), new Enemy(Chara.all[26], 0.31), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[30], 0.0)]),
new Difficulty(77, "古代遺跡キモティ=ダロ(EXH)", false, [new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[217], 0.51), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[41], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[30], 0.0), new Enemy(Chara.all[167], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[218], 1.0), new Enemy(Chara.all[214], 0.51), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[170], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[148], 1.0), new Enemy(Chara.all[149], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[191], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[190], 0.0), new Enemy(Chara.all[158], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[219], 0.51), new Enemy(Chara.all[173], 0.0), new Enemy(Chara.all[192], 0.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[215], 0.51), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[189], 0.0), new Enemy(Chara.all[190], 0.31), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[159], 1.0), new Enemy(Chara.all[187], 0.0), new Enemy(Chara.all[109], 0.0), new Enemy(Chara.all[220], 1.0), new Enemy(Chara.all[186], 0.31), new Enemy(Chara.all[106], 0.31), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[221], 0.51), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[153], 1.0), new Enemy(Chara.all[152], 1.0), new Enemy(Chara.all[16], 1.0)]),
new Difficulty(78, "立教帝国(EAS)", false, [new Enemy(Chara.all[24], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[190], 1.0), new Enemy(Chara.all[191], 1.0), new Enemy(Chara.all[85], 1.0), new Enemy(Chara.all[215], 1.0), new Enemy(Chara.all[189], 1.0), new Enemy(Chara.all[226], 0.51), new Enemy(Chara.all[94], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[217], 1.0), new Enemy(Chara.all[186], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[150], 1.0), new Enemy(Chara.all[151], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[71], 1.0), new Enemy(Chara.all[219], 1.0), new Enemy(Chara.all[173], 1.0), new Enemy(Chara.all[92], 1.0), new Enemy(Chara.all[172], 1.0), new Enemy(Chara.all[192], 1.0), new Enemy(Chara.all[227], 0.51), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[93], 1.0), new Enemy(Chara.all[152], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[170], 1.0), new Enemy(Chara.all[153], 1.0), new Enemy(Chara.all[188], 1.0), new Enemy(Chara.all[109], 0.51), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[229], 0.11), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[193], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[19], 0.0)]),
new Difficulty(79, "立教帝国(ADV)", false, [new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[218], 0.51), new Enemy(Chara.all[220], 0.51), new Enemy(Chara.all[226], 0.51), new Enemy(Chara.all[227], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[186], 0.51), new Enemy(Chara.all[27], 0.51), new Enemy(Chara.all[147], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[190], 0.51), new Enemy(Chara.all[215], 0.51), new Enemy(Chara.all[223], 0.31), new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[68], 0.51), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[167], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[205], 0.51), new Enemy(Chara.all[148], 0.51), new Enemy(Chara.all[149], 0.51), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[85], 0.51), new Enemy(Chara.all[189], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[215], 0.51), new Enemy(Chara.all[224], 0.31), new Enemy(Chara.all[38], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[106], 0.31), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[194], 0.51), new Enemy(Chara.all[40], 0.51), new Enemy(Chara.all[187], 0.51), new Enemy(Chara.all[192], 0.51), new Enemy(Chara.all[174], 0.51), new Enemy(Chara.all[146], 0.51), new Enemy(Chara.all[95], 0.51), new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[229], 0.51), new Enemy(Chara.all[230], 0.31), new Enemy(Chara.all[223], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[224], 0.0)]),
new Difficulty(80, "立教帝国(EXH)", false, [new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[186], 0.51), new Enemy(Chara.all[69], 0.51), new Enemy(Chara.all[86], 0.51), new Enemy(Chara.all[19], 0.51), new Enemy(Chara.all[171], 0.51), new Enemy(Chara.all[88], 0.51), new Enemy(Chara.all[172], 0.51), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[192], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[153], 0.51), new Enemy(Chara.all[16], 0.51), new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[152], 0.51), new Enemy(Chara.all[225], 0.31), new Enemy(Chara.all[226], 0.51), new Enemy(Chara.all[227], 0.51), new Enemy(Chara.all[68], 0.51), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[167], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[205], 0.51), new Enemy(Chara.all[84], 0.51), new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[147], 0.51), new Enemy(Chara.all[224], 0.51), new Enemy(Chara.all[222], 0.31), new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[196], 0.31), new Enemy(Chara.all[191], 0.51), new Enemy(Chara.all[109], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[105], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[8], 0.51), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[169], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[74], 0.51), new Enemy(Chara.all[229], 0.51), new Enemy(Chara.all[230], 0.31), new Enemy(Chara.all[231], 0.51), new Enemy(Chara.all[220], 0.0), new Enemy(Chara.all[223], 0.0)]),
new Difficulty(81, "立教帝国(LEG)", false, [new Enemy(Chara.all[106], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[191], 0.0), new Enemy(Chara.all[154], 0.0), new Enemy(Chara.all[148], 0.0), new Enemy(Chara.all[149], 0.0), new Enemy(Chara.all[109], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[103], 0.0), new Enemy(Chara.all[107], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[158], 0.0), new Enemy(Chara.all[189], 0.0), new Enemy(Chara.all[174], 0.0), new Enemy(Chara.all[146], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[157], 0.0), new Enemy(Chara.all[44], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[222], 0.0), new Enemy(Chara.all[16], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[105], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[8], 0.0), new Enemy(Chara.all[102], 0.0), new Enemy(Chara.all[194], 0.0), new Enemy(Chara.all[218], 0.0), new Enemy(Chara.all[214], 0.0), new Enemy(Chara.all[219], 0.0), new Enemy(Chara.all[225], 0.0), new Enemy(Chara.all[226], 0.0), new Enemy(Chara.all[227], 0.0), new Enemy(Chara.all[220], 0.0), new Enemy(Chara.all[187], 0.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[150], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[221], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[153], 0.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[16], 0.0), new Enemy(Chara.all[229], 1.0), new Enemy(Chara.all[230], 0.0), new Enemy(Chara.all[231], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[228], 1.0), new Enemy(Chara.all[232], 1.0), new Enemy(Chara.all[224], 0.0), new Enemy(Chara.all[102], 0.0)]),
new Difficulty(82, "守矢神社(EAS)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.51), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[58], 0.31), new Enemy(Chara.all[39], 0.31), new Enemy(Chara.all[37], 0.31)]),
new Difficulty(83, "守矢神社(ADV)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.81), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[31], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[59], 0.31), new Enemy(Chara.all[58], 1.0), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[39], 0.51)]),
new Difficulty(84, "守矢神社(EXH)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[9], 1.0), new Enemy(Chara.all[12], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[14], 1.0), new Enemy(Chara.all[13], 0.81), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[30], 1.0), new Enemy(Chara.all[29], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 1.0), new Enemy(Chara.all[23], 1.0), new Enemy(Chara.all[38], 1.0), new Enemy(Chara.all[41], 0.31), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[25], 1.0), new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[58], 1.0), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[39], 1.0)]),
new Difficulty(85, "守矢神社(LEG)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[8], 0.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[15], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[13], 0.51), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[30], 0.51), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[42], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[38], 0.51), new Enemy(Chara.all[41], 0.31), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[29], 0.51), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[37], 0.51), new Enemy(Chara.all[22], 0.0), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[60], 1.0), new Enemy(Chara.all[57], 1.0)]),
new Difficulty(86, "真夏の水着ユニット乱入フェスティバル(サマーMSTA姉貴戦)", true, [new Enemy(Chara.all[51], 1.0), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[5], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[4], 0.51)]),
new Difficulty(87, "真夏の水着ユニット乱入フェスティバル(サマーRIM姉貴戦)", true, [new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[5], 0.51), new Enemy(Chara.all[6], 0.51)]),
new Difficulty(88, "真夏の水着ユニット乱入フェスティバル(サマーUDK姉貴戦)", true, [new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[7], 0.51)]),
new Difficulty(89, "真夏の水着ユニット乱入フェスティバル(サマーALC姉貴戦)", true, [new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[11], 0.51)]),
new Difficulty(90, "真夏の水着ユニット乱入フェスティバル(サマーHZR姉貴戦)", true, [new Enemy(Chara.all[65], 1.0), new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[64], 0.51)]),
new Difficulty(91, "真夏の水着ユニット乱入フェスティバル(サマーピンキー姉貴戦)", true, [new Enemy(Chara.all[66], 1.0), new Enemy(Chara.all[51], 0.51), new Enemy(Chara.all[51], 0.51), new Enemy(Chara.all[51], 0.51)]),
new Difficulty(92, "地霊殿(EAS)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[77], 0.31), new Enemy(Chara.all[14], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[78], 0.11), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[4], 0.51), new Enemy(Chara.all[79], 0.06), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[7], 0.31)]),
new Difficulty(93, "地霊殿(ADV)", true, [new Enemy(Chara.all[5], 0.11), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[13], 0.0), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[4], 0.51), new Enemy(Chara.all[3], 0.51), new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.21), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[21], 0.51), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[78], 0.31), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[79], 0.21), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 0.31), new Enemy(Chara.all[7], 0.31), new Enemy(Chara.all[36], 0.31)]),
new Difficulty(94, "地霊殿(EXH)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[68], 0.0), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[30], 0.0), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[42], 0.0), new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[70], 0.31), new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[80], 0.51), new Enemy(Chara.all[79], 1.0), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 1.0), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[36], 0.31)]),
new Difficulty(95, "地霊殿(LEG)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[15], 0.31), new Enemy(Chara.all[69], 0.31), new Enemy(Chara.all[68], 0.0), new Enemy(Chara.all[29], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[30], 0.0), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[42], 0.0), new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[69], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[70], 0.31), new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[11], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[80], 0.51), new Enemy(Chara.all[79], 1.0), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[80], 1.0), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[36], 0.31), new Enemy(Chara.all[82], 1.0), new Enemy(Chara.all[81], 0.0), new Enemy(Chara.all[79], 0.0)]),
new Difficulty(96, "スマブラ発売記念乱入クエスト(変態郵便屋戦)", true, [new Enemy(Chara.all[96], 0.71), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[84], 0.51)]),
new Difficulty(97, "スマブラ発売記念乱入クエスト(インパルスITKR戦)", true, [new Enemy(Chara.all[97], 0.31), new Enemy(Chara.all[53], 0.51), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[12], 0.51)]),
new Difficulty(98, "スマブラ発売記念乱入クエスト(小森戦)", true, [new Enemy(Chara.all[98], 1.0), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[6], 0.0)]),
new Difficulty(99, "スマブラ発売記念乱入クエスト(ホリ・トオル戦)", true, [new Enemy(Chara.all[99], 1.0), new Enemy(Chara.all[65], 1.0), new Enemy(Chara.all[89], 0.0)]),
new Difficulty(100, "まりりんぴっく　ちびっこの部(EAS)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[126], 0.11), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[17], 0.31)]),
new Difficulty(101, "まりりんぴっく　ちびっこの部(ADV)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[84], 0.51), new Enemy(Chara.all[93], 0.51), new Enemy(Chara.all[95], 0.51), new Enemy(Chara.all[20], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[58], 0.51), new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[126], 0.31), new Enemy(Chara.all[28], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[109], 0.31)]),
new Difficulty(102, "まりりんぴっく　ちびっこの部(EXH)", true, [new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[84], 0.31), new Enemy(Chara.all[62], 0.51), new Enemy(Chara.all[102], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[104], 0.51), new Enemy(Chara.all[38], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[58], 0.51), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[123], 0.31), new Enemy(Chara.all[89], 0.31)]),
new Difficulty(103, "まりりんぴっく　応援団の部(EAS)", true, [new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[10], 0.51), new Enemy(Chara.all[127], 0.11), new Enemy(Chara.all[9], 0.31), new Enemy(Chara.all[51], 0.31)]),
new Difficulty(104, "まりりんぴっく　応援団の部(ADV)", true, [new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[36], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[19], 0.51), new Enemy(Chara.all[59], 0.51), new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[127], 0.31), new Enemy(Chara.all[105], 0.31), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[7], 0.31)]),
new Difficulty(105, "まりりんぴっく　応援団の部(EXH)", true, [new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[11], 0.31), new Enemy(Chara.all[109], 0.31), new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[72], 0.51), new Enemy(Chara.all[59], 0.51), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[20], 0.31), new Enemy(Chara.all[21], 0.31)]),
new Difficulty(106, "まりりんぴっく　父兄の部(EAS)", true, [new Enemy(Chara.all[9], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[64], 0.51), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[128], 0.11), new Enemy(Chara.all[13], 0.31), new Enemy(Chara.all[16], 0.31)]),
new Difficulty(107, "まりりんぴっく　父兄の部(ADV)", true, [new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[25], 0.51), new Enemy(Chara.all[85], 0.51), new Enemy(Chara.all[74], 0.51), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[60], 0.51), new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[128], 0.31), new Enemy(Chara.all[51], 0.31), new Enemy(Chara.all[17], 0.31), new Enemy(Chara.all[7], 0.31)]),
new Difficulty(108, "まりりんぴっく　父兄の部(EXH)", true, [new Enemy(Chara.all[15], 0.0), new Enemy(Chara.all[16], 0.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[13], 0.0), new Enemy(Chara.all[64], 0.51), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[12], 0.51), new Enemy(Chara.all[68], 0.31), new Enemy(Chara.all[88], 0.51), new Enemy(Chara.all[26], 0.51), new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[60], 0.51), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[32], 0.31), new Enemy(Chara.all[33], 0.31), new Enemy(Chara.all[34], 0.31)]),
new Difficulty(109, "体育の日乱入クエスト(野獣&遠野戦)", true, [new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[128], 0.0), new Enemy(Chara.all[127], 0.0), new Enemy(Chara.all[126], 0.0)]),
new Difficulty(110, "UDK姉妹乱入クエスト(MZ姉貴戦)", true, [new Enemy(Chara.all[130], 1.0), new Enemy(Chara.all[126], 0.21), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[4], 0.0)]),
new Difficulty(111, "UDK姉妹乱入クエスト(AZS姉貴戦)", true, [new Enemy(Chara.all[131], 1.0), new Enemy(Chara.all[127], 0.21), new Enemy(Chara.all[17], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[14], 0.0)]),
new Difficulty(112, "UDK姉妹乱入クエスト(RI姉貴戦)", true, [new Enemy(Chara.all[132], 1.0), new Enemy(Chara.all[128], 0.21), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[7], 0.0)]),
new Difficulty(113, "UDK姉妹乱入クエスト(朗読兄貴戦)", false, [new Enemy(Chara.all[133], 1.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[133], 0.0), new Enemy(Chara.all[1], 1.0)]),
new Difficulty(114, "立　教　大　学(EAS)", true, [new Enemy(Chara.all[15], 0.51), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[52], 0.31), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[127], 0.31), new Enemy(Chara.all[137], 0.31), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[17], 0.0), new Enemy(Chara.all[53], 0.31), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[128], 0.31), new Enemy(Chara.all[138], 0.31), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[54], 0.31), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[126], 0.31), new Enemy(Chara.all[141], 0.06), new Enemy(Chara.all[14], 0.31), new Enemy(Chara.all[12], 0.31)]),
new Difficulty(115, "立　教　大　学(ADV)", true, [new Enemy(Chara.all[15], 0.11), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[12], 0.0), new Enemy(Chara.all[16], 0.31), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[44], 0.51), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[43], 0.51), new Enemy(Chara.all[22], 0.51), new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[134], 0.31), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[70], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[17], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[141], 0.21), new Enemy(Chara.all[139], 0.31), new Enemy(Chara.all[137], 0.31), new Enemy(Chara.all[138], 0.31), new Enemy(Chara.all[35], 0.31)]),
new Difficulty(116, "立　教　大　学(EXH)", true, [new Enemy(Chara.all[135], 0.31), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 0.0), new Enemy(Chara.all[44], 0.0), new Enemy(Chara.all[71], 0.0), new Enemy(Chara.all[43], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[94], 0.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[134], 1.0), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[69], 0.0), new Enemy(Chara.all[53], 0.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[107], 0.0), new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[136], 0.31), new Enemy(Chara.all[21], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[54], 0.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[139], 0.0), new Enemy(Chara.all[70], 0.0), new Enemy(Chara.all[126], 0.0), new Enemy(Chara.all[93], 0.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[103], 0.0), new Enemy(Chara.all[101], 0.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[138], 0.0), new Enemy(Chara.all[141], 0.51), new Enemy(Chara.all[139], 0.51), new Enemy(Chara.all[137], 0.51), new Enemy(Chara.all[138], 0.51), new Enemy(Chara.all[140], 0.31)]),
new Difficulty(117, "立　教　大　学(LEG)", true, [new Enemy(Chara.all[135], 1.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[52], 0.0), new Enemy(Chara.all[44], 0.0), new Enemy(Chara.all[10], 0.0), new Enemy(Chara.all[43], 0.0), new Enemy(Chara.all[39], 0.0), new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[67], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[94], 0.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[134], 1.0), new Enemy(Chara.all[85], 0.0), new Enemy(Chara.all[23], 0.0), new Enemy(Chara.all[11], 0.0), new Enemy(Chara.all[69], 0.0), new Enemy(Chara.all[53], 0.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[107], 0.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[38], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[41], 0.0), new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.0), new Enemy(Chara.all[33], 0.0), new Enemy(Chara.all[34], 0.0), new Enemy(Chara.all[136], 1.0), new Enemy(Chara.all[21], 0.0), new Enemy(Chara.all[20], 0.0), new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[54], 0.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[26], 0.0), new Enemy(Chara.all[14], 0.0), new Enemy(Chara.all[139], 0.0), new Enemy(Chara.all[70], 0.0), new Enemy(Chara.all[126], 0.0), new Enemy(Chara.all[93], 0.0), new Enemy(Chara.all[88], 0.0), new Enemy(Chara.all[140], 0.0), new Enemy(Chara.all[109], 0.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 0.0), new Enemy(Chara.all[141], 1.0), new Enemy(Chara.all[142], 0.31), new Enemy(Chara.all[137], 0.51), new Enemy(Chara.all[139], 0.51), new Enemy(Chara.all[140], 0.31), new Enemy(Chara.all[143], 1.0), new Enemy(Chara.all[141], 1.0), new Enemy(Chara.all[142], 1.0)]),
new Difficulty(118, "人間の里のゲーム屋(EAS)", false, [new Enemy(Chara.all[157], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[13], 1.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[175], 0.31), new Enemy(Chara.all[10], 0.31), new Enemy(Chara.all[90], 0.31)]),
new Difficulty(119, "人間の里のゲーム屋(ADV)", false, [new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[157], 1.0), new Enemy(Chara.all[104], 1.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[42], 1.0), new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[13], 1.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[95], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[175], 0.51), new Enemy(Chara.all[40], 0.31), new Enemy(Chara.all[90], 0.31), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[90], 0.31)]),
new Difficulty(120, "人間の里のゲーム屋(EXH)", false, [new Enemy(Chara.all[21], 1.0), new Enemy(Chara.all[39], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[20], 1.0), new Enemy(Chara.all[105], 1.0), new Enemy(Chara.all[8], 1.0), new Enemy(Chara.all[51], 1.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[89], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[159], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[67], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[154], 1.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[157], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[169], 1.0), new Enemy(Chara.all[22], 1.0), new Enemy(Chara.all[74], 1.0), new Enemy(Chara.all[75], 1.0), new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[147], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[60], 1.0), new Enemy(Chara.all[35], 1.0), new Enemy(Chara.all[72], 1.0), new Enemy(Chara.all[41], 1.0), new Enemy(Chara.all[111], 1.0), new Enemy(Chara.all[44], 1.0), new Enemy(Chara.all[43], 1.0), new Enemy(Chara.all[11], 1.0), new Enemy(Chara.all[176], 1.0), new Enemy(Chara.all[175], 0.31), new Enemy(Chara.all[90], 0.31), new Enemy(Chara.all[40], 0.31)]),
new Difficulty(121, "まりスト例大祭(EAS)", false, [new Enemy(Chara.all[102], 1.0), new Enemy(Chara.all[101], 1.0), new Enemy(Chara.all[103], 1.0), new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[180], 0.31), new Enemy(Chara.all[52], 0.31), new Enemy(Chara.all[53], 0.31), new Enemy(Chara.all[54], 0.31)]),
new Difficulty(122, "まりスト例大祭(ADV)", false, [new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[57], 1.0), new Enemy(Chara.all[58], 1.0), new Enemy(Chara.all[59], 1.0), new Enemy(Chara.all[52], 1.0), new Enemy(Chara.all[53], 1.0), new Enemy(Chara.all[54], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[127], 1.0), new Enemy(Chara.all[128], 1.0), new Enemy(Chara.all[180], 0.51), new Enemy(Chara.all[79], 1.0), new Enemy(Chara.all[81], 1.0), new Enemy(Chara.all[80], 1.0)]),
new Difficulty(123, "まりスト例大祭(EXH)", false, [new Enemy(Chara.all[60], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[78], 1.0), new Enemy(Chara.all[76], 1.0), new Enemy(Chara.all[77], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[26], 1.0), new Enemy(Chara.all[27], 1.0), new Enemy(Chara.all[137], 1.0), new Enemy(Chara.all[140], 1.0), new Enemy(Chara.all[16], 1.0), new Enemy(Chara.all[15], 1.0), new Enemy(Chara.all[139], 1.0), new Enemy(Chara.all[138], 1.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[6], 1.0), new Enemy(Chara.all[141], 1.0), new Enemy(Chara.all[142], 1.0), new Enemy(Chara.all[13], 1.0), new Enemy(Chara.all[106], 1.0), new Enemy(Chara.all[65], 1.0), new Enemy(Chara.all[62], 1.0), new Enemy(Chara.all[63], 1.0), new Enemy(Chara.all[64], 1.0), new Enemy(Chara.all[180], 1.0), new Enemy(Chara.all[18], 1.0), new Enemy(Chara.all[19], 1.0), new Enemy(Chara.all[79], 1.0)]),
new Difficulty(124, "まりスト例大祭(LEG)", false, [new Enemy(Chara.all[18], 0.0), new Enemy(Chara.all[19], 0.0), new Enemy(Chara.all[127], 0.0), new Enemy(Chara.all[76], 0.02), new Enemy(Chara.all[79], 0.0), new Enemy(Chara.all[141], 0.0), new Enemy(Chara.all[140], 0.0), new Enemy(Chara.all[77], 0.0), new Enemy(Chara.all[136], 0.0), new Enemy(Chara.all[31], 0.0), new Enemy(Chara.all[82], 0.0), new Enemy(Chara.all[35], 0.0), new Enemy(Chara.all[72], 0.0), new Enemy(Chara.all[65], 0.0), new Enemy(Chara.all[158], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[53], 0.0), new Enemy(Chara.all[59], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[147], 0.0), new Enemy(Chara.all[143], 0.0), new Enemy(Chara.all[175], 0.0), new Enemy(Chara.all[142], 0.0), new Enemy(Chara.all[126], 0.0), new Enemy(Chara.all[153], 0.0), new Enemy(Chara.all[57], 0.0), new Enemy(Chara.all[58], 0.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[81], 0.0), new Enemy(Chara.all[128], 0.0), new Enemy(Chara.all[51], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[137], 0.0), new Enemy(Chara.all[180], 1.0), new Enemy(Chara.all[17], 0.0), new Enemy(Chara.all[54], 0.0), new Enemy(Chara.all[95], 0.0), new Enemy(Chara.all[40], 0.0), new Enemy(Chara.all[181], 1.0), new Enemy(Chara.all[0], 0.0), new Enemy(Chara.all[1], 0.0), new Enemy(Chara.all[2], 0.0), new Enemy(Chara.all[9], 0.0)]),
new Difficulty(125, "三銃士乱入フェス(チャリオット平野戦)", false, [new Enemy(Chara.all[182], 1.0), new Enemy(Chara.all[68], 0.0), new Enemy(Chara.all[30], 0.0), new Enemy(Chara.all[127], 0.0), new Enemy(Chara.all[167], 0.0)]),
new Difficulty(126, "三銃士乱入フェス(剣聖おじさん戦)", false, [new Enemy(Chara.all[183], 1.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[86], 0.0), new Enemy(Chara.all[57], 0.0), new Enemy(Chara.all[16], 0.0)]),
new Difficulty(127, "三銃士乱入フェス(破面KBTIT戦)", false, [new Enemy(Chara.all[184], 1.0), new Enemy(Chara.all[147], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[158], 0.0)]),
new Difficulty(128, "三銃士乱入フェス(AKMRくん戦)", false, [new Enemy(Chara.all[185], 1.0), new Enemy(Chara.all[183], 1.0), new Enemy(Chara.all[184], 0.0), new Enemy(Chara.all[182], 0.0), new Enemy(Chara.all[23], 0.0)]),
new Difficulty(129, "釣リスマスおばさん乱入フェス(釣リスマスおばさん戦)", true, [new Enemy(Chara.all[204], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0)]),
new Difficulty(130, "命蓮寺(EAS)", false, [new Enemy(Chara.all[52], 0.31), new Enemy(Chara.all[127], 0.51), new Enemy(Chara.all[142], 0.51), new Enemy(Chara.all[208], 0.31), new Enemy(Chara.all[196], 0.51), new Enemy(Chara.all[126], 0.51), new Enemy(Chara.all[79], 0.31), new Enemy(Chara.all[51], 0.51), new Enemy(Chara.all[128], 0.31), new Enemy(Chara.all[207], 0.31), new Enemy(Chara.all[204], 0.31), new Enemy(Chara.all[78], 0.31)]),
new Difficulty(131, "命蓮寺(ADV)", false, [new Enemy(Chara.all[207], 0.51), new Enemy(Chara.all[3], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[104], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[186], 0.31), new Enemy(Chara.all[9], 0.51), new Enemy(Chara.all[76], 0.51), new Enemy(Chara.all[159], 0.51), new Enemy(Chara.all[208], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[84], 0.51), new Enemy(Chara.all[5], 0.51), new Enemy(Chara.all[6], 0.51), new Enemy(Chara.all[79], 0.31), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[53], 0.31), new Enemy(Chara.all[138], 0.31), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[209], 0.31), new Enemy(Chara.all[54], 0.31), new Enemy(Chara.all[77], 0.31), new Enemy(Chara.all[27], 0.31), new Enemy(Chara.all[26], 0.31), new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[101], 0.31), new Enemy(Chara.all[171], 0.31), new Enemy(Chara.all[140], 0.31), new Enemy(Chara.all[142], 0.31), new Enemy(Chara.all[210], 0.31), new Enemy(Chara.all[103], 0.31), new Enemy(Chara.all[18], 0.31), new Enemy(Chara.all[19], 0.31)]),
new Difficulty(132, "命蓮寺(EXH)", false, [new Enemy(Chara.all[207], 0.31), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[104], 0.51), new Enemy(Chara.all[153], 0.51), new Enemy(Chara.all[186], 0.31), new Enemy(Chara.all[18], 0.51), new Enemy(Chara.all[76], 0.51), new Enemy(Chara.all[159], 0.51), new Enemy(Chara.all[208], 0.31), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[32], 0.51), new Enemy(Chara.all[33], 0.51), new Enemy(Chara.all[34], 0.51), new Enemy(Chara.all[79], 0.31), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[41], 0.31), new Enemy(Chara.all[157], 0.31), new Enemy(Chara.all[42], 0.31), new Enemy(Chara.all[209], 0.51), new Enemy(Chara.all[54], 0.31), new Enemy(Chara.all[77], 0.31), new Enemy(Chara.all[193], 0.31), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[105], 0.31), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[7], 0.31), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[210], 0.51), new Enemy(Chara.all[140], 0.31), new Enemy(Chara.all[68], 0.31), new Enemy(Chara.all[167], 0.31), new Enemy(Chara.all[167], 0.31), new Enemy(Chara.all[109], 0.31), new Enemy(Chara.all[191], 0.51), new Enemy(Chara.all[180], 0.51), new Enemy(Chara.all[196], 0.51), new Enemy(Chara.all[211], 0.31), new Enemy(Chara.all[207], 0.31), new Enemy(Chara.all[208], 0.31), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[41], 0.31)]),
new Difficulty(133, "命蓮寺(LEG)", false, [new Enemy(Chara.all[109], 0.31), new Enemy(Chara.all[191], 0.51), new Enemy(Chara.all[180], 0.51), new Enemy(Chara.all[17], 0.51), new Enemy(Chara.all[207], 1.0), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[57], 0.51), new Enemy(Chara.all[28], 0.51), new Enemy(Chara.all[153], 0.51), new Enemy(Chara.all[44], 0.31), new Enemy(Chara.all[52], 0.51), new Enemy(Chara.all[39], 0.51), new Enemy(Chara.all[195], 0.51), new Enemy(Chara.all[67], 0.51), new Enemy(Chara.all[208], 1.0), new Enemy(Chara.all[35], 0.51), new Enemy(Chara.all[41], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[54], 0.51), new Enemy(Chara.all[206], 0.31), new Enemy(Chara.all[81], 0.51), new Enemy(Chara.all[205], 0.31), new Enemy(Chara.all[21], 0.31), new Enemy(Chara.all[209], 1.0), new Enemy(Chara.all[54], 0.31), new Enemy(Chara.all[77], 0.31), new Enemy(Chara.all[70], 0.31), new Enemy(Chara.all[67], 0.31), new Enemy(Chara.all[105], 0.31), new Enemy(Chara.all[8], 0.31), new Enemy(Chara.all[7], 0.31), new Enemy(Chara.all[81], 0.31), new Enemy(Chara.all[210], 1.0), new Enemy(Chara.all[140], 0.31), new Enemy(Chara.all[142], 0.31), new Enemy(Chara.all[93], 0.31), new Enemy(Chara.all[36], 0.31), new Enemy(Chara.all[107], 0.51), new Enemy(Chara.all[53], 0.31), new Enemy(Chara.all[94], 0.31), new Enemy(Chara.all[29], 0.31), new Enemy(Chara.all[69], 0.31), new Enemy(Chara.all[211], 1.0), new Enemy(Chara.all[207], 0.31), new Enemy(Chara.all[35], 0.31), new Enemy(Chara.all[36], 0.31), new Enemy(Chara.all[157], 0.31), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[140], 0.31), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[88], 0.31), new Enemy(Chara.all[212], 1.0), new Enemy(Chara.all[207], 0.0), new Enemy(Chara.all[211], 0.0), new Enemy(Chara.all[209], 0.0), new Enemy(Chara.all[213], 1.0), new Enemy(Chara.all[212], 0.51), new Enemy(Chara.all[22], 0.0), new Enemy(Chara.all[79], 0.0)]),
new Difficulty(134, "博麗神社節分の日！(EAS)", false, [new Enemy(Chara.all[102], 0.31), new Enemy(Chara.all[103], 0.51), new Enemy(Chara.all[101], 0.51), new Enemy(Chara.all[62], 0.31), new Enemy(Chara.all[63], 0.51), new Enemy(Chara.all[64], 0.51), new Enemy(Chara.all[233], 0.11), new Enemy(Chara.all[175], 0.31), new Enemy(Chara.all[180], 0.31)]),
new Difficulty(135, "博麗神社節分の日！(ADV)", false, [new Enemy(Chara.all[176], 0.31), new Enemy(Chara.all[216], 0.51), new Enemy(Chara.all[224], 0.51), new Enemy(Chara.all[194], 0.31), new Enemy(Chara.all[175], 0.51), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[181], 0.31), new Enemy(Chara.all[80], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[233], 0.51), new Enemy(Chara.all[137], 0.31), new Enemy(Chara.all[197], 0.31)]),
new Difficulty(136, "博麗神社節分の日！(EXH)", false, [new Enemy(Chara.all[196], 0.31), new Enemy(Chara.all[180], 0.51), new Enemy(Chara.all[109], 0.51), new Enemy(Chara.all[228], 0.51), new Enemy(Chara.all[176], 0.31), new Enemy(Chara.all[216], 0.51), new Enemy(Chara.all[77], 0.51), new Enemy(Chara.all[159], 0.51), new Enemy(Chara.all[194], 0.31), new Enemy(Chara.all[175], 0.51), new Enemy(Chara.all[158], 0.51), new Enemy(Chara.all[197], 0.51), new Enemy(Chara.all[181], 0.31), new Enemy(Chara.all[80], 0.51), new Enemy(Chara.all[78], 0.51), new Enemy(Chara.all[209], 0.0), new Enemy(Chara.all[7], 0.51), new Enemy(Chara.all[233], 1.0), new Enemy(Chara.all[88], 1.0), new Enemy(Chara.all[126], 1.0), new Enemy(Chara.all[60], 1.0)]),
new Difficulty(137, "節分の日乱入クエスト(淫夢之一太刀SIK戦)", false, [new Enemy(Chara.all[234], 1.0), new Enemy(Chara.all[31], 0.0), new Enemy(Chara.all[27], 0.0), new Enemy(Chara.all[157], 0.0), new Enemy(Chara.all[127], 0.0)]),
new Difficulty(138, "セミ兄貴の森(EAS)", false, [new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[50], 0.31), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]),
new Difficulty(139, "セミ兄貴の森(ADV)", false, [new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[50], 0.61), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]),
new Difficulty(140, "セミ兄貴の森(EXH)", false, [new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0)]),
new Difficulty(141, "セミ兄貴の森(LEG)", false, [new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[109], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[48], 1.0), new Enemy(Chara.all[49], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[90], 1.0), new Enemy(Chara.all[112], 1.0), new Enemy(Chara.all[50], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[109], 1.0)]),
new Difficulty(142, "妖精の森(EAS)", false, [new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[46], 0.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[119], 1.0), new Enemy(Chara.all[121], 0.0), new Enemy(Chara.all[122], 0.0), new Enemy(Chara.all[120], 0.0)]),
new Difficulty(143, "妖精の森(ADV)", false, [new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[46], 0.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[49], 0.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[119], 0.51), new Enemy(Chara.all[121], 1.0), new Enemy(Chara.all[122], 1.0), new Enemy(Chara.all[120], 1.0)]),
new Difficulty(144, "妖精の森(EXH)", false, [new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[119], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[46], 0.0), new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[121], 0.0), new Enemy(Chara.all[123], 1.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[45], 0.0), new Enemy(Chara.all[122], 1.0), new Enemy(Chara.all[49], 0.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[7], 1.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[121], 1.0), new Enemy(Chara.all[124], 1.0), new Enemy(Chara.all[123], 1.0)]),
new Difficulty(145, "妖精の森(LEG)", false, [new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[157], 0.0), new Enemy(Chara.all[7], 0.0), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[119], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[46], 0.0), new Enemy(Chara.all[177], 1.0), new Enemy(Chara.all[5], 0.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[122], 0.0), new Enemy(Chara.all[46], 0.0), new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[121], 0.0), new Enemy(Chara.all[123], 1.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[45], 0.0), new Enemy(Chara.all[122], 1.0), new Enemy(Chara.all[49], 0.0), new Enemy(Chara.all[5], 1.0), new Enemy(Chara.all[46], 1.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[178], 1.0), new Enemy(Chara.all[119], 0.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[6], 0.0), new Enemy(Chara.all[179], 1.0), new Enemy(Chara.all[120], 1.0), new Enemy(Chara.all[118], 1.0), new Enemy(Chara.all[124], 1.0)]),
new Difficulty(146, "BBの森(EAS)", false, [new Enemy(Chara.all[198], 1.0), new Enemy(Chara.all[45], 1.0), new Enemy(Chara.all[199], 1.0), new Enemy(Chara.all[47], 1.0), new Enemy(Chara.all[200], 0.31), new Enemy(Chara.all[46], 0.0)]),
new Difficulty(147, "BBの森(ADV)", false, [new Enemy(Chara.all[157], 0.31), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[3], 0.0), new Enemy(Chara.all[201], 0.31), new Enemy(Chara.all[49], 0.0), new Enemy(Chara.all[200], 1.0), new Enemy(Chara.all[199], 1.0), new Enemy(Chara.all[47], 0.0), new Enemy(Chara.all[104], 0.0), new Enemy(Chara.all[153], 0.0), new Enemy(Chara.all[28], 0.0), new Enemy(Chara.all[202], 0.31), new Enemy(Chara.all[48], 0.0), new Enemy(Chara.all[118], 0.0), new Enemy(Chara.all[120], 0.0), new Enemy(Chara.all[122], 0.0), new Enemy(Chara.all[203], 0.31), new Enemy(Chara.all[45], 0.0), new Enemy(Chara.all[4], 0.0), new Enemy(Chara.all[123], 0.0), new Enemy(Chara.all[198], 1.0)])
];

function redraw() {
    var difficultyId = parseInt($("#difficulty_setting").val(), 10);
    var charaId = parseInt($("#chara_setting").val(), 10);
    if (difficultyId < 0 && charaId < 0) return;
    var redrawTarget = difficultyId >= 0 ? Difficulty.all[difficultyId] : Chara.all[charaId];

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);
    var propertyNameForSecondaryCondition = (redrawTarget instanceof Difficulty ? "trophyOrder" : "id");
    var dropProbabilities = redrawTarget.calcDropProbabilities(
      Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
    ).toArray();

    dropProbabilities.sort(function(x, y){
        var primaryCondition = y[1][$("#cocoa_setting").val()] - x[1][$("#cocoa_setting").val()];
        var secondaryCondition = x[0][propertyNameForSecondaryCondition] - y[0][propertyNameForSecondaryCondition];
        return primaryCondition != 0 ? primaryCondition : secondaryCondition;
    }).toHash().forEach(function(entity, dropProbability) {
        var tr = $(document.createElement("tr")).append(
          $(document.createElement("th")).append(entity.createLink())
        ).append(
          $(document.createElement("td")).css("font-family", "monospace").text(
            formatProbability(dropProbability[$("#cocoa_setting").val()])
          )
        );
        tbody.append(tr);
    });

    if (dropProbabilities.length > 0) {
        $("#drop_probability").empty().append(table);
    } else {
        $("#drop_probability").empty().text("（出現クエストが）ないです");
    }
}

$(function() {
    Difficulty.all.forEach(function(difficulty) {
        var option = $(document.createElement("option")).attr("value", difficulty.id).text(difficulty.name);
        $("#difficulty_setting").append(option);
    });
    $("#difficulty_setting").on("change", function() {
        $("#chara_setting").val("-1");
        redraw();
    });

    Chara.all.concat().sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
        var option = $(document.createElement("option")).attr("value", chara.id).text(chara.name);
        $("#chara_setting").append(option);
    });
    $("#chara_setting").on("change", function() {
        $("#difficulty_setting").val("-1");
        redraw();
    });

    $("#cocoa_setting").on("change", redraw);

    var savedTrophySetting = SaveData.load();
    Chara.all.concat().sort(function(x, y){return x.trophyOrder - y.trophyOrder}).slice(0, Chara.all.length - 2).forEach(function(chara) {
        var checkbox = $(document.createElement("input")).attr({
            id: "trophy_setting_" + chara.id,
            type: "checkbox",
            value: chara.id,
        }).on("change", function() {
            SaveData.save();
            redraw();
        });
        checkbox.prop("checked", savedTrophySetting[chara.id]);
        $("#trophy_setting").append(checkbox).append(" " + chara.name).append($(document.createElement("br")));
    });
    $("#trophy_all_check").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", true);
        SaveData.save();
        redraw();
    });
    $("#trophy_all_uncheck").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", false);
        SaveData.save();
        redraw();
    });
    
    $("#difficulty_setting").val("0");
    $("#difficulty_setting").trigger("change");
});
