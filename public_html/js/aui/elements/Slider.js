define([ "aui/core", "./Element", "aui/utils", "aui/extensions" ],
function(core, Element, utils, extensions)
{
//---------------------------------------------------------------------------
    function Slider(options)
    {
//Опции
        options = core.extend(
        {
            class : "scroll",
            orientation : "horizontal",
            value : 0,
            min : 0,
            max : 99,
            round : null,
            onchange : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var value = new utils.NumInRange(options.value, options.min, options.max);
        var pos = new utils.NumInRange(0, 0, 0);
        value.onChange(changeValue);
        pos.onChange(changePos);
        var lastPos = null;
//Функции
        function onResize()
        {
            if (isHorizontal) pos.max(that.clientWidth() - drag.width());
            else pos.max(that.clientHeight() - drag.height());
        }
        function onMoveStart()
        {
            if (isHorizontal) lastPos = drag.left();
            else lastPos = drag.top();
            that.addClass("move");
        }
        function onMoveEnd()
        {
            that.removeClass("move");
        }
        function onMove(dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.value(utils.convertRangedValue(p, pos.min(), pos.max(), value.min(), value.max()));
        }
        function  changeValue(val)
        {
            pos.value(utils.convertRangedValue(value.value(), value.min(), value.max(), pos.min(), pos.max()));
            if (options.onchange) options.onchange.call(that, val);
        }
        function  changePos(val)
        {
            if (isHorizontal) drag.left(val);
            else drag.top(val);
        }
        this.value = function(val)
        {
//round val
            value.value(Math.ceil(val));
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return options.onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        };
//Сборка
        this.getElement().style.position = "relative";
        this.onResize(onResize);
        var drag = new Element({ class : "drag" }).appendTo(this);
        extensions.movable(drag);
        drag.getElement().style.position = "absolute";

        drag.refreshOffsetOnMove(false);
        drag.onMove(onMove);
        drag.onMoveStart(onMoveStart);
        drag.onMoveEnd(onMoveEnd);
        drag.onResize(onResize);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal)
        {
            this.addClass("horisontal");
            drag.width("30px");
            drag.height("100%");
        }
        else
        {
            this.addClass("vertical");
            drag.width("100%");
            drag.height("30px");
        }
    };
    core.proto(Slider, Element);
//---------------------------------------------------------------------------
return Slider;

//---------------------------------------------------------------------------
});