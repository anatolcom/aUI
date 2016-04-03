define([ "aui/core", "./Element", "aui/utils", "aui/extensions" ],
function(core, Element, utils, extensions)
{
//---------------------------------------------------------------------------
    function Switch(options)
    {
//Опции
        options = core.extend(
        {
            class : "switch",
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
        function onClick()
        {
//            if (pos.value() > (pos.max() - pos.min()) / 2) value.value(options.max);
//            else  value.value(options.min);
        }
        function onResize()
        {
            var thatPadding = core.padding(that);
            var dragMargin = core.margin(drag);

            if (isHorizontal)
            {
                pos.min(thatPadding.left);
                pos.max(thatPadding.width - dragMargin.width + thatPadding.right);
                drag.top(thatPadding.top);
            }
            else
            {
                pos.min(thatPadding.top);
                pos.max(thatPadding.height - dragMargin.height + thatPadding.top);
                drag.left(thatPadding.left);
            }
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
//            console.log("pos", pos.min(), pos.value(), pos.max());
            if (pos.value() > (pos.max() - pos.min()) / 2) value.value(options.max);
            else  value.value(options.min);
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
            pos.value(utils.convertRangedValue(val, value.min(), value.max(), pos.min(), pos.max()));
            if (options.onchange) options.onchange.call(that, pos.value() > (pos.max() - pos.min()) / 2);
        }
        function  changePos(val)
        {
            if (isHorizontal) drag.left(val);
            else drag.top(val);
        }
        this.value = function(val)
        {
            if (val === undefined) return pos.value() > (pos.max() - pos.min()) / 2;
            value.value(Math.ceil(val));//round val
//            if (val) value.value(options.max);
//            else value.value(options.min);
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return options.onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        };
//Сборка
        this.getElement().onclick = onClick;

        this.getElement().style.position = "relative";
        this.onResize(onResize);
        var drag = new Element({ class : "drag" }).appendTo(this);
        extensions.movable(drag);
        drag.getElement().style.position = "absolute";
        
        var ok = new Element({ class : "ok" }).appendTo(drag);
        var no = new Element({ class : "no" }).appendTo(drag);

        drag.refreshOffsetOnMove(false);
        drag.onMove(onMove);
        drag.onMoveStart(onMoveStart);
        drag.onMoveEnd(onMoveEnd);
        drag.onResize(onResize);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
    }
    core.proto(Switch, Element);
//---------------------------------------------------------------------------
    return Switch;
//---------------------------------------------------------------------------
});

