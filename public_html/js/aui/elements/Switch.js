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
            value : false,
            min : 0,
            max : 99,
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
        function check()
        {
            value.value(options.max);
            options.value = true;
            if (options.onchange) options.onchange.call(true);
        }
        function uncheck()
        {
            value.value(options.min);
            options.value = false;
            if (options.onchange) options.onchange.call(false);
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
            if (pos.value() > (pos.max() - pos.min()) / 2) check();
            else uncheck();
        }
        function onMove(dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            value.value(utils.convertRangedValue(p, pos.min(), pos.max(), value.min(), value.max()));
        }
        function  changeValue(val)
        {
            pos.value(utils.convertRangedValue(val, value.min(), value.max(), pos.min(), pos.max()));
        }
        function  changePos(val)
        {
            if (isHorizontal) drag.left(val);
            else drag.top(val);
        }
        this.value = function(val)
        {
            if (val === undefined) return options.value;
            if (val) check();
            else uncheck();
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

        var ok = new Element({ class : "ok" }).appendTo(drag);
        extensions.clickable(ok);
        ok.onClick(uncheck);
        var no = new Element({ class : "no" }).appendTo(drag);
        extensions.clickable(no);
        no.onClick(check);

        drag.refreshOffsetOnMove(false);
        drag.onMove(onMove);
        drag.onMoveStart(onMoveStart);
        drag.onMoveEnd(onMoveEnd);
        drag.onResize(onResize);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
        this.value(options.value);
    }
    core.proto(Switch, Element);
//---------------------------------------------------------------------------
    return Switch;
//---------------------------------------------------------------------------
});

