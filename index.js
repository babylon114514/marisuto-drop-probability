function redraw() {
    var difficultyId = parseInt($("#difficulty_setting").val(), 10);
    var charaId = parseInt($("#chara_setting").val(), 10);
    if (difficultyId < 0 && charaId < 0) return;
    var redrawTarget = difficultyId >= 0 ? Difficulty.all[difficultyId] : Chara.all[charaId];

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);
    var propertyNameForSecondaryCondition = (redrawTarget instanceof Difficulty ? "trophyOrder" : "id");
    var dropProbabilities = redrawTarget["calcDropProbabilities" + (redrawTarget instanceof Difficulty ? "OfCharas" : "")](
      Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
    ).toArray();

    dropProbabilities.sort(function(x, y){
        var primaryCondition = (y[1][$("#cocoa_setting").val()].singleDrop + y[1][$("#cocoa_setting").val()].doubleDrop) - (x[1][$("#cocoa_setting").val()].singleDrop + x[1][$("#cocoa_setting").val()].doubleDrop);
        var secondaryCondition = x[0][propertyNameForSecondaryCondition] - y[0][propertyNameForSecondaryCondition];
        return primaryCondition != 0 ? primaryCondition : secondaryCondition;
    }).toHash().forEach(function(entity, dropProbability) {
        var link;
        if (entity instanceof Difficulty) {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#difficulty_setting").val(entity.id.toString());
                $("#chara_setting").val("-1");
                redraw();
            });
            if (entity.finished) link = $(document.createElement("del")).append(link);
        } else {
            link = $(document.createElement("a")).attr("href", "javascript:void(0);").text(entity.name).click(function() {
                $("#chara_setting").val(entity.id.toString());
                $("#difficulty_setting").val("-1");
                redraw();
            });
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
        $("#drop_probability").empty().text("（出現クエストが）ないです");
    }
}
function save() {
    SaveData.save({
        charas: Chara.all.map(function(chara) {
            return $("#trophy_setting_" + chara.id);
        }).map(function(checkbox) {
            return checkbox.size() == 0 ? void(0) : checkbox.prop("checked");
        }),
        items: SaveData.load().items
    });
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

    var savedTrophySetting = SaveData.load().charas;
    Chara.all.filter(function(chara){return savedTrophySetting[chara.id] !== void(0)}).sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
        var checkbox = $(document.createElement("input")).attr({
            id: "trophy_setting_" + chara.id,
            type: "checkbox",
            value: chara.id,
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

    $("#difficulty_setting").val("0");
    $("#difficulty_setting").trigger("change");
});