import Outcome from "./outcome";
import Chara from "./chara";
import Item from "./item";

export default class Scout {
    constructor(id, name, isFinished, outcomes) {
        this.id = id;
        this.name = name;
        this.isFinished = isFinished;
        this.outcomes = outcomes;
    }
    canSee(collectible) {
        if (collectible instanceof Chara) {
            return _(this.outcomes).map("chara").includes(collectible);
        } else if (collectible instanceof Item) {
            return false;
        }
    }
    canDrop(collectible) {
        return this.canSee(collectible);
    }
    calcDropProbability(collectible, uncollectedCollectibles, isCocoaful) {
        if (collectible instanceof Item) return 0;
        const outcome = _(this.outcomes).find(["chara", collectible]);
        if (outcome === void(0)) return 0;
        return outcome.probability;
    }
}
Scout.all = [
    new Scout(0, "レジェフェス（大嘘）", false, [new Outcome(Chara.all[52], 5 / 542), new Outcome(Chara.all[53], 5 / 542), new Outcome(Chara.all[54], 5 / 542), new Outcome(Chara.all[76], 2 / 271), new Outcome(Chara.all[77], 2 / 271), new Outcome(Chara.all[78], 2 / 271), new Outcome(Chara.all[79], 3 / 542), new Outcome(Chara.all[80], 2 / 271), new Outcome(Chara.all[81], 3 / 542), new Outcome(Chara.all[82], 1 / 271), new Outcome(Chara.all[144], 1 / 271), new Outcome(Chara.all[145], 3 / 542), new Outcome(Chara.all[131], 2 / 271), new Outcome(Chara.all[130], 2 / 271), new Outcome(Chara.all[132], 2 / 271), new Outcome(Chara.all[62], 3 / 542), new Outcome(Chara.all[63], 3 / 542), new Outcome(Chara.all[64], 3 / 542), new Outcome(Chara.all[51], 3 / 542), new Outcome(Chara.all[65], 1 / 542), new Outcome(Chara.all[57], 1 / 271), new Outcome(Chara.all[59], 1 / 271), new Outcome(Chara.all[58], 1 / 271), new Outcome(Chara.all[60], 1 / 542), new Outcome(Chara.all[110], 1 / 542), new Outcome(Chara.all[141], 2 / 271), new Outcome(Chara.all[142], 1 / 542), new Outcome(Chara.all[127], 3 / 542), new Outcome(Chara.all[140], 2 / 271), new Outcome(Chara.all[137], 2 / 271), new Outcome(Chara.all[128], 2 / 271), new Outcome(Chara.all[139], 2 / 271), new Outcome(Chara.all[138], 2 / 271), new Outcome(Chara.all[126], 3 / 542), new Outcome(Chara.all[160], 1 / 271), new Outcome(Chara.all[207], 5 / 542), new Outcome(Chara.all[208], 5 / 542), new Outcome(Chara.all[209], 5 / 542), new Outcome(Chara.all[210], 5 / 542), new Outcome(Chara.all[211], 5 / 542), new Outcome(Chara.all[212], 1 / 271), new Outcome(Chara.all[213], 1 / 271), new Outcome(Chara.all[267], 1 / 271), new Outcome(Chara.all[234], 5 / 542), new Outcome(Chara.all[233], 5 / 542), new Outcome(Chara.all[204], 5 / 542), new Outcome(Chara.all[323], 1 / 271), new Outcome(Chara.all[251], 1 / 271), new Outcome(Chara.all[250], 2 / 271), new Outcome(Chara.all[249], 2 / 271), new Outcome(Chara.all[282], 2 / 271), new Outcome(Chara.all[283], 2 / 271), new Outcome(Chara.all[284], 2 / 271), new Outcome(Chara.all[285], 2 / 271), new Outcome(Chara.all[286], 2 / 271), new Outcome(Chara.all[322], 1 / 271), new Outcome(Chara.all[239], 5 / 542), new Outcome(Chara.all[240], 5 / 542), new Outcome(Chara.all[238], 5 / 542), new Outcome(Chara.all[241], 5 / 542), new Outcome(Chara.all[242], 1 / 271), new Outcome(Chara.all[260], 5 / 542), new Outcome(Chara.all[258], 5 / 542), new Outcome(Chara.all[259], 5 / 542), new Outcome(Chara.all[261], 5 / 542), new Outcome(Chara.all[262], 1 / 271), new Outcome(Chara.all[292], 1 / 271), new Outcome(Chara.all[291], 5 / 542), new Outcome(Chara.all[290], 5 / 542), new Outcome(Chara.all[406], 1 / 271), new Outcome(Chara.all[312], 3 / 542), new Outcome(Chara.all[244], 3 / 542), new Outcome(Chara.all[327], 5 / 542), new Outcome(Chara.all[328], 5 / 542), new Outcome(Chara.all[271], 5 / 542), new Outcome(Chara.all[273], 5 / 542), new Outcome(Chara.all[272], 5 / 542), new Outcome(Chara.all[55], 5 / 542), new Outcome(Chara.all[385], 5 / 542), new Outcome(Chara.all[384], 5 / 542), new Outcome(Chara.all[389], 5 / 542), new Outcome(Chara.all[361], 5 / 542), new Outcome(Chara.all[221], 5 / 542), new Outcome(Chara.all[281], 5 / 542), new Outcome(Chara.all[318], 5 / 542), new Outcome(Chara.all[311], 5 / 542), new Outcome(Chara.all[317], 5 / 542), new Outcome(Chara.all[298], 5 / 542), new Outcome(Chara.all[316], 5 / 542), new Outcome(Chara.all[315], 5 / 542), new Outcome(Chara.all[314], 5 / 542), new Outcome(Chara.all[313], 5 / 542), new Outcome(Chara.all[104], 5 / 542), new Outcome(Chara.all[102], 5 / 542), new Outcome(Chara.all[103], 5 / 542), new Outcome(Chara.all[101], 5 / 542), new Outcome(Chara.all[106], 5 / 542), new Outcome(Chara.all[105], 5 / 542), new Outcome(Chara.all[414], 1 / 271), new Outcome(Chara.all[380], 3 / 542), new Outcome(Chara.all[378], 3 / 542), new Outcome(Chara.all[377], 5 / 542), new Outcome(Chara.all[370], 5 / 542), new Outcome(Chara.all[363], 5 / 542), new Outcome(Chara.all[364], 5 / 542), new Outcome(Chara.all[365], 5 / 542), new Outcome(Chara.all[366], 5 / 542), new Outcome(Chara.all[367], 5 / 542), new Outcome(Chara.all[372], 5 / 542), new Outcome(Chara.all[373], 5 / 542), new Outcome(Chara.all[374], 5 / 542), new Outcome(Chara.all[375], 5 / 542), new Outcome(Chara.all[376], 5 / 542), new Outcome(Chara.all[417], 5 / 542), new Outcome(Chara.all[416], 5 / 542), new Outcome(Chara.all[415], 5 / 542), new Outcome(Chara.all[423], 5 / 542), new Outcome(Chara.all[427], 5 / 542), new Outcome(Chara.all[418], 5 / 542), new Outcome(Chara.all[419], 5 / 542), new Outcome(Chara.all[420], 5 / 542), new Outcome(Chara.all[421], 5 / 542), new Outcome(Chara.all[422], 5 / 542), new Outcome(Chara.all[439], 5 / 542), new Outcome(Chara.all[441], 5 / 542), new Outcome(Chara.all[442], 5 / 542), new Outcome(Chara.all[443], 5 / 542), new Outcome(Chara.all[450], 5 / 542), new Outcome(Chara.all[449], 5 / 542), new Outcome(Chara.all[448], 5 / 542), new Outcome(Chara.all[451], 5 / 542)]),
    new Scout(1, "レディーススカウト3", false, [new Outcome(Chara.all[446], 3 / 56), new Outcome(Chara.all[409], 5 / 56), new Outcome(Chara.all[412], 5 / 56), new Outcome(Chara.all[415], 5 / 56), new Outcome(Chara.all[416], 5 / 56), new Outcome(Chara.all[417], 3 / 56), new Outcome(Chara.all[423], 5 / 56), new Outcome(Chara.all[425], 5 / 56), new Outcome(Chara.all[427], 5 / 56), new Outcome(Chara.all[386], 5 / 56), new Outcome(Chara.all[398], 5 / 56), new Outcome(Chara.all[399], 5 / 56)]),
    new Scout(2, "メンズスカウト3", false, [new Outcome(Chara.all[447], 3 / 56), new Outcome(Chara.all[410], 5 / 56), new Outcome(Chara.all[411], 5 / 56), new Outcome(Chara.all[401], 5 / 56), new Outcome(Chara.all[402], 5 / 56), new Outcome(Chara.all[403], 3 / 56), new Outcome(Chara.all[405], 5 / 56), new Outcome(Chara.all[394], 5 / 56), new Outcome(Chara.all[396], 5 / 56), new Outcome(Chara.all[395], 5 / 56), new Outcome(Chara.all[413], 5 / 56), new Outcome(Chara.all[424], 5 / 56)]),
    new Scout(3, "クッキー☆シリーズ", false, [new Outcome(Chara.all[3], 5 / 37), new Outcome(Chara.all[4], 5 / 37), new Outcome(Chara.all[5], 5 / 37), new Outcome(Chara.all[6], 5 / 37), new Outcome(Chara.all[8], 5 / 37), new Outcome(Chara.all[9], 5 / 37), new Outcome(Chara.all[7], 5 / 37), new Outcome(Chara.all[0], 1 / 74), new Outcome(Chara.all[1], 1 / 74), new Outcome(Chara.all[2], 1 / 74), new Outcome(Chara.all[13], 1 / 74)]),
    new Scout(4, "真夏の夜の淫夢シリーズ", false, [new Outcome(Chara.all[20], 5 / 48), new Outcome(Chara.all[19], 5 / 48), new Outcome(Chara.all[23], 5 / 48), new Outcome(Chara.all[25], 5 / 48), new Outcome(Chara.all[26], 5 / 48), new Outcome(Chara.all[31], 5 / 48), new Outcome(Chara.all[32], 5 / 48), new Outcome(Chara.all[33], 5 / 48), new Outcome(Chara.all[34], 5 / 48), new Outcome(Chara.all[18], 1 / 48), new Outcome(Chara.all[27], 1 / 48), new Outcome(Chara.all[28], 1 / 48)]),
    new Scout(5, "真夏の夜の淫夢シリーズ2", false, [new Outcome(Chara.all[43], 5 / 48), new Outcome(Chara.all[41], 5 / 48), new Outcome(Chara.all[39], 5 / 48), new Outcome(Chara.all[40], 5 / 48), new Outcome(Chara.all[37], 5 / 48), new Outcome(Chara.all[68], 5 / 48), new Outcome(Chara.all[67], 5 / 48), new Outcome(Chara.all[42], 5 / 48), new Outcome(Chara.all[70], 5 / 48), new Outcome(Chara.all[44], 1 / 48), new Outcome(Chara.all[69], 1 / 48), new Outcome(Chara.all[22], 1 / 48)]),
    new Scout(6, "真夏の夜の淫夢シリーズ3", false, [new Outcome(Chara.all[74], 2 / 51), new Outcome(Chara.all[75], 2 / 51), new Outcome(Chara.all[72], 5 / 51), new Outcome(Chara.all[73], 5 / 51), new Outcome(Chara.all[88], 1 / 51), new Outcome(Chara.all[87], 5 / 51), new Outcome(Chara.all[83], 5 / 51), new Outcome(Chara.all[84], 5 / 51), new Outcome(Chara.all[85], 5 / 51), new Outcome(Chara.all[86], 5 / 51), new Outcome(Chara.all[92], 5 / 51), new Outcome(Chara.all[93], 5 / 51), new Outcome(Chara.all[94], 1 / 51)]),
    new Scout(7, "真夏の夜の淫夢シリーズ4", false, [new Outcome(Chara.all[170], 2 / 47), new Outcome(Chara.all[171], 2 / 47), new Outcome(Chara.all[173], 5 / 47), new Outcome(Chara.all[153], 1 / 47), new Outcome(Chara.all[152], 5 / 47), new Outcome(Chara.all[151], 5 / 47), new Outcome(Chara.all[148], 5 / 47), new Outcome(Chara.all[150], 5 / 47), new Outcome(Chara.all[146], 5 / 47), new Outcome(Chara.all[172], 5 / 47), new Outcome(Chara.all[167], 5 / 47), new Outcome(Chara.all[154], 1 / 47), new Outcome(Chara.all[174], 1 / 47)]),
    new Scout(8, "風評被害シリーズ", false, [new Outcome(Chara.all[190], 5 / 89), new Outcome(Chara.all[191], 5 / 89), new Outcome(Chara.all[187], 5 / 89), new Outcome(Chara.all[186], 5 / 89), new Outcome(Chara.all[107], 3 / 89), new Outcome(Chara.all[188], 5 / 89), new Outcome(Chara.all[147], 5 / 89), new Outcome(Chara.all[189], 5 / 89), new Outcome(Chara.all[192], 5 / 89), new Outcome(Chara.all[193], 5 / 89), new Outcome(Chara.all[216], 5 / 89), new Outcome(Chara.all[218], 5 / 89), new Outcome(Chara.all[217], 5 / 89), new Outcome(Chara.all[219], 5 / 89), new Outcome(Chara.all[149], 5 / 89), new Outcome(Chara.all[215], 5 / 89), new Outcome(Chara.all[214], 5 / 89), new Outcome(Chara.all[220], 3 / 89), new Outcome(Chara.all[221], 1 / 89), new Outcome(Chara.all[106], 1 / 89), new Outcome(Chara.all[194], 1 / 89)]),
    new Scout(9, "真夏の夜の淫夢シリーズ5", false, [new Outcome(Chara.all[344], 1 / 54), new Outcome(Chara.all[342], 1 / 27), new Outcome(Chara.all[343], 1 / 27), new Outcome(Chara.all[341], 1 / 27), new Outcome(Chara.all[340], 1 / 27), new Outcome(Chara.all[339], 1 / 27), new Outcome(Chara.all[338], 1 / 27), new Outcome(Chara.all[337], 1 / 27), new Outcome(Chara.all[336], 1 / 27), new Outcome(Chara.all[335], 1 / 27), new Outcome(Chara.all[333], 1 / 27), new Outcome(Chara.all[332], 1 / 27), new Outcome(Chara.all[325], 1 / 27), new Outcome(Chara.all[270], 1 / 27), new Outcome(Chara.all[324], 1 / 27), new Outcome(Chara.all[279], 1 / 27), new Outcome(Chara.all[222], 1 / 27), new Outcome(Chara.all[223], 1 / 27), new Outcome(Chara.all[224], 1 / 27), new Outcome(Chara.all[225], 1 / 27), new Outcome(Chara.all[226], 1 / 27), new Outcome(Chara.all[227], 1 / 27), new Outcome(Chara.all[228], 1 / 27), new Outcome(Chara.all[229], 1 / 54), new Outcome(Chara.all[230], 1 / 54), new Outcome(Chara.all[280], 1 / 54), new Outcome(Chara.all[268], 1 / 27), new Outcome(Chara.all[275], 1 / 27), new Outcome(Chara.all[276], 1 / 27)]),
    new Scout(10, "風評被害シリーズ2", false, [new Outcome(Chara.all[351], 3 / 62), new Outcome(Chara.all[326], 3 / 62), new Outcome(Chara.all[319], 1 / 62), new Outcome(Chara.all[318], 1 / 62), new Outcome(Chara.all[311], 3 / 62), new Outcome(Chara.all[317], 3 / 62), new Outcome(Chara.all[298], 3 / 62), new Outcome(Chara.all[316], 3 / 62), new Outcome(Chara.all[315], 3 / 62), new Outcome(Chara.all[314], 3 / 62), new Outcome(Chara.all[313], 3 / 62), new Outcome(Chara.all[310], 1 / 62), new Outcome(Chara.all[309], 1 / 62), new Outcome(Chara.all[308], 3 / 62), new Outcome(Chara.all[307], 3 / 62), new Outcome(Chara.all[306], 3 / 62), new Outcome(Chara.all[305], 3 / 62), new Outcome(Chara.all[304], 3 / 62), new Outcome(Chara.all[303], 3 / 62), new Outcome(Chara.all[297], 3 / 62), new Outcome(Chara.all[269], 3 / 62), new Outcome(Chara.all[302], 3 / 62), new Outcome(Chara.all[281], 1 / 62)]),
    new Scout(11, "ファイナルスカウト", false, [new Outcome(Chara.all[432], 2 / 25), new Outcome(Chara.all[434], 2 / 25), new Outcome(Chara.all[435], 2 / 25), new Outcome(Chara.all[436], 2 / 25), new Outcome(Chara.all[433], 2 / 25), new Outcome(Chara.all[437], 1 / 25), new Outcome(Chara.all[352], 2 / 25), new Outcome(Chara.all[353], 2 / 25), new Outcome(Chara.all[354], 2 / 25), new Outcome(Chara.all[356], 1 / 25), new Outcome(Chara.all[357], 1 / 25), new Outcome(Chara.all[400], 2 / 25), new Outcome(Chara.all[430], 2 / 25), new Outcome(Chara.all[431], 2 / 25)]),
    new Scout(12, "クッキー☆シリーズ改", false, [new Outcome(Chara.all[52], 3 / 32), new Outcome(Chara.all[53], 3 / 32), new Outcome(Chara.all[54], 3 / 32), new Outcome(Chara.all[17], 5 / 32), new Outcome(Chara.all[14], 5 / 32), new Outcome(Chara.all[15], 5 / 32), new Outcome(Chara.all[16], 3 / 32), new Outcome(Chara.all[12], 5 / 32)]),
    new Scout(13, "レアノンケスカウト", false, [new Outcome(Chara.all[62], 1 / 7), new Outcome(Chara.all[63], 1 / 7), new Outcome(Chara.all[64], 1 / 7), new Outcome(Chara.all[51], 1 / 7), new Outcome(Chara.all[65], 1 / 21), new Outcome(Chara.all[57], 2 / 21), new Outcome(Chara.all[59], 2 / 21), new Outcome(Chara.all[58], 2 / 21), new Outcome(Chara.all[60], 1 / 21), new Outcome(Chara.all[110], 1 / 21)]),
    new Scout(14, "レアノンケスカウト2", false, [new Outcome(Chara.all[76], 4 / 41), new Outcome(Chara.all[77], 4 / 41), new Outcome(Chara.all[78], 4 / 41), new Outcome(Chara.all[79], 3 / 41), new Outcome(Chara.all[80], 4 / 41), new Outcome(Chara.all[81], 3 / 41), new Outcome(Chara.all[82], 2 / 41), new Outcome(Chara.all[144], 2 / 41), new Outcome(Chara.all[145], 3 / 41), new Outcome(Chara.all[131], 4 / 41), new Outcome(Chara.all[130], 4 / 41), new Outcome(Chara.all[132], 4 / 41)]),
    new Scout(15, "ハロウィンスカウト", false, [new Outcome(Chara.all[141], 1 / 10), new Outcome(Chara.all[142], 1 / 40), new Outcome(Chara.all[127], 3 / 40), new Outcome(Chara.all[140], 1 / 10), new Outcome(Chara.all[137], 1 / 10), new Outcome(Chara.all[128], 1 / 10), new Outcome(Chara.all[139], 1 / 10), new Outcome(Chara.all[138], 1 / 10), new Outcome(Chara.all[126], 3 / 40), new Outcome(Chara.all[135], 1 / 20), new Outcome(Chara.all[134], 1 / 20), new Outcome(Chara.all[136], 1 / 20), new Outcome(Chara.all[143], 1 / 40), new Outcome(Chara.all[160], 1 / 20)]),
    new Scout(16, "レディーススカウト", false, [new Outcome(Chara.all[207], 5 / 51), new Outcome(Chara.all[208], 5 / 51), new Outcome(Chara.all[209], 5 / 51), new Outcome(Chara.all[210], 5 / 51), new Outcome(Chara.all[211], 5 / 51), new Outcome(Chara.all[212], 2 / 51), new Outcome(Chara.all[213], 2 / 51), new Outcome(Chara.all[267], 2 / 51), new Outcome(Chara.all[234], 5 / 51), new Outcome(Chara.all[233], 5 / 51), new Outcome(Chara.all[204], 5 / 51), new Outcome(Chara.all[175], 5 / 51)]),
    new Scout(17, "肛門科相撲スカウト", false, [new Outcome(Chara.all[323], 2 / 41), new Outcome(Chara.all[251], 2 / 41), new Outcome(Chara.all[250], 4 / 41), new Outcome(Chara.all[249], 4 / 41), new Outcome(Chara.all[282], 4 / 41), new Outcome(Chara.all[283], 4 / 41), new Outcome(Chara.all[284], 4 / 41), new Outcome(Chara.all[285], 4 / 41), new Outcome(Chara.all[286], 4 / 41), new Outcome(Chara.all[293], 3 / 41), new Outcome(Chara.all[294], 3 / 41), new Outcome(Chara.all[295], 3 / 41)]),
    new Scout(18, "チョコレートスカウト", false, [new Outcome(Chara.all[322], 1 / 29), new Outcome(Chara.all[239], 5 / 58), new Outcome(Chara.all[240], 5 / 58), new Outcome(Chara.all[238], 5 / 58), new Outcome(Chara.all[241], 5 / 58), new Outcome(Chara.all[242], 1 / 29), new Outcome(Chara.all[260], 5 / 58), new Outcome(Chara.all[258], 5 / 58), new Outcome(Chara.all[259], 5 / 58), new Outcome(Chara.all[261], 5 / 58), new Outcome(Chara.all[262], 1 / 29), new Outcome(Chara.all[292], 1 / 29), new Outcome(Chara.all[291], 5 / 58), new Outcome(Chara.all[290], 5 / 58)]),
    new Scout(19, "レディーススカウト2", false, [new Outcome(Chara.all[406], 1 / 29), new Outcome(Chara.all[312], 3 / 58), new Outcome(Chara.all[244], 3 / 58), new Outcome(Chara.all[327], 5 / 58), new Outcome(Chara.all[328], 5 / 58), new Outcome(Chara.all[271], 5 / 58), new Outcome(Chara.all[273], 5 / 58), new Outcome(Chara.all[272], 5 / 58), new Outcome(Chara.all[55], 5 / 58), new Outcome(Chara.all[385], 5 / 58), new Outcome(Chara.all[384], 5 / 58), new Outcome(Chara.all[389], 5 / 58), new Outcome(Chara.all[361], 5 / 58)]),
    new Scout(20, "サマースカウト2015", false, [new Outcome(Chara.all[414], 1 / 34), new Outcome(Chara.all[380], 3 / 68), new Outcome(Chara.all[378], 3 / 68), new Outcome(Chara.all[377], 5 / 68), new Outcome(Chara.all[370], 5 / 68), new Outcome(Chara.all[363], 5 / 68), new Outcome(Chara.all[364], 5 / 68), new Outcome(Chara.all[365], 5 / 68), new Outcome(Chara.all[366], 5 / 68), new Outcome(Chara.all[367], 5 / 68), new Outcome(Chara.all[372], 5 / 68), new Outcome(Chara.all[373], 5 / 68), new Outcome(Chara.all[374], 5 / 68), new Outcome(Chara.all[375], 5 / 68), new Outcome(Chara.all[376], 5 / 68)]),
    new Scout(21, "レアホモスカウト", false, [new Outcome(Chara.all[113], 1 / 7), new Outcome(Chara.all[114], 1 / 7), new Outcome(Chara.all[115], 1 / 7), new Outcome(Chara.all[66], 1 / 7), new Outcome(Chara.all[96], 2 / 21), new Outcome(Chara.all[97], 2 / 21), new Outcome(Chara.all[98], 2 / 21), new Outcome(Chara.all[99], 1 / 21), new Outcome(Chara.all[116], 1 / 21), new Outcome(Chara.all[117], 1 / 21)]),
    new Scout(22, "メンズスカウト", false, [new Outcome(Chara.all[181], 1 / 22), new Outcome(Chara.all[237], 1 / 22), new Outcome(Chara.all[180], 5 / 44), new Outcome(Chara.all[197], 5 / 44), new Outcome(Chara.all[182], 5 / 44), new Outcome(Chara.all[183], 5 / 44), new Outcome(Chara.all[184], 5 / 44), new Outcome(Chara.all[176], 5 / 44), new Outcome(Chara.all[133], 5 / 44), new Outcome(Chara.all[185], 5 / 44)]),
    new Scout(23, "メンズスカウト2", false, [new Outcome(Chara.all[407], 1 / 29), new Outcome(Chara.all[392], 3 / 58), new Outcome(Chara.all[381], 3 / 58), new Outcome(Chara.all[329], 5 / 58), new Outcome(Chara.all[368], 5 / 58), new Outcome(Chara.all[371], 5 / 58), new Outcome(Chara.all[369], 5 / 58), new Outcome(Chara.all[379], 5 / 58), new Outcome(Chara.all[388], 5 / 58), new Outcome(Chara.all[390], 5 / 58), new Outcome(Chara.all[391], 5 / 58), new Outcome(Chara.all[382], 5 / 58), new Outcome(Chara.all[383], 5 / 58)]),
];
