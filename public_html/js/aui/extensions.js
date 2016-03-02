define([ "aui/core" ],
function(core)
{
//-------------------------------------------------------------------------------------------------------------------
    var extensions = { };
//-------------------------------------------------------------------------------------------------------------------
    extensions.selectable = function(owner)
    {
//Переменные
        var className = "selected";
//Функции
        owner.selectedClass = function(name)
        {
            if (name === undefined) return className;
            className = name;
        };
        owner.select = function()
        {
            owner.addClass(owner.selectedClass());
        };
        owner.unselect = function()
        {
            owner.removeClass(owner.selectedClass());
        };
        owner.selected = function()
        {
            return owner.hasClass(owner.selectedClass());
        };
        owner.toggleSelect = function()
        {
            owner.toggleClass(owner.selectedClass());
        };
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.resizable = function(owner)
    {
//События
        var onresize = null;
//Переменные
        var element = core.getElement(owner);
//Функции
        owner.width = function(value)
        {
            if (value === undefined) return element.offsetWidth;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.width = value;
            if (onresize) onresize.call(owner);
        };
        owner.height = function(value)
        {
            if (value === undefined) return element.offsetHeight;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.height = value;
            if (onresize) onresize.call(owner);
        };
        owner.clientWidth = function(value)
        {
            if (value === undefined) return element.clientWidth;
        };
        owner.clientHeight = function(value)
        {
            if (value === undefined) return element.clientHeight;
        };
        owner.onResize = function(fn)
        {
            if (fn === undefined) return onresize;
            if (typeof fn !== "function") throw new Error("fn for onResize not a function");
            onresize = fn;
        };
        owner.resize = function()
        {
            if (onresize) onresize.call(owner, event);
        };
        core.addEvent(element, "resize", owner.resize);
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.clickable = function(owner)
    {
//Переменные
        var fnList = [ ];
        var onclick = null;
//Функции
        owner.onClick = function(fn)
        {
///console.log(arguments);
            if (arguments.length === 0) return onclick;
//        if (fn === undefined) return onclick;
            if ((arguments.length === 1) && (arguments[0] === null))
//        if (fn === null)
            {
                onclick = null;
                return;
            }
            if ((arguments.length === 1) && (typeof arguments[0] === "function"))
//        if (typeof fn === "function")
            {
                onclick = arguments[0];
                return;
            }
            if (typeof arguments[0] !== "function") throw new Error("type of onclick arguments[0] \"" + typeof arguments[0] + "\" is not a function");
            for (var index in arguments)
            {
                if (typeof arguments[index] === "function") fnList.push({ fn : arguments[index], args : [ ] });
                else fnList[fnList.length - 1].args.push(arguments[index]);
            }
            onclick = function()
            {
//                console.log(fnList);
                for (var index in fnList) fnList[index].fn.apply(owner, fnList[index].args);
            };
//        if (fn instanceof Array)
//        {
//            var isArrayFunction = true;
//            for (var index in fn) if (typeof fn[index] !== "function") isArrayFunction = false;
//            if (isArrayFunction)
//            {
//                onclick = function()
//                {
//                    for (var index in fn) fn[index].apply(owner, arguments);
//                };
//                return;
//            }
//        }
//        throw new Error("type of onclick fn \"" + typeof fn + "\" is not a function");
        };
        owner.click = function()
        {
            if (onclick) onclick.apply(owner, arguments);
        };
//Сборка
        owner.getElement().onclick = owner.click;
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.validable = function(owner)
    {
//Переменные
        var required = false;
        var validator = null;
//Функции
        function onvalidate()
        {
            if (validate(owner.value(), required)) owner.removeClass("invalid");
            else owner.addClass("invalid");
        }
        function validate(value, required)
        {
            if (value.length === 0) return !required;
            if (validator) return validator.validate(value);
            return true;
        }
        /**
         * Обязательность заполнения.<br/>
         * @param {Boolean | undefined} value true - обязательно, false - не обязательно, undefined - возврат текущего значения.
         * @returns {Boolean | undefined}
         */
        owner.required = function(value)
        {
            if (value === undefined) return required;
            required = value;
        };
        owner.validator = function(value)
        {
            if (value === undefined) return validator;
            validator = value;
        };
        owner.invalid = function()
        {
            onvalidate();
            return owner.hasClass("invalid");
        };
//Сборка
        var element = core.getElement(owner);
        element.onfocus = onvalidate;
        element.onkeyup = onvalidate;
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.movable = function(owner)
    {
        var element = core.getElement(owner);
//События
        var onmovestart = null;
        var onmoveend = null;
        var onmove = null;
//Переменные
        var keepedClientX = 0;
        var keepedClientY = 0;
        var lockX = false;
        var lockY = false;
        var isRefreshOffsetOnMove = true;
//Функции
        function onMouseDown(event)
        {
            core.addEvent(document, "mousemove", onMouseMove);
            core.addEvent(document, "mouseup", onMouseUp);
            keepedClientX = event.clientX;
            keepedClientY = event.clientY;
            if (onmovestart) onmovestart.call(owner, event);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMouseUp(event)
        {
            core.removeEvent(document, "mousemove", onMouseMove);
            core.removeEvent(document, "mouseup", onMouseUp);
            if (onmoveend) onmoveend.call(owner, event);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMouseMove(event)
        {
            var dX = 0;
            if (!lockX) dX = event.clientX - keepedClientX;
            var dY = 0;
            if (!lockY) dY = event.clientY - keepedClientY;
            if (isRefreshOffsetOnMove)
            {
                keepedClientX = event.clientX;
                keepedClientY = event.clientY;
            }
            if (onmove) onmove.call(owner, event, dX, dY);
        }
        function onDragStart()
        {
            return false;
        }
        owner.onMoveStart = function(fn)
        {
            if (fn === undefined) return onmovestart;
            if (fn !== null && typeof fn !== "function") throw new Error("fn for onMoveStart not a function");
            onmovestart = fn;
        };
        owner.onMove = function(fn)
        {
            if (fn === undefined) return onmove;
            if (fn !== null && typeof fn !== "function") throw new Error("fn for onMove not a function");
            onmove = fn;
        };
        owner.onMoveEnd = function(fn)
        {
            if (fn === undefined) return onmoveend;
            if (fn !== null && typeof fn !== "function") throw new Error("fn for onMoveEnd not a function");
            onmoveend = fn;
        };
        owner.refreshOffsetOnMove = function(value)
        {
            if (value === undefined) return isRefreshOffsetOnMove;
            isRefreshOffsetOnMove = !!value;
        };
//Сборка
        element.ondragstart = onDragStart;
        element.onmousedown = onMouseDown;
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.dragable = function(owner)
    {
//https://learn.javascript.ru/drag-and-drop
    };
//-------------------------------------------------------------------------------------------------------------------
    return extensions;
});