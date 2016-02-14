Vue.directive("select", {
    twoWay: true,
    priority: 1000,

    bind() {
        const self = this;
        $(this.el).select2().maximizeSelect2Height().on("change", function () {
            self.set(this.value);
        });
    },
    update(value) {
        $(this.el).val(value).trigger("change");
    },
    unbind() {
        $(this.el).off().select2("destroy");
    }
});
