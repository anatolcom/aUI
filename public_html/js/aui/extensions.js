define([ "aui/core" ],
function(core)
{
//-------------------------------------------------------------------------------------------------------------------
    var extensions = { };
//-------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(extensions, 'selectable', { value : function(owner) { new Selectable(owner); } });

    function Selectable(owner)
    {
        //Переменные
        this.owner = owner;
        this.className = "selected";
        //События
        this.onchangeselected = null;    
        //Функции
        //Сборка
        Object.defineProperty(owner, 'selectedClass', { value : this.selectedClass.bind(this) });
        Object.defineProperty(owner, 'select', { value : this.select.bind(this) });
        Object.defineProperty(owner, 'unselect', { value : this.unselect.bind(this) });
        Object.defineProperty(owner, 'selected', { value : this.selected.bind(this) });
        Object.defineProperty(owner, 'toggleSelect', { value : this.toggleSelect.bind(this) });
        Object.defineProperty(owner, 'onChangeSelected', { value : this.onChangeSelected.bind(this) });
    }
    Selectable.prototype.selectedClass = function(name)
    {
        if (name === undefined) return this.className;
        if (typeof name !== "string") throw new Error("name for selectedClass not a string");
        this.className = name;
    };
    Selectable.prototype.select = function()
    {
        if (this.owner.selected()) return;
        this.owner.addClass(this.className);
        if (typeof this.onchangeselected === "function") this.onchangeselected.call(this.owner);
    };
    Selectable.prototype.unselect = function()
    {
        if (!this.owner.selected()) return;
        this.owner.removeClass(this.className);
        if (typeof this.onchangeselected === "function") this.onchangeselected.call(this.owner);
    };
    Selectable.prototype.selected = function(value)
    {
        if (value === undefined) return this.owner.hasClass(this.className);
        if (value) this.owner.select();
        else this.owner.unselect();
    };
    Selectable.prototype.toggleSelect = function()
    {
        this.owner.toggleClass(this.className);
        if (typeof this.onchangeselected === "function") this.onchangeselected.call(this.owner);
    };
    Selectable.prototype.onChangeSelected = function(fn)
    {
        if (fn === undefined) return this.onchangeselected;
        if (typeof fn !== "function" && fn !== null) throw new Error("fn for onChangeSelected not a function");
        this.onchangeselected = fn;
    };
//-------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(extensions, 'sizable', { value : function(owner) { new Sizable(owner); } });

    function Sizable(owner)
    {
        //Переменные
        var that = this;
        this.owner = owner;
        this.element = core.getElement(owner);
        //События
        this.onresize = null;
        //Функции
        function resize()
        {
            if (that.onresize) that.onresize.apply(owner, arguments);
        }
        //Сборка
        Object.defineProperty(owner, 'left', { value : this.left.bind(this) });
        Object.defineProperty(owner, 'right', { value : this.right.bind(this) });
        Object.defineProperty(owner, 'top', { value : this.top.bind(this) });
        Object.defineProperty(owner, 'bottom', { value : this.bottom.bind(this) });
        Object.defineProperty(owner, 'width', { value : this.width.bind(this) });
        Object.defineProperty(owner, 'height', { value : this.height.bind(this) });
        Object.defineProperty(owner, 'clientWidth', { value : this.clientWidth.bind(this) });
        Object.defineProperty(owner, 'clientHeight', { value : this.clientHeight.bind(this) });
        Object.defineProperty(owner, 'onResize', { value : this.onResize.bind(this) });
        Object.defineProperty(owner, 'resize', { value : resize });
        core.addEvent(this.element, "resize", resize);
    }
    Sizable.prototype.left = function(value)
    {
        if (value === undefined)
        {
            var computedStyle = window.getComputedStyle(this.element);
            var marginLeft = parseInt(computedStyle.marginLeft, 10);
            return this.element.offsetLeft - marginLeft;
        }
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.left = value;
    };
    Sizable.prototype.right = function(value)
    {
        if (value === undefined)
        {
            var computedStyle = window.getComputedStyle(this.element);
            var marginRight = parseInt(computedStyle.marginRight, 10);
            return this.element.offsetRight - marginRight;
        }
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.right = value;
    };
    Sizable.prototype.top = function(value)
    {
        if (value === undefined)
        {
            var computedStyle = window.getComputedStyle(this.element);
            var marginTop = parseInt(computedStyle.marginTop, 10);
            return this.element.offsetTop - marginTop;
        }
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.top = value;
    };
    Sizable.prototype.bottom = function(value)
    {
        if (value === undefined)
        {
            var computedStyle = window.getComputedStyle(this.element);
            var marginBottom = parseInt(computedStyle.marginBottom, 10);
            return this.element.offsetBottom - marginBottom;
        }
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.bottom = value;
    };
    Sizable.prototype.width = function(value)
    {
        if (value === undefined) return this.element.offsetWidth;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.width = value;
        if (this.onresize) this.onresize.call(this.owner);
    };
    Sizable.prototype.height = function(value)
    {
        if (value === undefined) return this.element.offsetHeight;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        this.element.style.height = value;
        if (this.onresize) this.onresize.call(this.owner);
    };
    Sizable.prototype.clientWidth = function(value)
    {
        if (value === undefined) return this.element.clientWidth;
    };
    Sizable.prototype.clientHeight = function(value)
    {
        if (value === undefined) return this.element.clientHeight;
    };
    Sizable.prototype.onResize = function(fn)
    {
        if (fn === undefined) return this.onresize;
        if (typeof fn !== "function" && fn !== null) throw new Error("fn for onResize not a function");
        this.onresize = fn;
    };
//-------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(extensions, 'clickable', { value : function(owner) { new Clickable(owner); } });

    function Clickable(owner)
    {
        //Переменные
        var that = this;
        this.owner = owner;
        this.element = core.getElement(owner);
        this.fnList = [ ];
        //События
        this.onclick = null;
        //Функции
        function click()
        {
            if (that.onclick) that.onclick.apply(owner, arguments);
        }
        //Сборка
        Object.defineProperty(owner, 'onClick', { value : this.onClick.bind(this) });
        Object.defineProperty(owner, 'click', { value : click });
        this.element.onclick = click;
   }
    Clickable.prototype.onClick = function(fn)
    {
        if (arguments.length === 0) return this.onclick;
        if ((arguments.length === 1) && (arguments[0] === null))
        {
            this.onclick = null;
            return;
        }
        if ((arguments.length === 1) && (typeof arguments[0] === "function"))
        {
            this.onclick = arguments[0];
            return;
        }
        if (typeof arguments[0] !== "function") throw new Error("type of onclick arguments[0] \"" + typeof arguments[0] + "\" is not a function");
        for (var index in arguments)
        {
            if (typeof arguments[index] === "function") this.fnList.push({ fn : arguments[index], args : [ ] });
            else this.fnList[this.fnList.length - 1].args.push(arguments[index]);
        }
        var that = this;
        this.onclick = function()
        {
            for (var index in that.fnList) that.fnList[index].fn.apply(that.owner, that.fnList[index].args);
        };
//        if (fn instanceof Array)
//        {
//            var isArrayFunction = true;
//            for (var index in fn) if (typeof fn[index] !== "function") isArrayFunction = false;
//            if (isArrayFunction)
//            {
//                this.onclick = function()
//                {
//                    for (var index in fn) fn[index].apply(this.owner, arguments);
//                };
//                return;
//            }
//        }
//        throw new Error("type of onclick fn \"" + typeof fn + "\" is not a function");
    };
//-------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(extensions, 'validable', { value : function(owner) { new Validable(owner); } });
    
    function Validable(owner)
    {
        //Переменные
        var that = this;
        this.owner = owner;
        this.element = core.getElement(owner);
        this.isRequired = false;
        this.validatorRef = null;
        //События

        //Функции
        /**
         * Обязательность заполнения.<br/>
         * @param {Boolean | undefined} value true - обязательно, false - не обязательно, undefined - возврат текущего значения.
         * @returns {Boolean | undefined}
         */
        Object.defineProperty(owner, 'required', { value : this.required.bind(this) });
        Object.defineProperty(owner, 'validator', { value : this.validator.bind(this) });
        Object.defineProperty(owner, 'validate', { value : this.validate.bind(this) });
        Object.defineProperty(owner, 'invalid', { value : this.invalid.bind(this) });
        //Сборка
//        this.element.onfocus = owner.validate;
        this.element.onblur = owner.validate;
        this.element.onkeyup = owner.validate;
    };
    Validable.prototype.isValid = function(value)
    {
        if (value.length === 0) return !this.isRequired;
        if (this.validatorRef) return this.validatorRef.validate(value);
        return true;
    };
    Validable.prototype.required = function(value)
    {
        if (value === undefined) return this.isRequired;
        this.isRequired = value;
    };
    Validable.prototype.validator = function(value)
    {
        if (value === undefined) return this.validatorRef;
        this.validatorRef = value;
    };
    Validable.prototype.validate = function()
    {
        if (this.isValid(this.owner.value())) this.owner.removeClass("invalid");
        else this.owner.addClass("invalid");
    };    
    Validable.prototype.invalid = function()
    {
        this.validate();
        return this.owner.hasClass("invalid");
    };   
//-------------------------------------------------------------------------------------------------------------------
    extensions.movable = function(owner)
    {
        //Переменные
        var element = core.getElement(owner);
        var startPoint = { x : 0, y : 0 };
        var keepedPoint = { x : 0, y : 0 };
        var currentPoint = { x : 0, y : 0 };
        var limit = 0;
        var moved = false;
        var lockX = false;
        var lockY = false;
        var isRefreshOffsetOnMove = true;
        //События
        var onmovestart = null;
        var onmoveend = null;
        var onmove = null;
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
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
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
            if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
            else event.returnValue = false; // Вариант Internet Explorer:
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
        extensions.movable(owner);
        //Переменные
        var element = core.getElement(owner);
        element.classList.add("draggable");


//        owner.limit(10);

        var backup = null;
        var droppableElement = null;

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
        function findDroppableElement(point) 
        {
            var x = point.x - document.documentElement.scrollLeft;
            var y = point.y - document.documentElement.scrollTop;
            element.style.visibility = "hidden";
            var droppable = document.elementFromPoint(x, y).closest('.droppable');
            element.style.visibility = "";
            if (droppable !== null && droppable.aui !== undefined) return droppable;
            return null;
        }
        function droppableReadyOn(element){
            if (element !== null) element.classList.add("redy");
        }
        function droppableReadyOff(element){
            if (element !== null) element.classList.remove("redy");
        }
        owner.onMoveStart(function()
        {
            save(element);
            droppableElement = null;
            var computedStyle = window.getComputedStyle(element);
            var left = parseInt(computedStyle.paddingLeft, 10);
            if (isNaN(left)) left = 0;
            var top = parseInt(computedStyle.paddingTop, 10);
            if (isNaN(top)) top = 0;
            var rect = element.getBoundingClientRect();
            element.style.position = "absolute";
            document.body.appendChild(element);
            element.style.left = rect.left - left + window.scrollX + "px";
            element.style.top = rect.top - top + window.scrollY + "px";
        });
        owner.onMoveEnd(function()
        {
            if (droppableElement === null) 
            {
                rollback(element);
                return ;
            } 
            droppableReadyOff(droppableElement);
            droppableElement.insertBefore(element, null);
            element.style.position = backup.style.position;
            element.style.left = backup.style.left;
            element.style.top = backup.style.top;
            element.style.right = backup.style.right;
            element.style.bottom = backup.style.bottom;
            element.style.zIndex = backup.style.zIndex;
        });
        owner.onMove(function(dX, dY, point)
        {
            owner.left(owner.left() + dX);
            owner.top(owner.top() + dY);
            var foundElement = findDroppableElement(point);
            if (droppableElement !== foundElement) {
                droppableReadyOff(droppableElement);
                droppableElement = foundElement;
                droppableReadyOn(droppableElement);
            }
        });
    };
//-------------------------------------------------------------------------------------------------------------------
    extensions.droppable = function(owner)
    {
        var element = core.getElement(owner);
        element.classList.add("droppable");
    };
//-------------------------------------------------------------------------------------------------------------------
    return extensions;
});