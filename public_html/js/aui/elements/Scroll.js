define([ "aui/core", "aui/utils" ],
function(core, utils)
{
//---------------------------------------------------------------------------
    function Scroll(options)
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
        var isHorizontal = true;
        var size = 50;
        var progressRect;
        var dragRect;
        var dragOffset = 0;
        var update;
        var onMouseMove;
//Функции
        function updateHorizontal()
        {
            var min = 0;
            var max = e.clientWidth - size;
            d.style.width = size + "px";
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            value = Math.round(value);
            d.style.left = value + "px";
            if (typeof options.onchange === "function") options.onchange.call(that, options.value);
        }
        function updateVertical()
        {
            var min = 0;
            var max = e.clientHeight - size;
            d.style.height = size + "px";
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            value = Math.round(value);
            d.style.top = value + "px";
            if (typeof options.onchange === "function") options.onchange.call(that, options.value);
        }
        function onMouseDown(event)
        {
            core.addEvent(document, "mousemove", onMouseMove);
            core.addEvent(document, "mouseup", onMouseUp);
            progressRect = e.getBoundingClientRect();
            dragRect = d.getBoundingClientRect();
            if (isHorizontal)
            {
                var dragLeftBorderWidth = Math.floor((progressRect.width - e.clientWidth) / 2);
                dragOffset = (event.clientX - dragRect.left) + dragLeftBorderWidth;
            }
            else
            {
                var dragTopBorderHeight = Math.floor((progressRect.height - e.clientHeight) / 2);
                dragOffset = (event.clientY - dragRect.top) + dragTopBorderHeight;
            }

            onMouseMove(event);
            that.addClass("move");
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMouseUp(event)
        {
            core.removeEvent(document, "mousemove", onMouseMove);
            core.removeEvent(document, "mouseup", onMouseUp);
            that.removeClass("move");
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMoveHorisontal(event)
        {
            var min = 0;
            var max = e.clientWidth - size;
            var pos = event.clientX - progressRect.left - dragOffset;
            pos = utils.trimByRange(pos, min, max);
            that.value(utils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onMoveVertical(event)
        {
            var min = 0;
            var max = e.clientHeight - size;
            var pos = event.clientY - progressRect.top - dragOffset;
            pos = utils.trimByRange(pos, min, max);
            that.value(utils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onDragStart()
        {
            return false;
        }
        this.value = function(value)
        {
            if (value === undefined) return options.value;
            if (options.round) value = options.round(value);
            value = utils.trimByRange(value, options.min, options.max);
            if (options.value === value) return;
            options.value = value;
            update();
        };
        this.round = function(fn)
        {
            if (fn === undefined) return options.round;
            if (fn === null)
            {
                options.round = null;
                return;
            }
            if (typeof fn !== "function") throw new Error("set round not a function");
            options.round = fn;
        };
//Сборка
        isHorizontal = options.orientation !== "vertical";
        var drag = new core.Element({ class : "drag" }).appendTo(this);
        if (isHorizontal)
        {
            this.addClass("horisontal");
            update = updateHorizontal;
            onMouseMove = onMoveHorisontal;
        }
        else
        {
            this.addClass("vertical");
            update = updateVertical;
            onMouseMove = onMoveVertical;
        }
        var e = this.getElement();
        var d = drag.getElement();
        e.style.position = "relative";
        d.style.position = "absolute";
        d.style.width = "100%";
        d.style.height = "100%";
        d.ondragstart = onDragStart;
        d.onmousedown = onMouseDown;
        this.round(options.round);
        this.value(options.value);
        update();
    }
    ;
    core.proto(Scroll, core.Element);
//---------------------------------------------------------------------------
    return Scroll;
//---------------------------------------------------------------------------
});