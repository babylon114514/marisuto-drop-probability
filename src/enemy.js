export default class Enemy {
    constructor(chara, dropCandidateProbabilityAsChara, item, dropCandidateProbabilityAsItem) {
        this.chara = chara;
        this.dropCandidateProbabilityAsChara = dropCandidateProbabilityAsChara;
        this.item = item;
        this.dropCandidateProbabilityAsItem = dropCandidateProbabilityAsItem;
    }
}
