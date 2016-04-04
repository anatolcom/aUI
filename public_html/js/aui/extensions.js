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
        owner.selected = function(value)
        {
            if (value === undefined) return owner.hasClass(className);
            if (value) owner.select();
            else owner.unselect();
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
                var computedStyle = window.getComputedStyle(element);
                var marginLeft = parseInt(computedStyle.marginLeft, 10);
                return element.offsetLeft - marginLeft;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.left = value;
        };
        owner.right = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(element);
                var marginRight = parseInt(computedStyle.marginRight, 10);
                return element.offsetRight - marginRight;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.right = value;
        };
        owner.top = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(element);
                var marginTop = parseInt(computedStyle.marginTop, 10);
                return element.offsetTop - marginTop;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.top = value;
        };
        owner.bottom = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(element);
                var marginBottom = parseInt(computedStyle.marginBottom, 10);
                return element.offsetBottom - marginBottom;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.bottom = value;
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
        var element = core.getElement(owner);
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
        element.onclick = owner.click;
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
        owner.validate = onValidate;
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
        var startPoint = { x : 0, y : 0 };
        var keepedPoint = { x : 0, y : 0 };
        var currentPoint = { x : 0, y : 0 };
        var limit = 0;
        var moved = false;
        var lockX = false;
        var lockY = false;
        var isRefreshOffsetOnMove = true;
//Функции
        function onMouseDown(event)
        {
            core.addEvent(document, "mousemove", onMouseMove);
            core.addEvent(document, "mouseup", onMouseUp);
//            prepareStart({ x : event.clientX, y : event.clientY });
            prepareStart({ x : event.pageX, y : event.pageY });
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMouseUp(event)
        {
            core.removeEvent(document, "mousemove", onMouseMove);
            core.removeEvent(document, "mouseup", onMouseUp);
            moveEnd(currentPoint);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onMouseMove(event)
        {
//            move({ x : event.clientX, y : event.clientY });
            move({ x : event.pageX, y : event.pageY });
        }
        function onTouchStart(event)
        {
            var touch = event.touches[0];
            if (touch.target !== element) return;
            core.addEvent(element, "touchmove", onTouchMove);
            core.addEvent(element, "touchend", onTouchEnd);
            prepareStart({ x : touch.pageX, y : touch.pageY });
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onTouchEnd(event)
        {
            core.removeEvent(element, "touchmove", onTouchMove);
            core.removeEvent(element, "touchend", onTouchEnd);
            moveEnd(currentPoint);
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
        }
        function onTouchMove(event)
        {
            var touch = event.touches[0];
            move({ x : touch.pageX, y : touch.pageY });
        }
        function onDragStart()
        {
            return false;
        }
        function prepareStart(point)
        {
            currentPoint.x = keepedPoint.x = startPoint.x = point.x;
            currentPoint.y = keepedPoint.y = startPoint.y = point.y;
            moved = false;
//            if (onmovestart) onmovestart.call(owner);
        }
        function moveStart()
        {
            if (moved) return;
            moved = true;
            var point = { x : currentPoint.x, y : currentPoint.y };
            if (onmovestart) onmovestart.call(owner, point);
        }
        function moveEnd()
        {
            var point = { x : currentPoint.x, y : currentPoint.y };
            currentPoint.x = keepedPoint.x = startPoint.x = 0;
            currentPoint.y = keepedPoint.y = startPoint.y = 0;
            moved = false;
            if (onmoveend) onmoveend.call(owner, point);
        }
        function move(point)
        {
            currentPoint.x = point.x;
            currentPoint.y = point.y;
            var d =
            {
                x : point.x - keepedPoint.x,
                y : point.y - keepedPoint.y
            };
            if (Math.abs(point.x - startPoint.x) > limit) moveStart(); //d.x = 0;
            if (Math.abs(point.y - startPoint.y) > limit) moveStart(); //d.y = 0;
            if (!moved) return;
            if (lockX) d.x = 0;
            if (lockY) d.y = 0;
            if (isRefreshOffsetOnMove)
            {
                keepedPoint.x = point.x;
                keepedPoint.y = point.y;
            }
            if (onmove) onmove.call(owner, d.x, d.y, currentPoint);
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
        owner.limit = function(value)
        {
            if (value === undefined) return limit;
            if (typeof value !== "number") throw new Error("limit is not a number");
            limit = value;
        };
//Сборка
        element.ondragstart = onDragStart;
        element.onmousedown = onMouseDown;
        core.addEvent(element, "touchstart", onTouchStart);
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.draggable = function(owner)
    {
        var element = core.getElement(owner);
        element.classList.add("draggable");

        extensions.movable(owner);

//        owner.limit(10);

        var backup = null;


        function save(element)
        {
            backup =
            {
                parent : element.parentNode,
                nextSibling : element.nextSibling,
                style :
                {
                    position : element.style.position,
                    left : element.style.left,
                    right : element.style.right,
                    top : element.style.top,
                    bottom : element.style.bottom,
                    zIndex : element.style.zIndex
                }
            };
        }
        function rollback(element)
        {
            backup.parent.insertBefore(element, backup.nextSibling);
            element.style.position = backup.style.position;
            element.style.left = backup.style.left;
            element.style.top = backup.style.top;
            element.style.right = backup.style.right;
            element.style.bottom = backup.style.bottom;
            element.style.zIndex = backup.style.zIndex;
        }
        owner.onMoveStart(function(point)
        {
            save(element);
            var computedStyle = window.getComputedStyle(element);
            var left = parseInt(computedStyle.paddingLeft, 10);
            if (isNaN(left)) left = 0;
            var top = parseInt(computedStyle.paddingTop, 10);
            if (isNaN(top)) top = 0;
            var rect = element.getBoundingClientRect();
            element.style.position = "absolute";
            window.auiCurrentDragObject = owner;//??????????????????????????
            document.body.appendChild(element);
            element.style.left = rect.left - left + window.scrollX + "px";
            element.style.top = rect.top - top + window.scrollY + "px";
        });
        owner.onMoveEnd(function()
        {
            rollback(element);
            delete window.auiCurrentDragObject;//??????????????????????????
        });
        owner.onMove(function(dX, dY)
        {
            owner.left(owner.left() + dX);
            owner.top(owner.top() + dY);
        });

        var dock = undefined;
        owner.dock = function(value)
        {
            if (value === undefined) return dock;
            dock = value;
        };


//https://learn.javascript.ru/drag-and-drop
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.droppable = function(owner)
    {
        var element = core.getElement(owner);
        element.classList.add("droppable");

        function notAcceptable()
        {
            if (typeof window.auiCurrentDragObject !== "object") return 1;
            if (typeof window.auiCurrentDragObject.dock !== "function") return 2;
            if (window.auiCurrentDragObject.dock() === owner) return 3;
            return false;
        }
        function onMove(event)
        {
//            console.log("notAcceptable", notAcceptable());
            if (notAcceptable()) return;
            window.auiCurrentDragObject.dock(owner);
            element.classList.add("redy");
            console.log(event);
        }
        core.addEvent(element, "mousemove", onMove);
        core.addEvent(element, "touchmove", onMove);
//https://learn.javascript.ru/drag-and-drop
    };
//-------------------------------------------------------------------------------------------------------------------
    return extensions;
});