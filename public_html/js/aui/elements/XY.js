define([ "aui/core", "aui/aUtils" ],
function(core, aUtils)
{
//---------------------------------------------------------------------------
    function XY(options)
    {
//Опции
        options = core.extend(
        {
            class : "xy",
            x : 0,
            y : 0,
            minX : -5,
            maxX : 5,
            minY : -5,
            maxY : 5,
//rangeX : { min : -5, max : 5 },
//rangeY : { min : -5, max : 5 },
            roundX : null,
            roundY : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var position = { };
        position.left = options.x;
        position.top = options.y;
//Функции
        function posToValue(pos, min, max, len, round)
        {
            if (len === 0) return 0;
            var value = min + ((pos * ((max - min) + 1)) / len);
            if (typeof round !== "function") return value;
            return round(value);
        }
        function valueToPos(value, min, max, len)
        {
            var pos = Math.round(((value - min) * len) / ((max - min) + 1));
            return aUtils.trimByRange(pos, 0, len - 1);
        }
        function moveTo(left, top)
        {
            top = aUtils.trimByRange(top, 0, e.clientHeight - 1);
            left = aUtils.trimByRange(left, 0, e.clientWidth - 1);
            options.x = posToValue(left, options.minX, options.maxX, e.clientWidth, options.roundX);
            options.y = posToValue(top, options.minY, options.maxY, e.clientHeight, options.roundY);
            position.left = valueToPos(options.x, options.minX, options.maxX, e.clientWidth);
            position.top = valueToPos(options.y, options.minY, options.maxY, e.clientHeight);
            update();
        }

        function onMouseDown(event)
        {
            core.addEvent(document, "mousemove", onMouseMove);
            core.addEvent(document, "mouseup", onMouseUp);
            onMouseMove(event);
        }
        function onMouseUp(event)
        {
            core.removeEvent(document, "mousemove", onMouseMove);
            core.removeEvent(document, "mouseup", onMouseUp);
        }
        function onMouseMove(event)
        {
            var rect = e.getBoundingClientRect();
            var borderWidth = Math.floor((rect.width - e.clientHeight) / 2);
            var borderHeight = Math.floor((rect.height - e.clientHeight) / 2);
            var left = event.clientX - rect.left - borderWidth;
            var top = event.clientY - rect.top - borderHeight;
            moveTo(left, top);
        }
        function onDragStart()
        {
            return false;
        }
        function update()
        {
            pX.style.width = position.left + "px";
            pY.style.height = position.top + "px";
            var rect = m.getBoundingClientRect();
            var dl = Math.floor(rect.width / 2);
            var dt = Math.floor(rect.height / 2);
            m.style.left = (position.left - dl) + "px";
            m.style.top = (position.top - dt) + "px";
        }

        this.x = function(value)
        {
            if (value === undefined) return options.x;
            options.x = aUtils.trimByRange(value, options.minX, options.maxX);
        };
        this.y = function(value)
        {
            if (value === undefined) return options.y;
            options.y = aUtils.trimByRange(value, options.minY, options.maxY);
        };
        this.roundX = function(fn)
        {
            if (fn === undefined) return options.roundX;
            if (typeof fn !== "function") throw new Error("fn for roundX not a function");
            options.roundX = fn;
        };
        this.roundY = function(fn)
        {
            if (fn === undefined) return options.roundY;
            if (typeof fn !== "function") throw new Error("fn for roundY not a function");
            options.roundY = fn;
        };
//Сборка
        var area = new core.Element({ class : "area" }).appendTo(this);
        var progressX = new core.Element({ class : "x" }).appendTo(area);
        var progressY = new core.Element({ class : "y" }).appendTo(area);
        var move = new core.Element({ class : "move", width : 15, height : 15 }).appendTo(area);
        var e = area.getElement();
        var pX = progressX.getElement();
        var pY = progressY.getElement();
        var m = move.getElement();
        e.style.position = "relative";
        pX.style.position = "absolute";
        pX.style.height = "100%";
        pY.style.position = "absolute";
        pY.style.width = "100%";
        m.style.position = "absolute";
//e.onmousedown = onMouseDown;
        m.ondragstart = onDragStart;
        e.ondragstart = onDragStart;
        e.addEventListener("mousedown", onMouseDown);
//    m.addEventListener("mousedown", onMouseDown);
//e.addEventListener("dragstart", onDragStart);
//    var observer = new MutationObserver(function(mutations) 
//    {
//        mutations.forEach(function(mutationRecord) 
//        {
//            console.log('style changed!');
//            update;
//        });
//    });
//    observer.observe(m, { attributes : true, attributeFilter : [ 'style' ] });
        update();
        m.style.left = "-7px";
        m.style.top = "-7px";
    }
    core.proto(XY, core.Element);
//---------------------------------------------------------------------------
    return XY;
//---------------------------------------------------------------------------
});