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
    core.rectPadding = function(target)
    {
        var element = core.getElement(target);
        var computedStyle = window.getComputedStyle(element);
        var rect = { }; //new aUtils.Rect();
        rect.left = parseInt(computedStyle.paddingLeft, 10);
        if (isNaN(rect.left)) rect.left = 0;
        rect.right = element.clientWidth - parseInt(computedStyle.paddingRight, 10);
        if (isNaN(rect.right)) rect.right = target.width;
        rect.top = parseInt(computedStyle.paddingTop, 10);
        if (isNaN(rect.top)) rect.top = target.height;
        rect.bottom = element.clientHeight - parseInt(computedStyle.paddingBottom, 10);
        if (isNaN(rect.bottom)) rect.bottom = 0;
        return rect;
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
            parent = core.getElement(parent);
            if (typeof parent.appendChild !== "function") throw new Error("parent not contain appendChild function");
            parent.appendChild(that.getElement());
            return that;
        };
        this.clear = function()
        {
            var element = that.getElement();
            while (element.childNodes[0] !== undefined) element.removeChild(element.childNodes[0]);
        };
        this.remove = function()
        {
            var element = that.getElement();
            var parent = element.parentElement;
            if (parent) parent.removeChild(element);
        };
        this.id = function(id)
        {
            if (id === undefined) return that.getElement().id;
            that.getElement().id = id;
        };
        this.class = function(name)
        {
            if (name === undefined) return that.getElement().className;
            that.getElement().className = name;
        };
        this.addClass = function(name)
        {
            that.getElement().classList.add(name);
        };
        this.removeClass = function(name)
        {
            that.getElement().classList.remove(name);
        };
        this.hasClass = function(name)
        {
            return that.getElement().classList.contains(name);
        };
        this.toggleClass = function(name)
        {
            that.getElement().classList.toggle(name);
        };
        this.attr = function(name, value)
        {
            if (value === undefined) return that.getElement().getAttribute(name);
            that.getElement().setAttribute(name, value);
        };
//        this.css = function(name, value)
//        {
//            if (value === undefined) return that.getElement().style.get(name);
//            that.getElement().style.set(name, value);
//        };
//Сборка
        var element = document.createElement(options.element);
        element.aui = this;
        if (options.id) this.id(options.id);
        if (options.class) this.class(options.class);
        if (options.addclass) this.addClass(options.addclass);
    }
//------------------------------------------------------------------------------------------------------------------- 
    core.BaseElement = BaseElement;
//------------------------------------------------------------------------------------------------------------------- 
    return core;
//-------------------------------------------------------------------------------------------------------------------
});