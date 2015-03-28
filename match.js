function redraw() {
    switch ($("#mode_setting").val()) {
    case "single":
        $("#single_mode_chara_settings").css("display", "block");
        $("#team_mode_chara_settings").css("display", "none");
        var charaIds = Range.closed(1, 5).map(function(i){
            return parseInt($("#chara_setting_" + i).val(), 10);
        }).filter(function(charaId){return charaId >= 0});
        var redrawTarget = new Difficulty(-1, "戊辰戦争", false, charaIds.map(function(charaId){
            return new Enemy(Chara.all[charaId], $("#trophy_setting_" + charaId).prop("checked") ? (charaId == 243 ? 0.06 : charaId == 263 ? 0.0 : 0.29) : 0.0);
        }));
        break;
    case "team":
        $("#single_mode_chara_settings").css("display", "none");
        $("#team_mode_chara_settings").css("display", "block");
        var charaIds = Range.closed(1, 3).flatMap(function(i){
            return Range.closed(1, 5).map(function(j){return parseInt($("#chara_setting_" + i + "_" + j).val(), 10)});
        }).filter(function(charaId){return charaId >= 0});
        var redrawTarget = new Difficulty(-1, "超戊辰戦争", false, charaIds.map(function(charaId){
            return new Enemy(Chara.all[charaId], $("#trophy_setting_" + charaId).prop("checked") ? 0.31 : 0.0);
        }));
        break;
    }

    var tbody = $(document.createElement("tbody"));
    var table = $(document.createElement("table")).append(tbody);
    var dropProbabilities = redrawTarget.calcDropProbabilities(
        Chara.all.filter(function(chara){return $("#trophy_setting_" + chara.id).prop("checked") !== true})
    ).toArray();

    dropProbabilities.sort(function(x, y){
        var primaryCondition = y[1].cocoaful - x[1].cocoaful;
        var secondaryCondition = x[0].trophyOrder - y[0].trophyOrder;
        return primaryCondition != 0 ? primaryCondition : secondaryCondition;
    }).toHash().forEach(function(chara, dropProbability) {
        var tr = $(document.createElement("tr")).append(
          $(document.createElement("th")).text(chara.name)
        ).append(
          $(document.createElement("td")).css("font-family", "monospace").text(
            formatProbability(dropProbability.cocoaful)
          )
        );
        tbody.append(tr);
    });

    $("#drop_probability").empty().append(table);
}

$(function() {
    var savedTrophySetting = SaveData.load();

    $("#mode_setting").on("change", redraw);

    Range.closed(1, 5).concat(
      Range.closed(1, 3).flatMap(function(i){return Range.closed(1, 5).map(function(j){return i + "_" + j})})
    ).map(function(selectId){return $("#chara_setting_" + selectId)}).forEach(function(select) {
        Chara.all.filter(function(chara){return savedTrophySetting[chara.id] !== void(0)}).sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
            var option = $(document.createElement("option")).attr("value", chara.id).text(chara.name);
            select.append(option);
        });
        select.on("change", redraw);
    });

    Chara.all.filter(function(chara){return savedTrophySetting[chara.id] !== void(0)}).sort(function(x, y){return x.trophyOrder - y.trophyOrder}).forEach(function(chara) {
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

    redraw();
});
