/* global HTMLElement, Function */

define([ ],
function()
{
//-------------------------------------------------------------------------------------------------------------------
    var core = { };
//-------------------------------------------------------------------------------------------------------------------
    core.extend = function(source, target)
    {
        var value = { };
        for (var index in source) value[index] = source[index];
        for (var index in target) value[index] = target[index];
        return value;
    };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * прототипирование
     * @param {object} heir
     * @param {object} base
     * @returns {undefined}
     * 
     * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/create
     */
    core.proto = function(heir, base)
    {
        heir.prototype = Object.create(base.prototype);
        heir.prototype.constructor = heir;
    };
//-------------------------------------------------------------------------------------------------------------------
    core.construct = function(constructor, args)
    {
        var array = [ null ];
        if (args instanceof Array) array = args;
        else for (var index in arguments) array.push(args[index]);
        return new (Function.prototype.bind.apply(constructor, array));
    };
//-------------------------------------------------------------------------------------------------------------------
    core.getElement = function(element)
    {
        if (element === undefined) throw new Error("undefined is not element");
        if (element === null) throw new Error("null is not element");
        if (typeof element !== "object") throw new Error("no object is not element");
        if (element instanceof HTMLElement) return element;
        if (element instanceof BaseElement) return element.getElement();
        if (element[0] instanceof HTMLElement) return element[0];
        console.log("getElement", element);
        throw new Error("is not HTMLElement");
    };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * внешний прямоугольник
     * @param {type} target
     * @returns {data}
     */
    core.margin = function(target)
    {
        var element = core.getElement(target);
        var computedStyle = window.getComputedStyle(element);
        var data = { left : 0, right : 0, top : 0, bottom : 0, width : 0, height : 0, boxSizing : "content-box" };

        data.left = parseInt(computedStyle.marginLeft, 10);
        data.right = parseInt(computedStyle.marginRight, 10);
        data.top = parseInt(computedStyle.marginTop, 10);
        data.bottom = parseInt(computedStyle.marginBottom, 10);

        if (computedStyle.boxSizing === "border-box") data.boxSizing = "border-box";

        data.offsetWidth = element.offsetWidth;
        data.offsetHeight = element.offsetHeight;
        data.clientWidth = element.clientWidth;
        data.clientHeight = element.clientHeight;

        data.width = element.offsetWidth + (data.left + data.right);
        data.height = element.offsetHeight + (data.top + data.bottom);
        return data;
    };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * прямоугольник border
     * @param {type} target
     * @returns {data}
     */
    core.border = function(target)
    {
        var element = core.getElement(target);
        var computedStyle = window.getComputedStyle(element);
        var rect = { };
        rect.left = parseInt(computedStyle.borderLeft, 10);
        if (isNaN(rect.left)) rect.left = 0;
        rect.right = parseInt(computedStyle.borderRight, 10);
        if (isNaN(rect.right)) rect.right = 0;
        rect.top = parseInt(computedStyle.borderTop, 10);
        if (isNaN(rect.top)) rect.top = 0;
        rect.bottom = parseInt(computedStyle.borderBottom, 10);
        if (isNaN(rect.bottom)) rect.bottom = 0;
        return rect;
    };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * внутренний прямоугольник
     * @param {type} target
     * @returns {data}
     */
    core.padding = function(target)
    {
        var element = core.getElement(target);
        var computedStyle = window.getComputedStyle(element);
        var data = { left : 0, right : 0, top : 0, bottom : 0, width : 0, height : 0, boxSizing : "content-box" };

        data.left = parseInt(computedStyle.paddingLeft, 10);
        data.right = parseInt(computedStyle.paddingRight, 10);
        data.top = parseInt(computedStyle.paddingTop, 10);
        data.bottom = parseInt(computedStyle.paddingBottom, 10);

        if (computedStyle.boxSizing === "border-box") data.boxSizing = "border-box";

        data.offsetWidth = element.offsetWidth;
        data.offsetHeight = element.offsetHeight;
        data.clientWidth = element.clientWidth;
        data.clientHeight = element.clientHeight;

        data.width = element.clientWidth - (data.left + data.right);
        data.height = element.clientHeight - (data.top + data.bottom);
        return data;
    };
//-------------------------------------------------------------------------------------------------------------------
//    /**
//     * внешний прямоугольник
//     * @param {type} target
//     * @returns {data}
//     */
//    core.marginRect = function(target)
//    {
//        var element = core.getElement(target);
//        var computedStyle = window.getComputedStyle(element);
//        var rect = { left : 0, right : element.clientWidth, top : 0, bottom : element.clientHeight, boxSizing : "content-box" };
//        if (computedStyle.boxSizing === "border-box")
//        {
//            rect.boxSizing = "border-box";
//            rect.left -= parseInt(computedStyle.borderLeft, 10) - parseInt(computedStyle.marginLeft, 10);
//            rect.right += parseInt(computedStyle.borderRight, 10) + parseInt(computedStyle.marginRight, 10);
//            rect.top -= parseInt(computedStyle.borderTop, 10) - parseInt(computedStyle.marginTop, 10);
//            rect.bottom += parseInt(computedStyle.borderBottom, 10) + parseInt(computedStyle.marginBottom, 10);
//        }
//        else
//        {
//            rect.left -= parseInt(computedStyle.marginLeft, 10);
//            rect.right += parseInt(computedStyle.marginRight, 10);
//            rect.top -= parseInt(computedStyle.marginTop, 10);
//            rect.bottom += parseInt(computedStyle.marginBottom, 10);
//        }
//        rect.width = rect.right - rect.left;
//        rect.height = rect.bottom - rect.top;
//        return rect;
//    };
//-------------------------------------------------------------------------------------------------------------------
//    /**
//     * прямоугольник border
//     * @param {type} target
//     * @returns {data}
//     */
//    core.rectBorder = function(target)
//    {
//        var element = core.getElement(target);
//        var computedStyle = window.getComputedStyle(element);
//        var rect = { left : 0, right : element.clientWidth, top : 0, bottom : element.clientHeight, boxSizing : "content-box" };
//        if (computedStyle.boxSizing !== "border-box")
//        {
//            rect.left += parseInt(computedStyle.borderLeft, 10);
//            rect.right -= parseInt(computedStyle.borderRight, 10);
//            rect.top += parseInt(computedStyle.borderTop, 10);
//            rect.bottom -= parseInt(computedStyle.borderBottom, 10);
//        }
//        else
//        {
//            rect.boxSizing = "border-box";
//        }
//        return rect;
//    };
//-------------------------------------------------------------------------------------------------------------------
//    /**
//     * клиентский прямоугольник
//     * @param {type} target
//     * @returns {data}
//     */
//    core.clientRect = function(target)
//    {
//        var element = core.getElement(target);
//        var computedStyle = window.getComputedStyle(element);
//        var rect = { left : 0, right : element.clientWidth, top : 0, bottom : element.clientHeight, boxSizing : "content-box" };
//        if (computedStyle.boxSizing === "border-box")
//        {
//            rect.boxSizing = "border-box";
//            rect.left -= parseInt(computedStyle.borderLeft, 10);
//            rect.right -= parseInt(computedStyle.borderRight, 10);
//            rect.top -= parseInt(computedStyle.borderTop, 10);
//            rect.bottom -= parseInt(computedStyle.borderBottom, 10);
//        }
//        return rect;
//    };
//-------------------------------------------------------------------------------------------------------------------
//    /**
//     * внутренний прямоугольник
//     * @param {type} target
//     * @returns {data}
//     */
//    core.paddingRect = function(target)
//    {
//        var element = core.getElement(target);
//        var computedStyle = window.getComputedStyle(element);
//        var rect = { left : 0, right : element.clientWidth, top : 0, bottom : element.clientHeight, boxSizing : "content-box" };
//
//        rect.padding = { };
//        rect.padding.left = parseInt(computedStyle.paddingLeft, 10);
//        rect.padding.right = parseInt(computedStyle.paddingRight, 10);
//        rect.padding.top = parseInt(computedStyle.paddingTop, 10);
//        rect.padding.bottom = parseInt(computedStyle.paddingBottom, 10);
//
//        rect.left += rect.padding.left;
//        rect.right -= rect.padding.right;
//        rect.top += rect.padding.top;
//        rect.bottom -= rect.padding.bottom;
//
//        if (computedStyle.boxSizing === "border-box")
//        {
//            rect.boxSizing = "border-box";
//
//            rect.border = { };
//            rect.border.left = parseInt(computedStyle.borderLeft, 10);
//            rect.border.right = parseInt(computedStyle.borderRight, 10);
//            rect.border.top = parseInt(computedStyle.borderTop, 10);
//            rect.border.bottom = parseInt(computedStyle.borderBottom, 10);
//
//            rect.left += rect.border.left;
//            rect.right -= rect.border.right;
//            rect.top += rect.border.top;
//            rect.bottom -= rect.border.bottom;
//        }
//        rect.width = rect.right - rect.left;
//        rect.height = rect.bottom - rect.top;
//        return rect;
//    };
//-------------------------------------------------------------------------------------------------------------------
    core.left = function(target, value)
    {
        var element = core.getElement(target);
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
//-------------------------------------------------------------------------------------------------------------------
    core.right = function(target, value)
    {
        var element = core.getElement(target);
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
//-------------------------------------------------------------------------------------------------------------------
    core.top = function(target, value)
    {
        var element = core.getElement(target);
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
//-------------------------------------------------------------------------------------------------------------------
    core.bottom = function(target, value)
    {
        var element = core.getElement(target);
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
//-------------------------------------------------------------------------------------------------------------------
    core.width = function(target, value)
    {
        var element = core.getElement(target);
        if (value === undefined) return element.offsetWidth;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        element.style.width = value;
    };
//-------------------------------------------------------------------------------------------------------------------
    core.height = function(target, value)
    {
        var element = core.getElement(target);
        if (value === undefined) return element.offsetHeight;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        element.style.height = value;
    };
//-------------------------------------------------------------------------------------------------------------------
    core.clientWidth = function(target, value)
    {
        var element = core.getElement(target);
        if (value === undefined) return element.clientWidth;
    };
//-------------------------------------------------------------------------------------------------------------------
    core.clientHeight = function(target, value)
    {
        var element = core.getElement(target);
        if (value === undefined) return element.clientHeight;
    };
//-------------------------------------------------------------------------------------------------------------------
//if (typeof Element.prototype.addEventListener === 'undefined') 
//{
//    Element.prototype.addEventListener = function(e, callback) 
//    {
//        e = 'on' + e;
//        return this.attachEvent(e, callback);
//    };
//}
//-------------------------------------------------------------------------------------------------------------------
    /**
     * Добавление слушателя на событие eventName у объекта object и устанавливает функцию обратного вызова on.<br/>
     * @param {object} object
     * @param {string} eventName имя события, например click, mousedown и тд. (без on)
     * @param {function} on функция обратного вызова
     * @returns {undefined}
     */
    core.addEvent = function(object, eventName, on)
    {
//        if (obj.attachEvent) 
//        {
//            obj['e' + type + fn] = fn;
//            obj[type + fn] = function() 
//            {
//                obj['e' + type + fn](window.event);
//            }
//            obj.attachEvent('on' + type, obj[type + fn]);
//            return;
//        } 
        object.addEventListener(eventName, on, false);
    };
//------------------------------------------------------------------------------------------------------------------- 
    /**
     * Удаляет слушателя на событие eventName у объекта object и с функцией обратного вызова on.<br/>
     * @param {object} object
     * @param {string} eventName имя события, например click, mousedown и тд. (без on)
     * @param {function} on функция обратного вызова
     * @returns {undefined}
     */
    core.removeEvent = function(object, eventName, on)
    {
//        if (obj.detachEvent) 
//        {
//            obj.detachEvent('on' + type, obj[type + fn]);
//            obj[type + fn] = null;
//            return;
//        } 
        object.removeEventListener(eventName, on, false);
    };
//------------------------------------------------------------------------------------------------------------------- 
    /**
     * <b>Элемент DOM браузера.</b><br/>
     * По умолчанию div.<br/>
     * @param {object} options параметры:<br/>
     * - <b>element:</b> название элемента, например "div" или "span"<br/>
     * - <b>id:</b> id элемента, например для привязки стилей через "#".<br/>
     * - <b>class:</b> класс элемента, например для привязки стилей через ".".<br/>
     * @returns {Element}
     */
    function BaseElement(options)
    {
        //Опции
        options = core.extend(
        {
            element : "div",
            id : null,
            class : null,
            addclass : null
        }, options);
//Переменные
        var that = this;
        this.parent = null;
//Функции
        this.getElement = function()
        {
            return element;
        };
        /**
         * Добавление елемента как дочернего к указанному елементу.<br/>
         * В качестве контейнера можно указывать только елементы проходящие проверку instanceof aUI.Element или instanceof HTMLElement
         * @param {type} parent елемент, который станет контейнером для текушего элемента. 
         * @returns {undefined}
         */
        this.appendTo = function(parent)
        {
            that.parent = core.getElement(parent);
            if (typeof that.parent.appendChild !== "function") throw new Error("parent not contain appendChild function");
            that.parent.appendChild(that.getElement());
            if (typeof that.resize === "function") that.resize();
            return that;
        };
        this.remove = function()
        {
            var element = that.getElement();
            var parent = element.parentElement;
            if (parent) parent.removeChild(element);
        };
//        this.clear = function()
//        {
//            var element = that.getElement();
//            while (element.childNodes[0] !== undefined) element.removeChild(element.childNodes[0]);
//        };
//        this.id = function(id)
//        {
//            if (id === undefined) return that.getElement().id;
//            that.getElement().id = id;
//        };
//        this.class = function(name)
//        {
//            if (name === undefined) return that.getElement().className;
//            that.getElement().className = name;
//        };
//        this.addClass = function(name)
//        {
//            that.getElement().classList.add(name);
//        };
//        this.removeClass = function(name)
//        {
//            that.getElement().classList.remove(name);
//        };
//        this.hasClass = function(name)
//        {
//            return that.getElement().classList.contains(name);
//        };
//        this.toggleClass = function(name)
//        {
//            that.getElement().classList.toggle(name);
//        };
//        this.attr = function(name, value)
//        {
//            if (value === undefined) return that.getElement().getAttribute(name);
//            that.getElement().setAttribute(name, value);
//        };
//        this.css = function(name, value)
//        {
//            if (value === undefined) return that.getElement().style.get(name);
//            that.getElement().style.set(name, value);
//        };
//        this.hidden = function(hidden)
//        {
//            if (hidden === undefined) return that.getElement().style.display === "none";
//            if (hidden) that.getElement().style.display = "none";
//            else that.getElement().style.display = "";
//        };
//        this.toggleHidden = function()
//        {
//            that.hidden(!that.hidden());
//        };
//Сборка
        var element = document.createElement(options.element);
        element.aui = this;
        if (options.id) this.id(options.id);
        if (options.class) this.class(options.class);
        if (options.addclass) this.addClass(options.addclass);
    }
//------------------------------------------------------------------------------------------------------------------- 
//    BaseElement.prototype.appendTo = function(parent)
//    {  
//        parent = core.getElement(parent);
//        if (typeof parent.appendChild !== "function") throw new Error("parent not contain appendChild function");
//        parent.appendChild(this.getElement());
//        return this;
//    };
//    
    BaseElement.prototype.clear = function()
    {
        var element = this.getElement();
        while (element.childNodes[0] !== undefined) element.removeChild(element.childNodes[0]);
    };

    BaseElement.prototype.id = function(id)
    {
        if (id === undefined) return this.getElement().id;
        this.getElement().id = id;
    };
    BaseElement.prototype.class = function(name)
    {
        if (name === undefined) return this.getElement().className;
        this.getElement().className = name;
    };
    BaseElement.prototype.addClass = function(name)
    {
        this.getElement().classList.add(name);
    };
    BaseElement.prototype.removeClass = function(name)
    {
        this.getElement().classList.remove(name);
    };
    BaseElement.prototype.hasClass = function(name)
    {
        return this.getElement().classList.contains(name);
    };
    BaseElement.prototype.toggleClass = function(name)
    {
        this.getElement().classList.toggle(name);
    };
    BaseElement.prototype.attr = function(name, value)
    {
        if (value === undefined) return this.getElement().getAttribute(name);
        this.getElement().setAttribute(name, value);
    };
    BaseElement.prototype.hidden = function(hidden)
    {
        if (hidden === undefined) return this.getElement().style.display === "none";
        if (hidden) this.getElement().style.display = "none";
        else this.getElement().style.display = "";
    };
    BaseElement.prototype.toggleHidden = function()
    {
        this.hidden(!this.hidden());
    };
//------------------------------------------------------------------------------------------------------------------- 
    core.BaseElement = BaseElement;
//------------------------------------------------------------------------------------------------------------------- 
    return core;
//-------------------------------------------------------------------------------------------------------------------
});