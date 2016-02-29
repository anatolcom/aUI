define([ "aui/aUtils" ],
function(aUtils)
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
        if (element instanceof core.Element) return element.getElement();
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
     * - <b>text:</b> содержимое элемента в виде текста.<br/>
     * - <b>html:</b> содержимое элемента ввиде HTML данных.<br/>
     * @returns {Element}
     */
    core.Element = function Element(options)
    {
//Опции
        options = core.extend(
        {
            element : "div",
            id : null,
            class : null,
            addclass : null,
            text : null
//        html : null
        }, options);
//Переменные
        var that = this;
//События
        var onresize = null;
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
//        if (parent === null) throw new Error("can not apply appendTo for null");
//        if (parent instanceof aUI.Element) parent = parent.getElement();
//        if (!parent instanceof HTMLElement) throw new Error("can not apply appendTo for non HTMLElement");
            parent = core.getElement(parent);
            if (typeof parent.appendChild !== "function") throw new Error("parent not contain appendChild function");
            parent.appendChild(that.getElement());
            that.resize();
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
        this.text = function(text)
        {
            if (text === undefined) return that.getElement().textContent;
            that.getElement().textContent = text;
        };
//    this.html = function(html)
//    {
//        if (html === undefined) return that.getElement().innerHtml;
//        that.getElement().innerHtml = html;
//    };
        this.attr = function(name, value)
        {
            if (value === undefined) return that.getElement().getAttribute(name);
            that.getElement().setAttribute(name, value);
        };
//    this.css = function(name, value)
//    {
//        if (value === undefined) return that.getElement().style.get(name);
//        that.getElement().style.set(name, value);
//    };
        this.hidden = function(hidden)
        {
            if (hidden === undefined) return that.getElement().style.display === "none";
            if (hidden) that.getElement().style.display = "none";
            else that.getElement().style.display = "";
        };
        this.toggleHidden = function()
        {
            that.hidden(!that.hidden());
        };
        this.left = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginLeft = parseInt(computedStyle.marginLeft, 10);
                return that.getElement().offsetLeft - marginLeft;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.left = value;
        };
        this.right = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginRight = parseInt(computedStyle.marginRight, 10);
                return that.getElement().offsetRight - marginRight;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.right = value;
        };
        this.top = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginTop = parseInt(computedStyle.marginTop, 10);
                return that.getElement().offsetTop - marginTop;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.top = value;
        };
        this.bottom = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginBottom = parseInt(computedStyle.marginBottom, 10);
                return that.getElement().offsetBottom - marginBottom;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.bottom = value;
        };
        this.width = function(value)
        {
            if (value === undefined) return element.offsetWidth;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.width = value;
            if (onresize) onresize.call(that);
        };
        this.height = function(value)
        {
            if (value === undefined) return element.offsetHeight;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.height = value;
            if (onresize) onresize.call(that);
        };
        this.clientWidth = function(value)
        {
            if (value === undefined) return element.clientWidth;
        };
        this.clientHeight = function(value)
        {
            if (value === undefined) return element.clientHeight;
        };
        this.onResize = function(fn)
        {
            if (fn === undefined) return onresize;
            if (typeof fn !== "function") throw new Error("fn for onResize not a function");
            onresize = fn;
        };
        this.resize = function()
        {
            if (onresize) onresize.call(that);
        };
//Сборка
        var element = document.createElement(options.element);
        element.aui = this;
        if (options.id) this.id(options.id);
        if (options.class) this.class(options.class);
        if (options.addclass) this.addClass(options.addclass);
        if (options.text || options.text === 0 || options.text === false) this.text(options.text);
//if (options.html || options.html === 0 || options.html === false) this.html(options.html);
//aUI.extensions.resizable(this);
        if (options.width || options.width === 0) this.width(options.width);
        if (options.height || options.height === 0) this.height(options.height);
        core.addEvent(element, "resize", this.resize);
    };
//-------------------------------------------------------------------------------------------------------------------
    return core;
//-------------------------------------------------------------------------------------------------------------------
});