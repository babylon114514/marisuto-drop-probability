_.mixin({
    groupByToArray(array, iteratee) {
        const iterateeFunc = _.iteratee(iteratee);
        const map = new Map();
        for (let element of array) {
            const key = iterateeFunc(element);
            if (map.has(key)) {
                 map.get(key).push(element);
            } else {
                 map.set(key, [element]);
            }
        }
        return Array.from(map);
    }
});
_.mixin({
    prod(array) {
        return array.reduce((prod, element) => prod * element, 1);
    },
    forEachCartProd(arrays, action) {
        arrays = arrays.concat();
        const argumentsOfAction = [];
        (function recur() {
            if (arrays.length == 0) {
                action(...argumentsOfAction);
            } else {
                const array = arrays.shift();
                array.forEach(element => {
                    argumentsOfAction.push(element);
                    recur();
                    argumentsOfAction.pop();
                });
                arrays.unshift(array);
            }
        })();
        return arrays;
    }
}, {chain: false});
