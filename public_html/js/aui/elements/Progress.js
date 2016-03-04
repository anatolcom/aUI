define([ "aui/core", "./Element", "aui/utils" ],
function(core, Element, utils)
{
//---------------------------------------------------------------------------
    function Progress(options)
    {
//Опции
        options = core.extend(
        {
            class : "progress",
            orientation : "horizontal",
            value : 0,
            min : 0,
            max : 99,
            round : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var isHorizontal = true;
//Функции
        function update()
        {
            var min = 0;
            var max = 0;
            if (isHorizontal) max = e.clientWidth;
            else max = e.clientHeight;
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            if (isHorizontal) p.style.width = value + "px";
            else p.style.height = value + "px";
        }
        this.value = function(value)
        {
            if (value === undefined) return options.value;
            options.value = utils.trimByRange(value, options.min, options.max);
            update();
        };
        this.round = function(fn)
        {
            if (fn === undefined) return options.round;
            if (typeof fn !== "function") throw new Error("fn for round not a function");
            options.round = fn;
        };
//Сборка
        isHorizontal = options.orientation !== "vertical";
        var progress = new Element({ class : "value" }).appendTo(this);
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
//    progress.width("100%");
//    progress.height("100%");
        var e = this.getElement();
        var p = progress.getElement();
        e.style.position = "relative";
        p.style.position = "absolute";
        p.style.width = "100%";
        p.style.height = "100%";
        p.style.left = "0px";
        p.style.bottom = "0px";
        update();
    };
    core.proto(Progress, Element);
//---------------------------------------------------------------------------
    return Progress;
//---------------------------------------------------------------------------
});