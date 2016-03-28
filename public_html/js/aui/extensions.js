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
//События
        var onchangeselected = null;
//Функции
        owner.selectedClass = function(name)
        {
            if (name === undefined) return className;
            if (typeof name !== "string") throw new Error("name for selectedClass not a string");
            className = name;
        };
        owner.select = function()
        {
            if (owner.selected()) return;
            owner.addClass(className);
            if (typeof onchangeselected === "function") onchangeselected.call(owner);
        };
        owner.unselect = function()
        {
            if (!owner.selected()) return;
            owner.removeClass(className);
            if (typeof onchangeselected === "function") onchangeselected.call(owner);
        };
        owner.selected = function()
        {
            return owner.hasClass(className);
        };
        owner.toggleSelect = function()
        {
            owner.toggleClass(className);
            if (typeof onchangeselected === "function") onchangeselected.call(owner);
        };
        owner.onChangeSelected = function(fn)
        {
            if (fn === undefined) return onchangeselected;
            if (typeof fn !== "function" && fn !== null) throw new Error("fn for onChangeSelected not a function");
            onchangeselected = fn;
        };
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.sizable = function(owner)
    {
//Переменные
        var element = core.getElement(owner);
//События
        var onresize = null;
//Функции
        owner.left = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(owner.getElement());
                var marginLeft = parseInt(computedStyle.marginLeft, 10);
                return owner.getElement().offsetLeft - marginLeft;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            owner.getElement().style.left = value;
        };
        owner.right = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(owner.getElement());
                var marginRight = parseInt(computedStyle.marginRight, 10);
                return owner.getElement().offsetRight - marginRight;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            owner.getElement().style.right = value;
        };
        owner.top = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(owner.getElement());
                var marginTop = parseInt(computedStyle.marginTop, 10);
                return owner.getElement().offsetTop - marginTop;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            owner.getElement().style.top = value;
        };
        owner.bottom = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(owner.getElement());
                var marginBottom = parseInt(computedStyle.marginBottom, 10);
                return owner.getElement().offsetBottom - marginBottom;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            owner.getElement().style.bottom = value;
        };
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
            if (typeof fn !== "function" && fn !== null) throw new Error("fn for onResize not a function");
            onresize = fn;
        };
        owner.resize = function()
        {
            if (onresize) onresize.call(owner);
        };
        core.addEvent(element, "resize", owner.resize);
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.clickable = function(owner)
    {
//Переменные
        var fnList = [ ];
//События
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
//События
        var onvalidate = null;
//Функции
//field.setCustomValidity("Invalid field."); will make the field invalid.
//field.setCustomValidity(""); will make the field valid unless it fails an HTML5 constraint.
        function onValidate()
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
            onValidate();
            return owner.hasClass("invalid");
        };
        owner.onValidate = function(fn)
        {
            if (fn === undefined) return onvalidate;
            if (typeof fn !== "function" && fn !== null) throw new Error("fn for onValidate not a function");
            onvalidate = fn;
        };
//Сборка
        var element = core.getElement(owner);
        element.onfocus = onValidate;
        element.onkeyup = onValidate;
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
        function onTouchStart(event)
        {
            var touch = event.touches[0];
            if (touch.target !== element) return;
            core.addEvent(element, "touchmove", onTouchMove);
            core.addEvent(element, "touchend", onTouchEnd);
            keepedClientX = touch.pageX;
            keepedClientY = touch.pageY;
            if (onmovestart) onmovestart.call(owner, event);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onTouchEnd(event)
        {
            core.removeEvent(element, "touchmove", onTouchMove);
            core.removeEvent(element, "touchend", onTouchEnd);
            if (onmoveend) onmoveend.call(owner, event);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onTouchMove(event)
        {
            var touch = event.touches[0];
            var dX = 0;
            if (!lockX) dX = touch.pageX - keepedClientX;
            var dY = 0;
            if (!lockY) dY = touch.pageY - keepedClientY;
            if (isRefreshOffsetOnMove)
            {
                keepedClientX = touch.pageX;
                keepedClientY = touch.pageY;
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
        core.addEvent(element, "touchstart", onTouchStart);
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.dragable = function(owner)
    {
//https://learn.javascript.ru/drag-and-drop
    };
//-------------------------------------------------------------------------------------------------------------------
    return extensions;
});