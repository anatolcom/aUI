define([ "aui/core", "./Element", "aui/utils", "aui/extensions" ],
function(core, Element, utils, extensions)
{
//---------------------------------------------------------------------------
    function Range(options)
    {
//Опции
        options = core.extend(
        {
            orientation : "horizontal",
            valueMin : 0,
            valueMax : 0,
            min : 0,
            max : 99,
            blocked : false,
            class : "range",
            round : null,
            onchange : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var valueMin = new utils.NumInRange(options.valueMin, options.min, options.max);
        var valueMax = new utils.NumInRange(options.valueMax, options.min, options.max);
        valueMin.onChange(changeValueMin);
        valueMax.onChange(changeValueMax);
        var posMin = new utils.NumInRange(0, 0, 0);
        var posMax = new utils.NumInRange(0, 0, 0);
        posMin.onChange(changePosMin);
        posMax.onChange(changePosMax);
        var lastPos = null;
        var roundDigits = 0;
        var fractionDigits = null;
//Функции
        function onResize(event)
        {
            var rect = core.rectPadding(that);
            if (isHorizontal)
            {
                posMin.min(rect.left);
                posMin.max(rect.right - dragMin.width());
                posMax.min(rect.left);
                posMax.max(rect.right - dragMax.width());
            }
            else
            {
                posMin.min(rect.top);
                posMin.max(rect.bottom - dragMin.height());
                posMax.min(rect.top);
                posMax.max(rect.bottom - dragMax.height());
            }
        }
        function onMoveStart(event)
        {
//onResize();
            if (isHorizontal) lastPos = this.left();
            else lastPos = this.top();
            that.addClass("move");
            this.addClass("move");
        }
        function onMoveEnd(event)
        {
            that.removeClass("move");
            this.removeClass("move");
        }
        function onMoveMin(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.valueMin(utils.convertRangedValue(p, posMin.min(), posMin.max(), valueMin.min(), valueMin.max()));
        }
        function onMoveMax(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.valueMax(utils.convertRangedValue(p, posMax.min(), posMax.max(), valueMax.min(), valueMax.max()));
        }
        function  changeValueMin(val)
        {
            if (options.blocked)
            {
                if (valueMax.value() < valueMin.value()) valueMin.value(valueMax.value());
            }
            else if (valueMin.value() > valueMax.value()) valueMax.value(valueMin.value());
            posMin.value(utils.convertRangedValue(valueMin.value(), valueMin.min(), valueMin.max(), posMin.min(), posMin.max()));
            if (fractionDigits === null) dragMinValue.text(valueMin.value());
            else dragMinValue.text(valueMin.value().toFixed(fractionDigits));
            if (options.onchange) options.onchange.call(that);
        }
        function  changeValueMax(val)
        {
            if (options.blocked)
            {
                if (valueMin.value() > valueMax.value()) valueMax.value(valueMin.value());
            }
            else if (valueMax.value() < valueMin.value()) valueMin.value(valueMax.value());
            posMax.value(utils.convertRangedValue(valueMax.value(), valueMax.min(), valueMax.max(), posMax.min(), posMax.max()));
            if (fractionDigits === null) dragMaxValue.text(valueMax.value());
            else dragMaxValue.text(valueMax.value().toFixed(fractionDigits));
            if (options.onchange) options.onchange.call(that);
        }
        function  changePosMin(val)
        {
            if (isHorizontal) dragMin.left(val);
            else dragMin.top(val);
            updateLine();
        }
        function  changePosMax(val)
        {
            if (isHorizontal) dragMax.left(val);
            else dragMax.top(val);
            updateLine();
        }
        function updateLine()
        {
            if (isHorizontal)
            {
                line.left(posMin.min() + posMin.value());
                line.width(posMax.value() - posMin.value());
            }
            else
            {
                line.top(posMin.min() + posMin.value());
                line.height(posMax.value() - posMin.value());
            }
        }
        this.valueMin = function(val)
        {
            if (options.round) val = options.round(val);
            valueMin.value(val);
        };
        this.valueMax = function(val)
        {
            if (options.round) val = options.round(val);
            valueMax.value(val);
        };
        this.round = function(fn)
        {
            if (fn === undefined) return options.round;
            if (fn === null)
            {
                options.round = null;
                return;
            }
            if (typeof fn === "number")
            {
                if (fn === 0) roundDigits = 0;
                else roundDigits = 1 / fn;
                fractionDigits = Math.round(roundDigits / 10);
//            console.log(fractionDigits);
                options.round = roundValue;
                return;
            }
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.round = fn;
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return options.onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        };
        roundValue = function(value)
        {
            if (roundDigits === 0) return Math.round(value);
            return Math.round(value * roundDigits) / roundDigits;
        };
//Сборка
        this.getElement().style.position = "relative";
        this.onResize(onResize);
        var line = new Element({ class : "line" }).appendTo(this);
        line.getElement().style.position = "absolute";
        var dragMin = new Element({ class : "drag min" }).appendTo(this);
        extensions.movable(dragMin);
//    var dragMin = new aUI.Movable({ class : "drag min" }).appendTo(this);
        dragMin.getElement().style.position = "absolute";
        dragMin.refreshOffsetOnMove(false);
        dragMin.onMove(onMoveMin);
        dragMin.onMoveStart(onMoveStart);
        dragMin.onMoveEnd(onMoveEnd);
        dragMin.onResize(onResize);
        var dragMinValue = new Element({ class : "value" }).appendTo(dragMin);
        var dragMax = new Element({ class : "drag max" }).appendTo(this);
        extensions.movable(dragMax);
//    var dragMax = new aUI.Movable({ class : "drag max" }).appendTo(this);
        dragMax.getElement().style.position = "absolute";
        dragMax.refreshOffsetOnMove(false);
        dragMax.onMove(onMoveMax);
        dragMax.onMoveStart(onMoveStart);
        dragMax.onMoveEnd(onMoveEnd);
        dragMax.onResize(onResize);
        var dragMaxValue = new Element({ class : "value" }).appendTo(dragMax);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
        updateLine();
    }
    core.proto(Range, Element);
//---------------------------------------------------------------------------
    return Range;
//---------------------------------------------------------------------------
});