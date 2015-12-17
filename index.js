function redraw() {
    var gachaKind = $("#gacha_setting").val() == "null" ? null : $("#gacha_setting").val().match(/Scout/) ? Scout : Difficulty;
    var gachaId = $("#gacha_setting").val() == "null" ? null : parseInt($("#gacha_setting").val().match(/\d+/)[0], 10);
    var charaId = parseInt($("#chara_setting").val(), 10);
    if (gachaKind === null && charaId < 0) return;
    var redrawTarget = gachaKind !== null ? gachaKind.all[gachaId] : Chara.all[charaId];

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);
    var propertyNameForSecondaryCondition = (redrawTarget instanceof Chara ? "id" : "trophyOrder");
    var dropProbabilities = redrawTarget["calcDropProbabilities" + (redrawTarget instanceof Chara ? "" : "OfCharas")](
      Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
    ).toArray();

    dropProbabilities.sort(function(x, y){
        var primaryCondition = (y[1][$("#cocoa_setting").val()].singleDrop + y[1][$("#cocoa_setting").val()].doubleDrop) - (x[1][$("#cocoa_setting").val()].singleDrop + x[1][$("#cocoa_setting").val()].doubleDrop);
        var secondaryCondition = x[0][propertyNameForSecondaryCondition] - y[0][propertyNameForSecondaryCondition];
        return x[0] instanceof Scout ? -1 : y[0] instanceof Scout ? 1 : primaryCondition != 0 ? primaryCondition : secondaryCondition;
    }).toHash().forEach(function(entity, dropProbability) {
        var link;
        if (entity instanceof Chara) {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#chara_setting").val(entity.id.toString());
                $("#gacha_setting").val("null");
                redraw();
            });
        } else {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#gacha_setting").val(entity.toString());
                $("#chara_setting").val("-1");
                redraw();
            });
            if (entity.finished) link = $(document.createElement("del")).append(link);
        }
        var tr = $(document.createElement("tr")).append(
          $(document.createElement("th")).append(link)
        ).append(
          $(document.createElement("td")).css("font-family", "monospace").text(
            formatProbability(dropProbability[$("#cocoa_setting").val()].singleDrop + dropProbability[$("#cocoa_setting").val()].doubleDrop)
          )
        );
        tbody.append(tr);
    });

    if (dropProbabilities.length > 0) {
        $("#drop_probability").empty().append(table);
    } else {
        $("#drop_probability").empty().text("（出現スカウトも出現クエストも）ないです");
    }
}
function save() {
    SaveData.save({
        charas: Chara.all.map(function(chara) {
            return $("#trophy_setting_" + chara.id);
        }).map(function(checkbox) {
            return checkbox.prop("checked");
        }),
        items: SaveData.load().items
    });
}

$(function() {
    [Scout, Difficulty].forEach(function(gachaKind) {
        var optGroup = $(document.createElement("optgroup")).attr("label", gachaKind == Scout ? "スカウト" : "クエスト");
        gachaKind.all.forEach(function(gacha) {
            var option = $(document.createElement("option")).attr("value", gacha.toString()).text(gacha.name);
            optGroup.append(option);
        });
        $("#gacha_setting").append(optGroup);
    });
    $("#gacha_setting").on("change", function() {
        $("#chara_setting").val("-1");
        redraw();
    });

    Chara.all.concat().sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
        var option = $(document.createElement("option")).attr("value", chara.id).text(chara.name);
        $("#chara_setting").append(option);
    });
    $("#chara_setting").on("change", function() {
        $("#gacha_setting").val("null");
        redraw();
    });

    $("#cocoa_setting").on("change", redraw);

    var savedTrophySetting = SaveData.load().charas;
    Chara.all.concat().sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
        var checkbox = $(document.createElement("input")).attr({
            id: "trophy_setting_" + chara.id,
            type: "checkbox",
            value: chara.id
        }).on("change", function() {
            save();
            redraw();
        });
        checkbox.prop("checked", savedTrophySetting[chara.id]);
        $("#trophy_setting").append(checkbox).append(" " + chara.name).append($(document.createElement("br")));
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
        if (!confirm("まりストのセーブデータからトロフィー獲得状況をインポートします。\nインポートにはまりストアカウントのIDとパスワードを入力する必要があります。\n（IDとパスワードの情報はトロフィー獲得状況のインポート以外には使用しません）")) return;
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

    $("#gacha_setting").val("Scout0");
    $("#gacha_setting").trigger("change");
});

function loadFromSaveData(saveData) {
    var charaHash = {};
    Chara.all.forEach(function(chara) {
        charaHash[chara.idAsString] = chara;
    });

    $(":checkbox", $("#trophy_setting")).prop("checked", false);
    saveData.split(/::/).find(function(p) {return p.split(/==/)[0] == "trophy_list"}).split(/==/)[1].split(/##/).forEach(function(trophy) {
        if (charaHash.hasOwnProperty(trophy)) {
            $("#trophy_setting_" + charaHash[trophy].id).prop("checked", true);
        }
    });

    save();
    redraw();
}
