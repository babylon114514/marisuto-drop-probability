export default {
    _legacyLoad() {
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
            return value;
        }
        switch (myGetCookie("version")) {
        case void(0):
            return {
                version: 1,
                collectedCharas: [0, 1, 2],
                collectedItems: [0, 1, 2]
            };
        case "1": case "2":
            return {
                version: 1,
                collectedCharas: myGetCookie("trophy_setting").split("").map((flg, id) => [flg === "1", id]).filter(([flg, id]) => flg).map(([flg, id]) => id),
                collectedItems: [0, 1, 2]
            };
        case "3": case "4":
            return {
                version: 1,
                collectedCharas: myGetCookie("charas").split("").map((flg, id) => [flg === "1", id]).filter(([flg, id]) => flg).map(([flg, id]) => id),
                collectedItems: myGetCookie("items").split("").map((flg, id) => [flg === "1", id]).filter(([flg, id]) => flg).map(([flg, id]) => id)
            };
        }
    },
    load() {
        let config = JSON.parse(localStorage.getItem("marisuto-drop-probability"));
        if (config === null) {
            config = this._legacyLoad();
        }
        return config;
    },
    save(config) {
        localStorage.setItem("marisuto-drop-probability", JSON.stringify(config));
    },
    update(func) {
        const config = this.load();
        func(config);
        this.save(config);
    }
};
