export default class Chara {
    constructor(id, idAsString, name, order) {
        this.id = id;
        this.idAsString = idAsString;
        this.name = name;
        this.order = order;
    }
}
Chara.all = [
    new Chara(0, "rim", "RIM姉貴", 0),
    new Chara(1, "udk", "UDK姉貴", 1),
    new Chara(2, "alc", "ALC姉貴", 2),
    new Chara(3, "yousei", "DIYUSI", 3),
    new Chara(4, "inu", "INU", 4),
    new Chara(5, "rma", "RMA姉貴", 5),
    new Chara(6, "crn", "CRNちゃん", 6),
    new Chara(7, "msta", "MSTA姉貴", 7),
    new Chara(8, "uth", "UTH", 8),
    new Chara(9, "sik", "SIK姉貴", 9),
    new Chara(10, "mirn", "MIRN姉貴", 10),
    new Chara(11, "ksdb", "KSDB姉貴", 11),
    new Chara(12, "pcly", "PCLY姉貴", 12),
    new Chara(13, "turi", "釣りキチおばさん", 13),
    new Chara(14, "sky", "SKY姉貴", 14),
    new Chara(15, "rmla", "RMLA姉貴", 15),
    new Chara(16, "fln", "FLNちゃん", 16),
    new Chara(17, "yuk", "YUK姉貴", 17),
    new Chara(18, "yaju", "野獣先輩", 20),
    new Chara(19, "ton", "遠野", 21),
    new Chara(20, "kmr", "KMR", 22),
    new Chara(21, "mur", "MUR大先輩", 23),
    new Chara(22, "aikiso", "サイクロップス先輩", 24),
    new Chara(23, "hide", "ひで", 25),
    new Chara(24, "zep", "関西チャラ男", 26),
    new Chara(25, "trn", "医師TRN", 27),
    new Chara(26, "snj", "SNJ", 28),
    new Chara(27, "kbtit", "KBTIT", 29),
    new Chara(28, "ojisan", "虐待おじさん", 30),
    new Chara(29, "hrn", "平野源五郎", 31),
    new Chara(30, "ondisk", "ONDISK", 32),
    new Chara(31, "hnd", "HND△", 33),
    new Chara(32, "kbsk", "KBSトリオK", 34),
    new Chara(33, "kbsb", "KBSトリオB", 35),
    new Chara(34, "kbss", "KBSトリオS", 36),
    new Chara(35, "tnok", "TNOK", 37),
    new Chara(36, "nkn", "中野くん", 38),
    new Chara(37, "myn", "MYN", 39),
    new Chara(38, "katyo", "課長", 40),
    new Chara(39, "akys", "AKYS", 41),
    new Chara(40, "tnk", "ドラゴン田中", 42),
    new Chara(41, "hgkm", "HGKM様", 43),
    new Chara(42, "tknuc", "TKNUC", 44),
    new Chara(43, "siy", "SIY", 45),
    new Chara(44, "go", "GO", 46),
    new Chara(45, "semi0", "レッドセミ兄貴", 268),
    new Chara(46, "semi1", "ブルーセミ兄貴", 269),
    new Chara(47, "semi2", "セミ兄貴", 270),
    new Chara(48, "semi3", "光に満ちたセミ兄貴", 271),
    new Chara(49, "semi4", "闇に堕ちたセミ兄貴", 272),
    new Chara(50, "sik3", "メガカイロSIK", 273),
    new Chara(51, "msta2", "サマーMSTA姉貴", 303),
    new Chara(52, "rim2", "バレンタインRIM", 307),
    new Chara(53, "udk2", "バレンタインUDK", 308),
    new Chara(54, "alc2", "バレンタインALC", 309),
    new Chara(55, "ykr", "YKR姉貴", 361),
    new Chara(56, "go_boss", "邪神GO", 47),
    new Chara(57, "sne", "SNE姉貴", 225),
    new Chara(58, "swk", "SWK様", 226),
    new Chara(59, "knk2", "風神KNK", 227),
    new Chara(60, "swk2", "神々の頂点SWK", 228),
    new Chara(61, "mrn1", "イワナを焼くUDK", 212),
    new Chara(62, "rim3", "サマーRIM姉貴", 304),
    new Chara(63, "udk3", "サマーUDK姉貴", 305),
    new Chara(64, "alc3", "サマーALC姉貴", 306),
    new Chara(65, "hzr2", "サマーHZR姉貴", 310),
    new Chara(66, "spinky", "サマーピンキー姉貴", 316),
    new Chara(67, "mrkm", "MRKM先生", 48),
    new Chara(68, "kn", "鬼畜教師KN", 49),
    new Chara(69, "sensei", "ゴーグル先生", 52),
    new Chara(70, "mask", "マスクド永谷園", 51),
    new Chara(71, "oil", "ラヴォイル校長", 50),
    new Chara(72, "mgds", "メガデス怪人", 53),
    new Chara(73, "mgds2", "メガデス戦闘員", 54),
    new Chara(74, "ksng", "草薙ケン", 55),
    new Chara(75, "mtdir", "松平ジョー", 56),
    new Chara(76, "ymm", "YMMちゃん", 232),
    new Chara(77, "mzhs", "PLSY姉貴", 233),
    new Chara(78, "yug", "YUG姉貴", 234),
    new Chara(79, "str", "STR姉貴", 235),
    new Chara(80, "orn", "ORN姉貴", 236),
    new Chara(81, "kis", "KISちゃん", 237),
    new Chara(82, "ndk", "太陽神NDK", 238),
    new Chara(83, "mnr", "殺人鬼MNR", 57),
    new Chara(84, "ippan", "一般通過爺", 58),
    new Chara(85, "ymzk", "山崎まさゆき", 59),
    new Chara(86, "isi", "ISI君", 60),
    new Chara(87, "kimu", "金泰均", 61),
    new Chara(88, "ishr", "ISHR先生", 62),
    new Chara(89, "pinky", "ピンキー姉貴", 63),
    new Chara(90, "tmdr", "たまドラ田中", 338),
    new Chara(91, "mmj", "MMJ姉貴", 301),
    new Chara(92, "inari", "いなり男", 64),
    new Chara(93, "akg", "AKG", 65),
    new Chara(94, "karly", "関西クレーマー", 66),
    new Chara(95, "fcoh", "現場監督", 67),
    new Chara(96, "yuubin", "変態郵便屋", 187),
    new Chara(97, "itkr", "インパルスITKR", 188),
    new Chara(98, "seta", "小森", 189),
    new Chara(99, "hori", "ホリ・トオル", 190),
    new Chara(100, "mrn2", "ラザマリナ", 213),
    new Chara(101, "bnkrg", "BNKRG姉貴", 68),
    new Chara(102, "knn", "KNN姉貴", 69),
    new Chara(103, "snnn", "SNNN姉貴", 70),
    new Chara(104, "esk", "スライムナイトESK", 71),
    new Chara(105, "knn2", "KNNフェニックス", 72),
    new Chara(106, "pjk", "ポジ子", 73),
    new Chara(107, "tis", "TIS姉貴", 74),
    new Chara(108, "tis2", "ボイスドラマ業者TIS", 75),
    new Chara(109, "ueki", "植木鉢くん", 186),
    new Chara(110, "psr2", "PSR姉貴", 229),
    new Chara(111, "psr", "化物と化したPSR姉貴", 230),
    new Chara(112, "sq", "全てを狩る先輩", 274),
    new Chara(113, "yaju2", "花嫁と化した先輩", 311),
    new Chara(114, "kbtit2", "嫁TIT", 312),
    new Chara(115, "pinky2", "花嫁ピンキー", 313),
    new Chara(116, "nonke", "ノンケスレイヤー", 314),
    new Chara(117, "bus", "BSTIT", 315),
    new Chara(118, "aniki", "ビリー兄貴", 275),
    new Chara(119, "kys", "木吉カズヤ", 276),
    new Chara(120, "inoue", "井上カブレラ", 277),
    new Chara(121, "ikari", "いかりやビオランテ", 278),
    new Chara(122, "fuck", "TDNコスギ", 279),
    new Chara(123, "aka", "赤さん", 280),
    new Chara(124, "van", "VAN様", 281),
    new Chara(125, "kgr", "カグラ=ウヅキ", 214),
    new Chara(126, "esk2", "ESKちゃん", 317),
    new Chara(127, "yw", "YW姉貴", 318),
    new Chara(128, "ykr2", "ITUASK", 319),
    new Chara(129, "mrn4", "バンホーテンダー", 215),
    new Chara(130, "mz", "MZ姉貴", 320),
    new Chara(131, "azs", "AZS姉貴", 321),
    new Chara(132, "ri", "RI姉貴", 322),
    new Chara(133, "roudoku", "朗読兄貴", 323),
    new Chara(134, "hide2", "デビルひで", 240),
    new Chara(135, "aniki2", "ナイトメアビリー兄貴", 241),
    new Chara(136, "yaju3", "ベルモンド先輩", 242),
    new Chara(137, "mirn2", "ナイトメアMIRN姉貴", 243),
    new Chara(138, "ksdb2", "ナイトメアKSDB姉貴", 244),
    new Chara(139, "pcly2", "ナイトメアPCLY姉貴", 245),
    new Chara(140, "sky2", "ナイトメアSKY姉貴", 246),
    new Chara(141, "rmla2", "ナイトメアRMLA姉貴", 247),
    new Chara(142, "fln2", "ナイトメアFLNちゃん", 248),
    new Chara(143, "noda", "スカーレット内閣", 249),
    new Chara(144, "swk3", "黄金のSWK様", 231),
    new Chara(145, "znm", "ZNM姉貴", 239),
    new Chara(146, "aok", "AOK", 76),
    new Chara(147, "nrk", "NRK姉貴", 77),
    new Chara(148, "kuso", "変態糞親父", 78),
    new Chara(149, "kuso2", "変態糞娘", 79),
    new Chara(150, "gasyu", "我修院", 80),
    new Chara(151, "tkgw", "TKGW様", 81),
    new Chara(152, "tkk", "貴乃信", 82),
    new Chara(153, "ass", "篤太郎", 83),
    new Chara(154, "kmr2", "創造神KMR", 84),
    new Chara(155, "tyuban", "中盤に出てくる鳥", 337),
    new Chara(156, "low", "ダークロウ先輩", 217),
    new Chara(157, "yousei2", "交通整理DIちゃん", 185),
    new Chara(158, "ton2", "世界のトオノ", 191),
    new Chara(159, "yaju4", "ビューティ先輩", 192),
    new Chara(160, "mimic", "ミミックおばさん", 250),
    new Chara(161, "mndk", "メカNDK", 219),
    new Chara(162, "aya", "AY姉貴", 332),
    new Chara(163, "tns", "TNS姉貴", 333),
    new Chara(164, "htt", "HTT姉貴", 334),
    new Chara(165, "mdcn", "MDCNちゃん", 335),
    new Chara(166, "rnnsk", "RNNSK兄貴", 336),
    new Chara(167, "ikase", "逝かせ隊", 85),
    new Chara(168, "poite", "ポイテーロ", 86),
    new Chara(169, "ultra", "ウルトラマンタクヤ", 193),
    new Chara(170, "lnk", "LNK", 87),
    new Chara(171, "hrn2", "キモヲタ平野", 90),
    new Chara(172, "tnkr", "TNKL", 88),
    new Chara(173, "usg", "うさぎ", 89),
    new Chara(174, "tnts", "タナトスひで", 91),
    new Chara(175, "yaoi", "Y.AOI", 251),
    new Chara(176, "mtgrs", "メガMTGRS先輩", 252),
    new Chara(177, "sudou", "須藤さん", 282),
    new Chara(178, "sigemi", "池田茂美", 283),
    new Chara(179, "king", "妖精王チチラルー", 284),
    new Chara(180, "alison", "ALISON兄貴", 329),
    new Chara(181, "zun", "ZUN", 330),
    new Chara(182, "hrn3", "チャリオット平野", 324),
    new Chara(183, "ojisan2", "剣聖おじさん", 325),
    new Chara(184, "kbtit3", "破面KBTIT", 326),
    new Chara(185, "akmr", "AKMRくん", 327),
    new Chara(186, "cnt", "CNTちゃん", 92),
    new Chara(187, "eir", "EIL姉貴", 93),
    new Chara(188, "rnk", "RNK姉貴", 94),
    new Chara(189, "gnh", "GNHくん", 95),
    new Chara(190, "nsdr", "NSDR兄貴", 96),
    new Chara(191, "ytr", "YOU THE ROCK★", 97),
    new Chara(192, "kikori", "根流し木こり", 98),
    new Chara(193, "iwana", "イワナ和尚", 99),
    new Chara(194, "bouya", "ぼうや先輩", 100),
    new Chara(195, "mirn3", "MIRN姉貴~ZERO~", 18),
    new Chara(196, "yuk2", "オーバーロードYUK姉貴", 19),
    new Chara(197, "uc", "完全勝利した淫夢くんUC", 339),
    new Chara(198, "siren", "風来人RU", 285),
    new Chara(199, "esk3", "ESKドラゴン", 286),
    new Chara(200, "jabo", "ジャボテンダーALC", 287),
    new Chara(201, "hide3", "多脚ひで", 288),
    new Chara(202, "pinki", "ピン鬼", 289),
    new Chara(203, "dream", "ダークドレアム先輩", 290),
    new Chara(204, "turi2", "釣リスマスおばさん", 340),
    new Chara(205, "gt", "GTさん", 194),
    new Chara(206, "ondisk2", "超能力者ONDISK", 195),
    new Chara(207, "nzrn", "NZRN", 253),
    new Chara(208, "kgs", "KGSちゃん", 254),
    new Chara(209, "icrn", "ICRN姉貴", 255),
    new Chara(210, "mrs", "MRS姉貴", 256),
    new Chara(211, "trmr", "SYOU姉貴", 257),
    new Chara(212, "hzr", "HZR姉貴", 258),
    new Chara(213, "nue", "NUEちゃん", 259),
    new Chara(214, "smrguc", "KBTIT(詐欺師)", 101),
    new Chara(215, "mtmt", "KBTIT(ギタリスト)", 102),
    new Chara(216, "kuwa", "KBTIT(パイロット)", 103),
    new Chara(217, "light", "TITニング", 104),
    new Chara(218, "revo", "KBTIT(調査兵団)", 105),
    new Chara(219, "grng", "KBTIT(怪人)", 106),
    new Chara(220, "kubo", "KBTIT(漫画家)", 107),
    new Chara(221, "astk", "ASTK姉貴", 108),
    new Chara(222, "mjm", "マジメくん", 109),
    new Chara(223, "kyn", "KYN", 110),
    new Chara(224, "mmr", "MMR部長", 111),
    new Chara(225, "nsok", "NSOK", 112),
    new Chara(226, "drvs", "DRVS", 113),
    new Chara(227, "sbr", "SBR", 114),
    new Chara(228, "kusa", "観葉植物くん", 115),
    new Chara(229, "tdn", "TDN", 116),
    new Chara(230, "db", "DB", 117),
    new Chara(231, "htn", "HTN", 118),
    new Chara(232, "inm", "真夏の夜の淫夢", 119),
    new Chara(233, "sik4", "斬月・真SIK", 331),
    new Chara(234, "sik2", "淫夢之一太刀SIK", 341),
    new Chara(235, "gooma", "ズ・ゴオマ・グ", 196),
    new Chara(236, "papa", "野獣父", 197),
    new Chara(237, "naoe", "天地人平野", 328),
    new Chara(238, "vbnkrg", "バレンタインBNKRG", 342),
    new Chara(239, "vknn", "バレンタインKNN", 343),
    new Chara(240, "vsnnn", "バレンタインSNNN", 344),
    new Chara(241, "vsne", "バレンタインSNE", 345),
    new Chara(242, "vswk", "バレンタインSWK様", 346),
    new Chara(243, "choco", "チョコレート先輩", 347),
    new Chara(244, "kokoro5", "HTNこころ", 348),
    new Chara(245, "tkd", "タカダキミヒコ量産機", 198),
    new Chara(246, "inigi", "イニ義893", 199),
    new Chara(247, "raok", "レア岡", 200),
    new Chara(248, "rngt", "UDKリンガーダ", 216),
    new Chara(249, "rgl", "RGLちゃん", 349),
    new Chara(250, "udng2", "助手のUDNGちゃん", 350),
    new Chara(251, "eirn2", "蓬莱外科医EIRN先生", 351),
    new Chara(252, "zenza", "前座おじさん", 291),
    new Chara(253, "donyoku", "どん欲な毒ALC", 292),
    new Chara(254, "fcoh2", "ハチと化した現場監督", 293),
    new Chara(255, "yunomi", "湯呑と化したRIM", 294),
    new Chara(256, "egz", "エクゾディア先輩", 295),
    new Chara(257, "mur2", "MUR肉", 201),
    new Chara(258, "jgn", "JGN", 353),
    new Chara(259, "skrnbu", "ALC市長", 354),
    new Chara(260, "alctis", "ALC大佐", 355),
    new Chara(261, "isialc", "石ALC", 356),
    new Chara(262, "yndr", "ヤンデRU", 357),
    new Chara(263, "choco2", "ホワイトチョコ先輩", 358),
    new Chara(264, "kuma", "テディベア", 120),
    new Chara(265, "ixa", "軍畑先輩", 202),
    new Chara(266, "akys2", "武神AKYS", 203),
    new Chara(267, "mrs2", "サマーMRS姉貴", 260),
    new Chara(268, "haga", "市長", 121),
    new Chara(269, "gnkk", "銀閣", 129),
    new Chara(270, "myng", "宮永通世", 150),
    new Chara(271, "yum", "YUMちゃん", 359),
    new Chara(272, "vvan", "VVAN姉貴", 360),
    new Chara(273, "yyk", "YYK様", 362),
    new Chara(274, "sknm", "サケノミ", 363),
    new Chara(275, "ftmr", "敏感FTMR君", 122),
    new Chara(276, "roman", "ロマン爺", 123),
    new Chara(277, "ogmm", "OGMM", 124),
    new Chara(278, "eisha", "剛竜馬", 125),
    new Chara(279, "az", "AZにゃん", 126),
    new Chara(280, "kuma2", "暗黒神ラプソーン", 127),
    new Chara(281, "pjk2", "破壊神PJK", 128),
    new Chara(282, "noel", "クッソー☆RIM", 364),
    new Chara(283, "kudk", "MKM姉貴", 365),
    new Chara(284, "kalc", "クッソー☆ALC", 366),
    new Chara(285, "kpcly", "クッソー☆PCLY", 367),
    new Chara(286, "kksdb", "クッソー☆DB姉貴", 368),
    new Chara(287, "tnk2", "ドラゴン田中の足", 204),
    new Chara(288, "sky3", "ホットラインSKY", 205),
    new Chara(289, "rmla3", "スカーレット田中", 206),
    new Chara(290, "sig", "SIG姉貴", 261),
    new Chara(291, "ft", "FTちゃん", 262),
    new Chara(292, "mk", "TYSTMMNMK姉貴", 263),
    new Chara(293, "nkmr", "肉丸くん", 369),
    new Chara(294, "ands", "肉丸の先輩", 370),
    new Chara(295, "brkn", "バルカン大先輩", 371),
    new Chara(296, "kael", "SWK様の服のカエル", 372),
    new Chara(297, "gosaku", "鎌田吾作", 131),
    new Chara(298, "runba", "ルンバおばさん", 144),
    new Chara(299, "akbt", "赤豚", 207),
    new Chara(300, "srbt", "白豚", 208),
    new Chara(301, "kmr3", "超覚醒KMR", 209),
    new Chara(302, "knkk", "金閣", 130),
    new Chara(303, "hirata", "平田元帥", 132),
    new Chara(304, "mahha", "騎士シューマッハ", 133),
    new Chara(305, "cc", "C.C", 134),
    new Chara(306, "usui", "臼井リーブス", 135),
    new Chara(307, "iguti", "井口ヒロミ", 136),
    new Chara(308, "obama", "チャベス・オバマ", 137),
    new Chara(309, "queen", "ケツホルデス女王", 138),
    new Chara(310, "bama", "デビルレイクバーマ", 139),
    new Chara(311, "jknn", "ジュリアナKNN", 146),
    new Chara(312, "jinja", "ほのぼの神社", 373),
    new Chara(313, "sknn", "千手KNN", 140),
    new Chara(314, "nknn", "関西ナース", 141),
    new Chara(315, "knnsik", "生き返るSIK", 142),
    new Chara(316, "fknn", "いきカエル", 143),
    new Chara(317, "runba2", "スカイルンバKNN", 145),
    new Chara(318, "ravos", "復讐を誓ったKNN姉貴", 147),
    new Chara(319, "dknn", "シャドウKNN姉貴", 148),
    new Chara(320, "go3", "救世神GO", 210),
    new Chara(321, "go2", "唯一神GO", 211),
    new Chara(322, "mk2", "サマーMK姉貴", 264),
    new Chara(323, "snnm", "SNNM姉貴", 352),
    new Chara(324, "ozw", "OZW", 149),
    new Chara(325, "iti", "ITI", 151),
    new Chara(326, "ryu", "Ryu☆", 166),
    new Chara(327, "kmc", "KMC姉貴", 265),
    new Chara(328, "eik", "EIK様", 266),
    new Chara(329, "heitei", "閉廷おじさん", 267),
    new Chara(330, "ika", "DBイカ", 218),
    new Chara(331, "robin", "UDKラーマシン", 296),
    new Chara(332, "ogrsyn", "OGRSYN", 152),
    new Chara(333, "kmtk", "4003勝の男", 153),
    new Chara(334, "kanto", "関東チャラ男", 154),
    new Chara(335, "kantyo", "かん腸芸人", 155),
    new Chara(336, "sgcn", "SGCN", 156),
    new Chara(337, "cop", "ホモコップ", 157),
    new Chara(338, "snj2", "ドッキリSNJ", 158),
    new Chara(339, "tkd2", "タカダキミヒコ試作機", 159),
    new Chara(340, "imada", "IMDKUJ先輩", 160),
    new Chara(341, "hide4", "新発掘ひで", 161),
    new Chara(342, "tida", "TD兄貴", 162),
    new Chara(343, "eczn", "ECZN帽子", 163),
    new Chara(344, "batman", "バットマン", 164),
    new Chara(345, "cloud", "ソルジャーと化した先輩", 297),
    new Chara(346, "aoc", "ホモ☆レモンESK", 298),
    new Chara(347, "tnk3", "フェアリー田中", 299),
    new Chara(348, "exdeath", "ネオエクスデス先輩", 300),
    new Chara(349, "tnok2", "QT893 タニオカ", 220),
    new Chara(350, "dmn", "ど麺罪木", 165),
    new Chara(351, "syabu", "シャブラサレータ", 167),
    new Chara(352, "unei", "UNEI", 168),
    new Chara(353, "nwng", "NWNG", 169),
    new Chara(354, "denpa", "DNPKN", 170),
    new Chara(355, "nkr", "ニコる（淫夢）", 171),
    new Chara(356, "honsya", "ニコニコ本社", 172),
    new Chara(357, "honsya2", "ニコニコ池袋本社", 173),
    new Chara(358, "kaikin", "ニコニコ超会金", 174),
    new Chara(359, "tettou", "鉄塔先輩", 221),
    new Chara(360, "tyuban2", "ニワトリスレイヤー", 222),
    new Chara(361, "msta3", "無理無理MSTA", 302),
    new Chara(362, "murcat", "MUR猫", 374),
    new Chara(363, "smmj", "サマーINU", 375),
    new Chara(364, "sturi", "サマー釣りキチおばさん", 376),
    new Chara(365, "syuk", "サマーYUK姉貴", 377),
    new Chara(366, "ssik", "サマーSIK姉貴", 378),
    new Chara(367, "sksdb", "サマーKSDB姉貴", 379),
    new Chara(368, "kyonyu", "巨乳先輩", 380),
    new Chara(369, "sgnh", "サマーGNHくん", 381),
    new Chara(370, "stis", "サマー業者TIS", 382),
    new Chara(371, "sfcoh", "サマー現場監督", 383),
    new Chara(372, "syw", "サマーZRAY", 384),
    new Chara(373, "stns", "サマーTNS姉貴", 385),
    new Chara(374, "sesk", "サマーESKちゃん", 386),
    new Chara(375, "sykr", "サマーITUASK", 387),
    new Chara(376, "sznm", "サマーZNM姉貴", 388),
    new Chara(377, "jinja2", "サマーほのぼの神社", 389),
    new Chara(378, "sfln", "サマーNFLNちゃん", 390),
    new Chara(379, "yaju5", "サマービューティ先輩", 391),
    new Chara(380, "sswk", "サマーSWK様", 392),
    new Chara(381, "syaju", "サマー野獣先輩", 393),
    new Chara(382, "hide5", "ヤメチク・リー", 395),
    new Chara(383, "mur3", "MUR閣下", 396),
    new Chara(384, "rrn2", "MRMKRRRN姉貴", 397),
    new Chara(385, "rrn", "恐怖の悪戯狐MRMKRRRN", 398),
    new Chara(386, "guriko", "グリコおばさん", 399),
    new Chara(387, "gaba", "ガバ穴ダディー", 402),
    new Chara(388, "szk", "SZK兄貴", 403),
    new Chara(389, "astk2", "ASTK女王", 404),
    new Chara(390, "opop", "オパオパ先輩", 405),
    new Chara(391, "giga", "ギガンテス先輩", 406),
    new Chara(392, "biim", "biim兄貴", 407),
    new Chara(393, "mknn", "メカKNN", 408),
    new Chara(394, "horahora", "ホラホラーマン", 409),
    new Chara(395, "hkbtit", "ヴァンパイアKBTIT", 410),
    new Chara(396, "go4", "占星術師GO", 411),
    new Chara(397, "bnkrg2", "吸血彼女BNKRG", 412),
    new Chara(398, "jihanki", "自販機かあちゃん", 400),
    new Chara(399, "oba", "オバサウルス", 401),
    new Chara(400, "ken", "KEN", 175),
    new Chara(401, "ponkotu", "城之内悠二", 414),
    new Chara(402, "yuda", "ユダ・ラッセン", 415),
    new Chara(403, "kys2", "スーパーカズヤ", 416),
    new Chara(404, "chali", "フェアリーチャリオット", 417),
    new Chara(405, "cloud2", "クラウド（淫夢）", 418),
    new Chara(406, "nswk", "ナイトメアSWK様", 413),
    new Chara(407, "smd", "島田部長", 419),
    new Chara(408, "puchi", "ぷちどる先輩", 420),
    new Chara(409, "susi", "COOKIE食べたいUDK", 421),
    new Chara(410, "susi2", "ICETEA飲みたい先輩", 423),
    new Chara(411, "susi3", "INARI食べたい関クレ", 424),
    new Chara(412, "susi4", "SUSHI中盤に出てくる鳥", 422),
    new Chara(413, "ohomo", "オホモアイルー", 425),
    new Chara(414, "skkr5", "サマーHTNこころ", 394),
    new Chara(415, "tw2", "しあわせウサギ", 426),
    new Chara(416, "mmj2", "本性を現したクソ犬", 427),
    new Chara(417, "httn", "ニコ生HTTN", 428),
    new Chara(418, "rk", "RK姉貴", 429),
    new Chara(419, "khk", "KHK兄貴", 430),
    new Chara(420, "akn", "AKN姉貴", 431),
    new Chara(421, "yuh", "YUH姉貴", 432),
    new Chara(422, "mgr", "MGR姉貴", 433),
    new Chara(423, "srmy", "SRMY姉貴", 434),
    new Chara(424, "isama", "ISAMA兄貴", 435),
    new Chara(425, "okn", "OKN", 436),
    new Chara(426, "fry", "フライド淫夢くん", 437),
    new Chara(427, "srmy2", "モスキートSRMY姉貴", 438),
    new Chara(428, "inm2", "真冬の聖夜の淫夢", 440),
    new Chara(429, "mochi", "人間の鏡餅", 441),
    new Chara(430, "ofr", "OFR座の怪人", 176),
    new Chara(431, "iws", "IWS", 177),
    new Chara(432, "hzn", "HZN兄貴", 178),
    new Chara(433, "hzn2", "HZNの使い魔", 182),
    new Chara(434, "szk2", "SZK", 179),
    new Chara(435, "kzy", "謎のロックンローラー", 180),
    new Chara(436, "jyu", "JYU", 181),
    new Chara(437, "hzn3", "百合天国☆HZN", 183),
    new Chara(438, "hzn_boss", "究極百合天国神HZNRO", 184),
    new Chara(439, "qvcrrm", "QVCRRM姉貴", 439),
    new Chara(440, "eirn3", "クリスマスEIRN先生", 442),
    new Chara(441, "vyuk", "バレンタインYUK姉貴", 443),
    new Chara(442, "vnzrn", "バレンタインNZRN", 444),
    new Chara(443, "rrm", "RRM姉貴", 445),
    new Chara(444, "rma2", "応援そーなのかー", 223),
    new Chara(445, "dsnnn", "呪われしSNNN姉貴", 224),
    new Chara(446, "hsi", "HSI姉貴", 446),
    new Chara(447, "wrdkm", "わるだくみ先輩", 447),
    new Chara(448, "ryg", "RYG姉貴", 448),
    new Chara(449, "sky4", "メッモー☆SKY姉貴", 449),
    new Chara(450, "aik", "AIK姉貴", 450),
    new Chara(451, "drskr", "SKR姉貴", 451),
    new Chara(452, "drskr2", "DRSKR", 452),
    new Chara(453, "ndk5", "戦車と化したNDK", 453),
    new Chara(454, "kisume", "キスメくん", 454),
    new Chara(455, "mjm2", "神殺しマジメくん", 455),
    new Chara(456, "kejime", "ケジメの翼", 456),
    new Chara(457, "bnkrg3", "力を得たBNKRG姉貴", 458),
    new Chara(458, "alcgod", "女神ALC姉貴", 459),
    new Chara(459, "sakura", "キャプテン・サクラ", 457),
    new Chara(460, "ndk4", "ゲッターNDK", 460),
    new Chara(461, "sik5", "宿命を背負ったSIK姉貴", 461),
];