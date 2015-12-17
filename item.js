function redraw() {
    var oldValue = $("#item_setting").val();
    $("#item_setting").empty();
    $("#item_setting").append($(document.createElement("option")).attr("value", "-1").text("------"));
    ["未入手", "入手済"].forEach(function(optGroupLabel) {
        var optGroup = $(document.createElement("optgroup")).attr("label", optGroupLabel);
        Item.all.filter(function(item) {
            return $("#trophy_setting_" + item.id).prop("checked") == (optGroupLabel == "入手済");
        }).sort(function(x, y) {
            return x.rubyOrder - y.rubyOrder;
        }).forEach(function(item) {
            var option = $(document.createElement("option")).attr("value", item.id).text(item.name);
            optGroup.append(option);
        });
        $("#item_setting").append(optGroup);
    });
    $("#item_setting").val(oldValue);

    var difficultyId = parseInt($("#difficulty_setting").val(), 10);
    var itemId = parseInt($("#item_setting").val(), 10);
    if (difficultyId < 0 && itemId < 0) return;
    var redrawTarget = difficultyId >= 0 ? Difficulty.all[difficultyId] : Item.all[itemId];

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);
    var propertyNameForSecondaryCondition = (redrawTarget instanceof Difficulty ? "rubyOrder" : "id");
    var dropProbabilities = redrawTarget["calcDropProbabilities" + (redrawTarget instanceof Difficulty ? "OfItems" : "")](
      Item.all.filter(function(item){return !$("#trophy_setting_" + item.id).prop("checked")})
    ).toArray();

    if (redrawTarget instanceof Difficulty) {
        var tr = $(document.createElement("tr")).append(
          $(document.createElement("th")).text("何でもいいのでアイテム1個")
        ).append(
          $(document.createElement("td")).css("font-family", "monospace").text(
            formatProbability(dropProbabilities.map(function(x){return x[1][$("#cocoa_setting").val()]}).reduce(function(sum, x){return sum + x}, 0))
          )
        );
        tbody.append(tr);
    }

    dropProbabilities.sort(function(x, y){
        var primaryCondition = y[1][$("#cocoa_setting").val()] - x[1][$("#cocoa_setting").val()];
        var secondaryCondition = x[0][propertyNameForSecondaryCondition] - y[0][propertyNameForSecondaryCondition];
        return primaryCondition != 0 ? primaryCondition : secondaryCondition;
    }).toHash().forEach(function(entity, dropProbability) {
        var link;
        if (entity instanceof Difficulty) {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#difficulty_setting").val(entity.id.toString());
                $("#item_setting").val("-1");
                redraw();
            });
            if (entity.finished) link = $(document.createElement("del")).append(link);
        } else {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#item_setting").val(entity.id.toString());
                $("#difficulty_setting").val("-1");
                redraw();
            });
            if ($("#trophy_setting_" + entity.id).prop("checked")) link = $(document.createElement("del")).append(link);
        }
        var tr = $(document.createElement("tr")).append(
          $(document.createElement("th")).append(link)
        ).append(
          $(document.createElement("td")).css("font-family", "monospace").text(
            formatProbability(dropProbability[$("#cocoa_setting").val()])
          )
        );
        tbody.append(tr);
    });

    if (tbody.children().size() > 0) {
        $("#drop_probability").empty().append(table);
    } else {
        $("#drop_probability").empty().text("（出現クエストが）ないです");
    }
}
function save() {
    SaveData.save({
        charas: SaveData.load().charas,
        items: Item.all.map(function(item) {
            return $("#trophy_setting_" + item.id);
        }).map(function(checkbox) {
            return checkbox.prop("checked");
        })
    });
}

$(function() {
    Difficulty.all.forEach(function(difficulty) {
        var option = $(document.createElement("option")).attr("value", difficulty.id).text(difficulty.name);
        $("#difficulty_setting").append(option);
    });
    $("#difficulty_setting").on("change", function() {
        $("#item_setting").val("-1");
        redraw();
    });

    $("#item_setting").on("change", function() {
        $("#difficulty_setting").val("-1");
        redraw();
    });

    $("#cocoa_setting").on("change", redraw);

    var savedTrophySetting = SaveData.load().items;
    Item.all.concat().sort(function(x, y){return x.rubyOrder - y.rubyOrder}).forEach(function(item) {
        var checkbox = $(document.createElement("input")).attr({
            id: "trophy_setting_" + item.id,
            type: "checkbox",
            value: item.id
        }).on("change", function() {
            save();
            redraw();
        });
        checkbox.prop("checked", savedTrophySetting[item.id]);
        $("#trophy_setting").append(checkbox).append(" " + item.name).append($(document.createElement("br")));
    });
    $("#trophy_all_check").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", true);
        save();
        redraw();
    });
    $("#trophy_all_uncheck").click(function() {
        $(":checkbox", $("#trophy_setting")).prop("checked", false);
        save();
        redraw();
    });
    $("#trophy_import").click(function() {
        if (!confirm("まりストのセーブデータからアイテム獲得状況をインポートします。\nインポートにはまりストアカウントのIDとパスワードを入力する必要があります。\n（IDとパスワードの情報はアイテム獲得状況のインポート以外には使用しません）")) return;
        var userId = prompt("あなたのまりストアカウントのIDを入力してください", "");
        if (userId === null) return;
        var password = prompt("あなたのまりストアカウントのパスワードを入力してください", "");
        if (password === null) return;

        function getMarisutoSaveData(url, success, error, complete) {
            $.ajax({
                url: "http://query.yahooapis.com/v1/public/yql",
                data: {
                    q: "select * from html where url='" + url + "'",
                    format: "json"
                },
                success: function(data) {
                    if (data.query.results !== null) {
                        success(data.query.results.body);
                    } else {
                        error();
                    }
                },
                error: error,
                complete: complete
            });
        }
        function onError() {
            alert("セーブデータの読み込みに失敗しました。");
        }
        function onComplete() {
            $("#trophy_import").prop("disabled", false);
            $("#trophy_import").css("color", "#000000");
        }
        
        $("#trophy_import").prop("disabled", true);
        $("#trophy_import").css("color", "#999999");
        getMarisutoSaveData("http://sitappagames.zombie.jp/udk_story/udk/user_data/" + CryptoJS.MD5(userId).toString() + "/" + CryptoJS.MD5(password).toString() + ".txt", function(saveData) {
            loadFromSaveData(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(saveData)));
            onComplete();
        }, function() {
            getMarisutoSaveData("http://sitappagames.zombie.jp/udk_story/udk/user_data2/" + CryptoJS.MD5(userId).toString() + "/" + CryptoJS.MD5(password).toString() + ".txt", function(saveData) {
                loadFromSaveData(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(saveData)));
            }, onError, onComplete);
        }, function() {});
    });

    $("#difficulty_setting").val("0");
    $("#difficulty_setting").trigger("change");
});

function loadFromSaveData(saveData) {
    var itemHash = {};
    Item.all.forEach(function(item) {
        itemHash[item.idAsString] = item;
    });

    $(":checkbox", $("#trophy_setting")).prop("checked", false);
    saveData.split(/::/).find(function(p) {return p.split(/==/)[0] == "my_item"}).split(/==/)[1].split(/##/).forEach(function(trophy) {
        if (itemHash.hasOwnProperty(trophy)) {
            $("#trophy_setting_" + itemHash[trophy].id).prop("checked", true);
        }
    });

    save();
    redraw();
    $("#trophy_import").prop("disabled", false);
    $("#trophy_import").css("color", "#000000");
}
