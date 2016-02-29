define([ "aui/core", "aui/aUtils", "aui/extension" ],
function(core, aUtils, extension)
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
        core.Element.call(this, options);
//Переменные
        var that = this;
        var value = new aUtils.NumInRange(options.value, options.min, options.max);
        var pos = new aUtils.NumInRange(0, 0, 0);
        value.onChange(changeValue);
        pos.onChange(changePos);
        var lastPos = null;
//Функции
        function onResize(event)
        {
            if (isHorizontal) pos.max(that.clientWidth() - drag.width());
            else pos.max(that.clientHeight() - drag.height());
//console.log("W", that.clientWidth(), "w", drag.width());
        }
        function onMoveStart(event)
        {
            if (isHorizontal) lastPos = drag.left();
            else lastPos = drag.top();
            that.addClass("move");
        }
        function onMoveEnd(event)
        {
            that.removeClass("move");
        }
        function onMove(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.value(aUtils.convertRangedValue(p, pos.min(), pos.max(), value.min(), value.max()));
        }
        function  changeValue(val)
        {
            pos.value(aUtils.convertRangedValue(value.value(), value.min(), value.max(), pos.min(), pos.max()));
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
//    core.addEvent(this.getElement(), "resize", onResize);
//    var drag = new aUI.Movable({ class : "drag" }).appendTo(this);
        var drag = new core.Element({ class : "drag" }).appendTo(this);
        extension.movable(drag);
        drag.getElement().style.position = "absolute";
//    drag.getElement().style.zIndex = "100";

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
    core.proto(Slider, core.Element);
//---------------------------------------------------------------------------
return Slider;

//---------------------------------------------------------------------------
});