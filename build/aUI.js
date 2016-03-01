define(
'aui/aUtils',[],function() {

    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */

    var aUtils = new (function()
    {
//------------------------------------------------------------------------------------------------------------------- 
//    this.Range = function Range(min, max)
//    {
//        this.min = min;
//        this.max = max;
//    };
//------------------------------------------------------------------------------------------------------------------- 
        this.NumInRange = function NumInRange(value, min, max)
        {
            var that = this;
            var data = { value : 0, min : min, max : max };
            var onchange = null;
            this.value = function(value)
            {
                if (value === undefined) return data.value;
                var temp = aUtils.trimByRange(value, data.min, data.max);
                if (data.value === temp) return;
                data.value = temp;
                if (onchange) onchange.call(that, data.value);
            };
            this.min = function(min)
            {
                if (min === undefined) return data.min;
                data.min = min;
                data.value = aUtils.trimByRange(data.value, data.min, data.max);
            };
            this.max = function(max)
            {
                if (max === undefined) return data.max;
                data.max = max;
                data.value = aUtils.trimByRange(data.value, data.min, data.max);
            };
            this.onChange = function(fn)
            {
                if (fn === undefined) return onchange;
                if (typeof fn !== "function") throw new Error("fn for onChange not a function");
                onchange = fn;
            };
            data.value = aUtils.trimByRange(value, min, max);
        };
//-------------------------------------------------------------------------------------------------------------------
        /**
         * Подрезка значения value по диапазону от min до max включительно.<br/>
         * @param {Number} value значение
         * @param {Number} min минимум
         * @param {Number} max махимум
         * @returns {Number}
         */
        this.trimByRange = function(value, min, max)
        {
            if (value < min) return min;
            if (value > max) return max;
            return value;
        };
//------------------------------------------------------------------------------------------------------------------- 
        /**
         * Находится ли значение value в диапазоне между min и max включительно.<br/>
         * @param {Number} value значение
         * @param {Number} min минимум
         * @param {Number} max махимум
         * @returns {Boolean}
         */
        this.inRange = function(value, min, max)
        {
            if (value < min) return false;
            if (value > max) return false;
            return true;
//        return (min <= value) && (value <= max);
        };
//-------------------------------------------------------------------------------------------------------------------
        /*    this.Rect = function Rect()
         {
         this.left = 0;
         this.right = 0;
         this.top = 0;
         this.bottom = 0;
         this.width = function()
         {
         return right - left;              
         };
         this.height = function()
         {
         return bottom - top;              
         };
         };*/
//-------------------------------------------------------------------------------------------------------------------
        /**
         * Находится ли точка x,y в пределах области rect включительно.<br/>
         * @param {Number} x
         * @param {Number} y
         * @param {Rect} rect прямоугольная область
         * @returns {Boolean}
         */
        this.inRect = function(x, y, rect)
        {
            if (!aUtils.inRange(x, rect.left, rect.right)) return false;
            if (!aUtils.inRange(y, rect.top, rect.bottom)) return false;
            return true;
        };
//------------------------------------------------------------------------------------------------------------------- 
        this.convertRangedValue = function(a, minA, maxA, minB, maxB)
        {
            var lenA = (maxA - minA);
            var lenB = (maxB - minB);
//        var lenA = (maxA - minA) + 1;
//        var lenB = (maxB - minB) + 1;
            var b = minB + (((a - minA) * lenB) / lenA);
//        console.log(a, minA, maxA, minB, maxB, b);
            return b;
        };
//------------------------------------------------------------------------------------------------------------------- 
        /** 
         * Преобразование числа number в строку с минимальной длиной length, при необходимости дополняет строку символом 0.<br/>
         * Если число не вмещается в строку длиной length, то формируется строка необходимой длинны.<br/>
         * @param {Number} number число, переводимое в строку.
         * @param {Number} length минимальная длина получаемой строки.
         * @returns {String} строка
         */
        this.numberToStrLen = function(number, length)
        {
            var value = String(number);
            while (value.length < length) value = "0" + value;
            return value;
        };
//------------------------------------------------------------------------------------------------------------------- 
        /**
         * Преобразование даты date в строку в соответствии с форматом format.<br/>
         * @param {Date} date дата
         * @param {String} format формат:<br/>
         * <b>yyyy</b> - год,<br/>
         * <b>MM</b> - месяц,<br/>
         * <b>dd</b> - ден,<br/>
         * <b>HH</b> - часы,<br/>
         * <b>mm</b> - минуты,<br/>
         * <b>ss</b> - секунды,<br/>
         * <b>SSS</b> - миллисекунды.<br/>
         * @example 
         * yyyy-MM-dd'T'HH:mm:ss.SSS<br/>
         * dd.MM.yyyy'г.'<br/>
         * @returns {String}
         */
        this.dateToStr = function(date, format)
        {
            if (!format) return "";
            function replace(str, mask, value, len)
            {
                return str.replace(new RegExp(mask), aUtils.numberToStrLen(value, len));
            }
            function fill(value, date)
            {
                value = replace(value, "yyyy", date.getFullYear(), 4);
                value = replace(value, "MM", date.getMonth() + 1, 2);
                value = replace(value, "dd", date.getDate(), 2);
                value = replace(value, "HH", date.getHours(), 2);
                value = replace(value, "mm", date.getMinutes(), 2);
                value = replace(value, "ss", date.getSeconds(), 2);
                value = replace(value, "SSS", date.getMilliseconds(), 3);
                return value;
            }
            try
            {
                var array = format.split("'");
                var value = "";
                for (var q = 0; q < array.length; q++)
                {
                    if (q % 2 === 0) value += fill(array[q], date);
                    else value += array[q];
                }
                return value;
            }
            catch (err)
            {
                throw new Error("formatDate(" + err.message + ")");
            }
        };
//---------------------------------------------------------------------------
        /**
         * Преобразование строки value в дату в соответствии с форматом format.<br/>
         * @param {String} value строка. например 
         * @param {String} format формат:<br/>
         * <b>yyyy</b> - год,<br/>
         * <b>MM</b> - месяц,<br/>
         * <b>dd</b> - ден,<br/>
         * <b>HH</b> - часы,<br/>
         * <b>mm</b> - минуты,<br/>
         * <b>ss</b> - секунды,<br/>
         * <b>SSS</b> - миллисекунды.<br/>
         * @example 
         * yyyy-MM-dd'T'HH:mm:ss.SSS<br/>
         * dd.MM.yyyy'г.'<br/>
         * @returns {Date}
         */
        this.strToDate = function(value, format)
        {
            function fill(value, trimFormat, mask, len)
            {
                var m = trimFormat.match(new RegExp(mask));
                if (m === null) return 0;
                var s = value.substr(m.index, len);
                if (!s) throw new Error("\"" + mask + "\" not found");
                var n = Number(s);
                if (isNaN(n)) throw new Error("\"" + mask + "\" : \"" + s + "\" is not a number");
                return n;
            }
            function spaces(length)
            {
                var value = "";
                while (value.length < length) value = " " + value;
                return value;
            }
            try
            {
                var array = format.split("'");
                var trimFormat = "";
                for (var q = 0; q < array.length; q++)
                {
                    if (q % 2 === 0) trimFormat += array[q];
                    else trimFormat += spaces(array[q].length);
                }
                var date = { year : 0, month : 0, day : 0, hours : 0, minutes : 0, seconds : 0, milliseconds : 0 };
                date.year = fill(value, trimFormat, "yyyy", 4);
                date.month = fill(value, trimFormat, "MM", 2) - 1;
                date.day = fill(value, trimFormat, "dd", 2);
                date.hours = fill(value, trimFormat, "HH", 2);
                date.minutes = fill(value, trimFormat, "mm", 2);
                date.seconds = fill(value, trimFormat, "ss", 2);
                date.milliseconds = fill(value, trimFormat, "SSS", 3);
                return new Date(date.year, date.month, date.day, date.hours, date.minutes, date.seconds, date.milliseconds);
            }
            catch (err)
            {
                throw new Error("value \"" + value + "\" does not match format \"" + format + "\" because: " + err.message);
            }
        };
//---------------------------------------------------------------------------
        this.saveBlobAsFile = function(blob, filename)
        {
            // для IE
            if (window.navigator.msSaveBlob)
            {
                window.navigator.msSaveBlob(blob, filename);
                return;
            }
            //для Нормальных браузеров
            var url = window.URL.createObjectURL(blob);
            var errorText = null;
            var a = document.createElement("a");
            if (typeof a.download === "string")
            {
                try
                {
                    a.href = url;
                    a.download = filename;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                }
                catch (err)
                {
                    errorText = "Возникли проблемы при скачивании...";
                }
            }
            else
            {
                console.error("download name not set");
                window.location.href = url;
            }
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            if (errorText) throw new Error(errorText);
        };
//---------------------------------------------------------------------------
        this.toUriParams = function(params)
        {
            if (!params) return "";
            return  Object.keys(params).map(function(key)
            {
                var value = params[key];
                if (typeof value === "object") value = JSON.stringify(value);
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }).join('&');
        };
//---------------------------------------------------------------------------
        this.download = function(url, params, onload)//, onSuccess, onFailure
        {
            function extractFileName(value, alter)
            {
                if (value === null) return alter;
                var expression = new RegExp("filename[^;=\\n]*=(['\"]?(.*)['\"]|[^;\\n]*)", "");
                var match = value.match(expression);
                if (!match) return alter;
                if (match[2] !== undefined) return decodeURIComponent(match[2]);
                if (match[1] !== undefined) return decodeURIComponent(match[1]);
                return alter;
            }
            var alterFileName = "download.dat";
            var p = aUtils.toUriParams(params);
            if (p !== "") url += "?" + p;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = function(event)
            {
                try
                {
                    var contentDisposition = this.getResponseHeader("Content-Disposition");
                    aUtils.saveBlobAsFile(this.response, extractFileName(contentDisposition, alterFileName));
                    if (typeof onload === "function") onload();
                }
                catch (err)
                {
                    if (typeof onload === "function") onload(err.message);
                }
            };
            xhr.send();
        };
//---------------------------------------------------------------------------

    })();

    return aUtils;
});
define('aui/core',[ "aui/aUtils" ],
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
define('aui/validator',[ "aui/aUI", "aui/aUtils" ],
function(aUI, aUtils)
{
//-------------------------------------------------------------------------------------------------------------------
    var validator = { };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * <b>Паттерн.</b><br/>
     * @param {string} value регулярное выражение<br/>
     * @returns {Pattern}
     */
    validator.Pattern = function Pattern(value)
    {
//Переменные
        var pattern = null;
        var expression = null;
//Функции
        this.pattern = function(value)
        {
            if (value === undefined) return pattern;
            pattern = value;
            if (!pattern) expression = null;
            else expression = new RegExp(pattern, "");
        };
        this.validate = function(value)
        {
            if (expression === null) return true;
            var match = value.match(expression);
            if (!match) return false;
            return match[0] === value;
        };
//Сборка
        this.pattern(value);
    };
//-------------------------------------------------------------------------------------------------------------------
    return validator;
//-------------------------------------------------------------------------------------------------------------------
});
define('aui/extension',[ "aui/core" ],
function(core)
{
//-------------------------------------------------------------------------------------------------------------------
    var extension = { };
//-------------------------------------------------------------------------------------------------------------------
    extension.selectable = function(owner)
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
    extension.resizable = function(owner)
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
    extension.clickable = function(owner)
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
    extension.validable = function(owner)
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
    extension.movable = function(owner)
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
    extension.dragable = function(owner)
    {
//https://learn.javascript.ru/drag-and-drop
    };
//-------------------------------------------------------------------------------------------------------------------
    return extension;
});
define('aui/elements/Link',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    function Link(options)
    {
//Опции
        options = core.extend(
        {
            element : "a",
            href : "javascript:",
            onclick : null
        }, options);
        core.Element.call(this, options);
        extension.clickable(this);
//Переменные
//Функции
//Сборка
        if (options.href) this.attr("href", options.href);
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Link, core.Element);

    return Link;
//-------------------------------------------------------------------------------------------------------------------
});
define('aui/elements/Button',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    /*
     * <b>Кнопка.<b><br/>
     * @param {object} options параметры:<br/>
     * @returns {Button}
     */
    function Button(options)
    {
//Опции
        options = core.extend(
        {
            element : "div",
            class : "button",
            onclick : null,
            data : null
        }, options);
        core.Element.call(this, options);
        extension.clickable(this);
        extension.selectable(this);
//Переменные
        this.data = options.data;
//Функции
//Сборка
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Button, core.Element);

    return Button;
//-------------------------------------------------------------------------------------------------------------------
});


define('aui/elements/Check',[ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    function Check(options)
    {
//Опции
        options = core.extend(
        {
            class : "check",
            value : null
        }, options);
        core.Element.call(this, options);
//Функции
        //  function getValue() { return $(input).is(":checked"); }
        //  function setValue(value)
        //  {
        //   if (getValue() === value) return this;
        //   if (value) $(input).attr("checked", "checked");
        //   else $(input).removeAttr("checked");
        //   return this;
        //  }
        //  function setFocus() { $(input).focus(); }
//События
        //  function setKeyPress(fn) { $(input).keypress(fn); }
        //  function setChange(fn) { $(input).change(fn); }
//Сборка
        //  var check = core.Element({ class : options.class, id : options.id });
        //  check.getValue = getValue;
        //  check.setValue = setValue;
        //  check.setFocus = setFocus;
        //  check.setKeyPress = setKeyPress;
        //  check.setChange = setChange;
        //  var input = core.Element({ element : "input" });
        //  $(input).attr("type", "checkbox");
        //// input.style.width="100%";
        //// input.style.height="100%";
        //  check.setValue(options.value);
        //  input.appendTo(check);
        //  //Возврат результата выполненого после сборки
        //  return check;
    }
    core.proto(Check, core.Element);
//---------------------------------------------------------------------------
    return Check;
//---------------------------------------------------------------------------
});
define('aui/elements/Edit',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    /**
     * <b>Строковое поле редактирования.</b><br/>
     * @param {object} options параметры:<br/>
     * - <b>element:</b> название элемента "input".<br/>
     * - <b>pattern:</b> регулярное выражение.<br/>
     * - <b>required:</b> обязательность наличия значения.<br/>
     * @returns {Edit}
     */
    function Edit(options)
    {
//Опции
        options = core.extend(
        {
            element : "input",
            type : null,
            placeholder : null,
            examples : null,
            required : false
        }, options);
        core.Element.call(this, options);
        extension.validable(this);
//Переменные
        var that = this;
//Функции
        this.value = function(value)
        {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        };
        this.type = function(value)
        {
            if (value === undefined) return that.attr("type");
            that.attr("type", value);
        };
        this.placeholder = function(value)
        {
            if (value === undefined) return that.attr("placeholder");
            that.attr("placeholder", value);
        };
        this.maxLength = function(value)
        {
            if (value === undefined) that.getElement().maxLength;
            that.getElement().maxLength = value;
        };
        this.focus = function()
        {
//if (value === undefined) return that.attr("placeholder");
            that.getElement().focus();
        };
        function fnUID(char)
        {
            var r = Math.random() * 16 | 0;
            var v = char === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
//Сборка
        if (options.type) this.type(options.type);
        if (options.required) this.required(options.required);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
        if (options.examples)
        {
            var id = "INPUT_" + "xxxxxxxxxxxxxxxx".replace(/[x]/g, fnUID);
            this.attr("list", id);
            var datalist = new core.Element({ element : "datalist", id : id }).appendTo(this);
            for (var index in options.examples)
            {
                new core.Element({ element : "option", text : options.examples[index] }).appendTo(datalist);
            }
        }
    }
    core.proto(Edit, core.Element);
//---------------------------------------------------------------------------
    return Edit;
//---------------------------------------------------------------------------
});
define('aui/elements/Select',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    /**
     * <b>Выпадающий список.</b><br/>
     * Метод value возвращает и устанавливает текущее значение.<br/>
     * Метод focus делает компанент активным.<br/>
     * @param {object} options входные данные:<br/>
     * value: текущее значение, null если нет значения<br/>
     * items: имеет разные варианты заполнения:
     * - список названий ["Название1","Название2"]. значением будет порядковый номер названия.<br/>
     * - ключи и значения {value1:"Название1",value2:"Название2"}. не гарантируется последовательность.<br/>
     * - список ключей и значений [{value:key1,text:"Название1"},{value:key2,text:"Название2"}].<br/>
     * disabled: значение невыбираемого элемента, null если нет значения<br/>
     * @returns {Select}
     */
    Select = function Select(options)
    {
//Опции
        options = core.extend(
        {
            element : "select",
            value : null,
            items : null,
            disabled : null,
            required : false
        }, options);
        core.Element.call(this, options);
        extension.validable(this);
//Переменные
        var that = this;
//Функции
        this.value = function(value)
        {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        };
        /**
         * <b>Установка полей.</b><br/>
         * допустимы разные варианты заполнения полей:<br/>
         * - <b>список названий</b> ["Название1","Название2"]. значением будет порядковый номер названия.<br/>
         * - <b>ключи и значения</b> {value1:"Название1",value2:"Название2"}. не гарантируется последовательность.<br/>
         * - <b>список ключей и значений</b> [{value:key1,text:"Название1"},{value:key2,text:"Название2"}].<br/>
         * @param {type} items поля выпадающего списка.
         * @param {type} disabled значение невыбираемого элемента, null если нет значения<br/>
         * @returns {undefined}
         */
        this.items = function(items, disabled)
        {
            options.value = this.value();
            that.clear();
            options.items = items;
            if (disabled === undefined) disabled = null;
            if (disabled === null) options.disabled = null;
            else disabled = String(disabled);
            options.disabled = disabled;
            if (items === null) return;
            if (items instanceof Array)
            {
                for (var index in items)
                {
                    var item = items[index];
                    var option = new core.Element({ element : "option" });
                    if (item instanceof Object)
                    {
                        option.text(item.text);
                        option.attr("value", item.value);
                        if (item.value === disabled) option.attr("disabled", "");
                    }
                    else
                    {
                        option.text(items[index]);
                        option.attr("value", index);
                        if (index === disabled) option.attr("disabled", "");
                    }
                    option.appendTo(that);
                }
            }
            else
            {
                for (var index in items)
                {
                    var option = new core.Element({ element : "option", text : items[index] });
                    option.attr("value", index);
                    if (index === disabled) option.attr("disabled", "");
                    option.appendTo(that);
                }
            }
            this.value(options.value);
        };
        this.focus = function()
        {
            that.getElement().focus();
        };
//Сборка
        if (options.type) this.type(options.type);
        if (options.required) this.required(options.required);
        this.value(options.value);
        this.items(options.items, options.disabled);
    };
    core.proto(Select, core.Element);
//---------------------------------------------------------------------------
    return Select;
//---------------------------------------------------------------------------
});
define('aui/elements/Memo',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    function Memo(options)
    {
//Опции
        options = core.extend(
        {
            element : "textarea",
            required : false
        }, options);
        core.Element.call(this, options);
        extension.validable(this);
//Переменные
        var that = this;
//Функции
        this.value = function(value)
        {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        };
        this.placeholder = function(value)
        {
            if (value === undefined) return that.attr("placeholder");
            that.attr("placeholder", value);
        };
        this.maxLength = function(value)
        {
            if (value === undefined) that.getElement().maxLength;
            that.getElement().maxLength = value;
        };
        this.focus = function()
        {
            that.getElement().focus();
        };
//Сборка
        if (options.required) this.required(options.required);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
    }
    core.proto(Memo, core.Element);
    /*Memo : function (options)
     {
     //Опции по умолчанию
     options = $.extend(
     {
     class : "Memo",
     }, options);
     //Функции
     function setFocus() { $(input).focus(); }
     //События
     function setKeyPress(fn) { $(input).keypress(fn); }
     //Сборка
     var memo = core.Element({ class : options.class, id : options.id });
     memo.setKeyPress = setKeyPress;
     memo.setFocus = setFocus;
     var input = core.Element({ element : "textarea" });
     if (options.name) $(input).attr("name", options.name);
     memo.setValue(options.value);
     input.appendTo(memo);
     
     //Возврат результата выполненого после сборки
     return memo;
     },*/
//---------------------------------------------------------------------------
    return Memo;
//---------------------------------------------------------------------------
});
define('aui/elements/ListItem',[ "aui/core", "aui/elements/Button" ],
function(core, Button)
{
//---------------------------------------------------------------------------
    /**
     * <b>Элемент спиока List.</b><br/>
     * @param {type} options параметры:<br/>
     * @returns {ListItem}
     * @see List
     */
    function ListItem(options)
    {
//Опции
        options = core.extend(
        {
            element : "li",
            class : null
        }, options);
        Button.call(this, options);
//Переменные
        var that = this;
//Функции
        this.index = function()
        {
            var element = that.getElement();
            var parent = element.parentElement;
            if (!parent) return undefined;
            for (var index = 0; index < parent.childNodes.length; index++)
            {
                if (parent.childNodes[index] === element) return index;
            }
            return undefined;
        };
//Сборка
    }
    core.proto(ListItem, Button);
//-------------------------------------------------------------------------------------------------------------------
    return ListItem;
//---------------------------------------------------------------------------
});
define('aui/elements/List',[ "aui/core", "aui/elements/ListItem" ],
function(core, ListItem)
{
//---------------------------------------------------------------------------
    /**
     * <b>Спиок.</b><br/>
     * @param {object} options параметры:<br/>
     * @returns {List}
     */
    function List(options)
    {
//Опции
        options = core.extend(
        {
            element : "ul",
            id : null,
            class : null,
            itemConstructor : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var itemConstructor = ListItem;
//Функции
        this.itemConstructor = function(constructor)
        {
            if (constructor === undefined) return itemConstructor;
            if (typeof constructor !== "function") throw new Error("constructor not function");
            if (!constructor instanceof ListItem) throw new Error("constructor not proto aUI.ListItem");
            itemConstructor = constructor;
        };
        this.add = function()
        {
            var item = core.construct(that.itemConstructor(), arguments);
            item.appendTo(that);
            return item;
        };
        this.remove = function(index)
        {
            that.item(index).remove();
        };
        this.count = function()
        {
            return that.getElement().childElementCount;
        };
        this.item = function(index)
        {
            var element = that.getElement().childNodes[index];
            if (element === undefined) return undefined; // throw new Error("index out of range " + index);
            return element.aui;
        };
        this.items = function()
        {
            var nodes = that.getElement().childNodes;
            var items = [ ];
            for (var index = 0; index < nodes.length; index++) items.push(nodes[index].aui);
            return items;
        };
        this.selected = function()
        {
            var nodes = that.getElement().childNodes;
            var items = [ ];
            for (var q = 0; q < nodes.length; q++)
            {
                var item = nodes[q].aui;
                if (!item.selected()) continue;
                items.push(item);
            }
            return items;
        };
        this.unselected = function()
        {
            var nodes = that.getElement().childNodes;
            var items = [ ];
            for (var q = 0; q < nodes.length; q++)
            {
                var item = nodes[q].aui;
                if (item.selected()) continue;
                items.push(item);
            }
            return items;
        };
        this.selectSingle = function(index)
        {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++)
            {
                var item = nodes[q].aui;
                if (index === q) item.select();
                else item.unselect();
            }
        };
        this.selectAll = function()
        {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.select();
        };
        this.unselectAll = function()
        {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.unselect();
        };
        this.toggleSelectAll = function()
        {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.toggleSelect();
        };
//Сборка
        if (options.itemConstructor) this.itemConstructor(options.itemConstructor);
    };
    core.proto(List, core.Element);
//-------------------------------------------------------------------------------------------------------------------
    return List;
//---------------------------------------------------------------------------
});
define('aui/elements/Field',[ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    function Field(options)
    {
//Опции
        options = core.extend(
        {
            class : "field",
            caption : null
        }, options);
        core.Element.call(this, options);
//Переменные
//    var that = this;
//Функции
//Сборка
//        this.caption = new core.Element({ class : "caption" }).appendTo(this);
        var caption = new core.Element({ class : "caption" }).appendTo(this);
        var value = new core.Element({ class : "value" }).appendTo(this);
        Object.defineProperty(this, "caption",
        {
            get : function()
            {
                return caption;
            }
        });
        Object.defineProperty(this, "value",
        {
            get : function()
            {
                return value;
            }
        });
        if (options.caption) caption.text(options.caption);

    }
    core.proto(Field, core.Element);
//---------------------------------------------------------------------------



    return Field;
//---------------------------------------------------------------------------
});
define('aui/elements/Popup',[ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    function Popup(options)
    {
//Опции
        options = core.extend(
        {
            class : "popup",
            onremove : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var isClicked = true; //false;
        var ovner = null;
        var appendTo = this.appendTo;
        var remove = this.remove;
        var e = this.getElement();
//Функции
        function onDocumentWheelOrResize(event)
        {
            that.remove();
        }
//    function onDocumentMouseDown(event)
//    {
//        if (!isClicked) that.remove();
//        isClicked = false;
//    }
        function onDocumentClick(event)
        {
//        console.log("doc clk");
            if (!isClicked) that.remove();
            isClicked = false;
        }
        function show()
        {
            updatePosition();
//        core.addEvent(document, "mousedown", onDocumentMouseDown);
            core.addEvent(document, "click", onDocumentClick);
            core.addEvent(document, "wheel", onDocumentWheelOrResize);
            core.addEvent(document, "resize", onDocumentWheelOrResize);
            e.style.display = "";
        }
        function updatePosition()
        {
            if (!ovner) return;
            var rectOvner = ovner.getBoundingClientRect();
            var rectBody = document.body.getBoundingClientRect();
            e.style.top = (rectOvner.bottom - rectBody.top) + "px";
            e.style.left = (rectOvner.left - rectBody.left) + "px";
        }
        this.appendTo = function(parent)
        {
            ovner = core.getElement(parent);
            show();
            return that;
        };
        this.remove = function()
        {
            if (options.onremove) if (options.onremove() === false) return;
//        core.removeEvent(document, "mousedown", onDocumentMouseDown);
            core.removeEvent(document, "click", onDocumentClick);
            core.removeEvent(document, "wheel", onDocumentWheelOrResize);
            core.removeEvent(document, "resize", onDocumentWheelOrResize);
            remove();
        };
//    function onMouseDown(event)
//    {
//        isClicked = true;
//    }
        function onClick(event)
        {
//        console.log("clk");
            isClicked = true;
            event.preventDefault();
        }
        this.onRemove = function(fn)
        {
            if (fn === undefined) return options.onremove;
            if (typeof fn !== "function") throw new Error("fn for onRemove not a function");
            options.onremove = fn;
        };
//Сборка
//    e.onmousedown = onMouseDown;
        e.onclick = onClick;
        e.style.display = "none";
        e.style.position = "absolute";
        e.style.zIndex = "100";
        e.style.top = "0px";
        e.style.left = "0px";
//    var body = document.getElementsByTagName("body").item(0);
//    this.appendTo(body);
        appendTo(document.body);
    }
    core.proto(Popup, core.Element);
//---------------------------------------------------------------------------
    return Popup;
//---------------------------------------------------------------------------
});
define('aui/elements/ScrollArea',[ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    /**
     * <b>Область прокрутки.</b><br/>
     * Методы horizontalScrollBar и verticalScrollBar управляют видимостью полос прокрутки.<br/>
     * вырианты:<br/>
     * - auto : показывать при необходимости.<br/>
     * - show : показывать всегда,<br/>
     * - hide : скрывать всегда,<br/>
     * События onScroll и onResize.<br/>
     * @param {object} options настройки:<br/>
     * - <b>height:</b> {number} высота<br/>
     * - <b>width:</b> {number} ширина<br/>
     * - <b>horizontal:</b> {string} горизонтальная полоса прокрутки. варианты: "auto", "show", "hide"<br/>
     * - <b>vertical:</b> {string} вертикальная полоса прокрутки. варианты: "auto", "show", "hide"<br/>
     * @returns {ScrollArea}
     */
    function ScrollArea(options)
    {
//Опции по умолчанию
        options = core.extend(
        {
            height : null,
            width : null,
            horizontal : "auto",
            vertical : "auto"
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
//Функции
        this.onScroll = function(fn)
        {
            that.getElement().onscroll = fn;
        };
//    this.onResize = function(fn)
//    {
//        that.getElement().onresize = fn;
//    };
        this.horizontalScrollBar = function(type)
        {
            var x = that.getElement().style.overflowX;
            switch (type)
            {
                case "auto":
                    x = "auto";
                    break;
                case "scroll":
                    x = "scroll";
                    break;
                case "hidden":
                    x = "hidden";
                    break;
                case "show":
                    x = "scroll";
                    break;
                case "hide":
                    x = "hidden";
                    break;
                default:
                    throw new Error("Unknow horizontal type " + type);
            }
            that.getElement().style.overflowX = x;
        };
        this.verticalScrollBar = function(type)
        {
            var y = that.getElement().style.overflowY;
            switch (type)
            {
                case "auto":
                    y = "auto";
                    break;
                case "scroll":
                    y = "scroll";
                    break;
                case "hidden":
                    y = "hidden";
                    break;
                case "show":
                    y = "scroll";
                    break;
                case "hide":
                    y = "hidden";
                    break;
                default:
                    throw new Error("Unknow vertical type " + type);
            }
            that.getElement().style.overflowY = y;
        };
//Сборка
        this.getElement().style.overflow = "auto";
        this.horizontalScrollBar(options.horizontal);
        this.verticalScrollBar(options.vertical);
        this.height(options.height);
        this.width(options.width);
    }
    core.proto(ScrollArea, core.Element);
//---------------------------------------------------------------------------
    return ScrollArea;
//---------------------------------------------------------------------------
});
define('aui/elements/ScrollList',[ "aui/core", "aui/elements/List", "aui/elements/ScrollArea" ],
function(core, List, ScrollArea)
{
//---------------------------------------------------------------------------
    /**
     * <b>Список в области прокрутки.</b><br/>
     * @param {object} options
     * @returns {ScrollList}
     */
    function ScrollList(options)
    {
//Опции по умолчанию
        options = core.extend(
        {
            listOptions : { }
        }, options);
        ScrollArea.call(this, options);
//Переменные
        var that = this;
        var changeTop = null;
        var currentTopIndex = null;
        var onScroll = null;
//Функции
        this.list = function()
        {
            return list;
        };
        function scroll()
        {
            var topIndex = that.topIndex();
            if (currentTopIndex !== topIndex)
            {
                currentTopIndex = topIndex;
                if (changeTop) changeTop.call(list.item(currentTopIndex));
            }
            if (onScroll) onScroll();
        }
        this.onChangeTop = function(fn)
        {
            if (typeof fn !== "function") throw new Error("fn is not a function");
            changeTop = fn;
        };
        this.topIndex = function(value)
        {
            var list = that.list();
            var nodes = list.getElement().childNodes;
            var count = list.count();
            if (value === undefined)
            {
                var offsetTop = that.getElement().scrollTop + list.getElement().offsetTop;
                var topIndex = 0;
                for (var index = 0; index < count; index++)
                {
                    if (offsetTop < nodes[index].offsetTop) break;
                    topIndex = index;
                }
                return topIndex;
            }
            else
            {
                if (isNaN(value)) throw new Error("value is not a number");
                if (value < 0 || count <= value) throw new Error("value " + value + " out of range 0 - " + (count - 1));
                that.getElement().scrollTop = nodes[value].offsetTop - list.getElement().offsetTop;
            }
        };
//Сборка
        var list = new List(options.listOptions).appendTo(this);
        this.onScroll(scroll);
        this.onScroll = function(fn)
        {
            onScroll = fn;
        };
    }
    core.proto(ScrollList, ScrollArea);
//---------------------------------------------------------------------------
    return ScrollList;
//---------------------------------------------------------------------------
});
define('aui/elements/SItem',[ "aui/core", "aui/elements/ListItem" ],
function(core, ListItem)
{
//---------------------------------------------------------------------------
    function SItem(options)
    {
//Опции
        options = core.extend(
        {
        }, options);
        ListItem.call(this, options);
//Переменные
        var that = this;
//Функции
        this.caption = function()
        {
            return caption;
        };
        this.content = function()
        {
            return content;
        };
//Сборка
        var caption = new core.Element({ class : "caption" }).appendTo(this);
        var content = new core.Element({ class : "content" }).appendTo(this);
    };
    core.proto(SItem, ListItem);
//---------------------------------------------------------------------------
    return SItem;
//---------------------------------------------------------------------------
});
define('aui/elements/SList',[ "aui/core", "aui/elements/List", "aui/elements/ScrollList", "aui/elements/SItem" ],
function(core, List, ScrollList, SItem)
{
//---------------------------------------------------------------------------
    function SList(options)
    {
//Опции
        options = core.extend(
        {
            class : "slist",
            onchangeselected : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
//Функции
        this.add = function(params)
        {
            menu.add({ text : params.text, onclick : menuClick });
            if (menu.count() === 1) menu.selectSingle(0);
            var item = list.add(); //{ text : params.text }
            item.caption().text(params.text);
            return item;
        };
        this.select = function(index)
        {
            if (scrollList.topIndex() === Number(index)) return;
            scrollList.topIndex(index);
        };
        this.onChangeSelected = function(fn)
        {
            if (fn === undefined) return options.onchangeselected;
            if (typeof fn !== "function") throw new Error("fn for onChangeSelected not a function");
            options.onchangeselected = fn;
        };
        function menuClick()
        {
            that.select(this.index());
        }
        function changeTop()
        {
            var index = this.index();
            menu.selectSingle(index);
            if (options.onchangeselected) options.onchangeselected.call(that, index);
        }
        this.selected = function()
        {
            return scrollList.topIndex();
        };
//Сборка
        var menu = new List({ class : "menu" }).appendTo(this);
        var scrollList = new ScrollList({ class : "scrollarea", listOptions : { itemConstructor : SItem } }).appendTo(this);
        scrollList.onChangeTop(changeTop);
        var list = scrollList.list();
    };
    core.proto(SList, core.Element);
//---------------------------------------------------------------------------
   return SList;
//---------------------------------------------------------------------------
});
define('aui/elements/Calendar',[ "aui/core", "aui/elements/Button" ],
function(core, Button)
{
//---------------------------------------------------------------------------
    var fn = { };
    /**
     * Количество дней в месяце.<br/>
     * @param {Number} year год.
     * @param {Number} month индекс месяца [0-11]. то, что возвращает Date.getMonth().
     * @returns {Number}
     */
    fn.countDayInMonth = function(year, month)
    {
        return (new Date(year, month + 1, 0)).getDate();
    };
//---------------------------------------------------------------------------
    /**
     * Возвращается день ближайший к указанному day в пределах месяца month относящегося к году year.
     * то есть если значение деня больше чем может быть в казанном месяце, 
     * то день уменьшается до максимально возможного.
     * @param {Number} year year год.
     * @param {Number} month индекс месяца [0-11]. то, что возвращает Date.getMonth().
     * @param {Number} day день. то, что возвращает Date.getDate().
     * @returns {Number}
     */
    fn.trimDay = function(year, month, day)
    {
        if (day < 1) return 1;
        while (day > fn.countDayInMonth(year, month)) day--;
        return day;
    };
//---------------------------------------------------------------------------
    /**
     * Смещение дня.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    fn.shiftDay = function(date, shift)
    {
        var day = date.getDate() + shift;
        var month = date.getMonth();
        var year = date.getFullYear();
        return new Date(year, month, day);
    };
//---------------------------------------------------------------------------
    /**
     * Смещение месяца.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    fn.shiftMonth = function(date, shift)
    {
        var day = date.getDate();
        var month = date.getMonth() + shift;
        var year = date.getFullYear();
        while (month < 0)
        {
            month += 12;
            year--;
        }
        while (month > 11)
        {
            month -= 12;
            year++;
        }
        return new Date(year, month, fn.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    /**
     * Смещение года.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    fn.shiftYear = function(date, shift)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() + shift;
        return new Date(year, month, fn.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    fn.getShortNameDayOfWeekRu = function(index)
    {
        var array = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
        return array[index];
    };
    fn.getShortNameDayOfWeek = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    fn.getFullNameDayOfWeekRu = function(index)
    {
        var array = [ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
        return array[index];
    };
    fn.getShortNameMonth = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    fn.getNumberMonth = function(index)
    {
        var array = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
        return array[index];
    };
    fn.getShortNameMonth = function(index)
    {
        var array = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
        return array[index];
    };
    fn.getShortNameMonthRu = function(index)
    {
        var array = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
        return array[index];
    };
    fn.getFullNameMonthRu = function(index)
    {
        var array = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
        return array[index];
    };
//---------------------------------------------------------------------------
    /**
     * <b>Календарь.</b><br/>
     * @param {object} options параметры:<br/>
     * - <b>class:</b> по умолчанию имеет значение "calendar".<br/>
     * - <b>onchange:</b> функция, вызываемая в момент выбора даты.<br/>
     * - <b>date:</b> по умолчанию имеет значение текущей даты.<br/>
     * @returns {Calendar}
     */
    function Calendar(options)
    {
//Опции по умолчанию
        options = core.extend(
        {
            class : "calendar",
            onclickday : null,
            onclickmonth : null,
            onclickyear : null,
            onchange : null,
            date : new Date()
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var mode = "days";
//Функции
        function update()
        {
            if (mode === "days") showDays(options.date);
            if (mode === "months") showMonths(options.date);
            if (mode === "years") showYears(options.date);
        }
        this.value = function(date)
        {
            if (date === undefined) return options.date;
            if (!date instanceof Date) throw new Error("value is not instance of Date");
            if (options.date === date) return;
            options.date = date;
            update();
            if (options.onchange) options.onchange.call(that);
        };
        function clickMonthsMode()
        {
            mode = "months";
            update();
        }
        function clickYearsMode()
        {
            mode = "years";
            update();
        }
        function clickPrev()
        {
            that.value(this.data);
        }
        function clickNext()
        {
            that.value(this.data);
        }
        function clickDay()
        {
            that.value(this.data);
//        
            if (options.onclickday) options.onclickday.call(that);
        }
        function clickMonth()
        {
            mode = "days";
            that.value(this.data);
        }
        function clickYear()
        {
            mode = "months";
            that.value(this.data);
        }
        this.onClickDay = function(fn)
        {
            options.onclickday = fn;
        };
        this.onClickMonth = function(fn)
        {
            options.onclickmonth = fn;
        };
        this.onClickYear = function(fn)
        {
            options.onclickyear = fn;
        };
        this.onChange = function(fn)
        {
            options.onchange = fn;
        };
        function showDays(date)
        {
            that.clear();
            var dayTableData = that.getDayTableData(date);
            new Button({ class : "prev", text : "<", data : dayTableData.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level days", text : dayTableData.caption, onclick : clickMonthsMode }).appendTo(that);
            new Button({ class : "prev", text : ">", data : dayTableData.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "days" });
            var th = new core.Element({ element : "tr" });
            for (var d = 0; d < 7; d++)
            {
                var item = dayTableData.head[d];
                var td = new core.Element({ element : "th", class : item.class, text : item.text });
                td.appendTo(th);
            }
            th.appendTo(table);
            for (var w = 0; w < 6; w++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var d = 0; d < 7; d++)
                {
                    var item = dayTableData.array[(w * 7) + d];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickDay);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showMonths(date)
        {
            that.clear();
            var data = that.getMonthTableData(date);
            new Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level months", text : data.caption, onclick : clickYearsMode }).appendTo(that);
            new Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "months" });
            for (var h = 0; h < 3; h++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var w = 0; w < 4; w++)
                {
                    var item = data.array[(h * 4) + w];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickMonth);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showYears(date)
        {
            that.clear();
            var data = that.getYearTableData(date);
            new Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level years", text : data.caption }).appendTo(that);
            new Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "months" });
            for (var h = 0; h < 3; h++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var w = 0; w < 4; w++)
                {
                    var item = data.array[(h * 4) + w];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickYear);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
//Сборка
        if (!options.date instanceof Date) throw new Error("value is not instance of Date");
        update();
    }
    core.proto(Calendar, core.Element);
//---------------------------------------------------------------------------
    Calendar.prototype.getDayTableData = function(date)
    {
        function getFirsInMonthDayOfWeek(year, month)
        {
            return (new Date(year, month, 1)).getDay();
        }

        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.caption = fn.getFullNameMonthRu(data.month) + " " + data.year;
        data.prev = fn.shiftMonth(data.date, -1);
        data.next = fn.shiftMonth(data.date, +1);
        var countDayInPrevMonth = fn.countDayInMonth(data.prev.getFullYear(), data.prev.getMonth());
        var countDayInMonth = fn.countDayInMonth(data.year, data.month);
        var firstInMonthDayOfWeek = getFirsInMonthDayOfWeek(data.year, data.month);
        var prevCount = firstInMonthDayOfWeek - 1;
        if (prevCount < 0) prevCount = 6;
        var prevDIndex = countDayInPrevMonth - prevCount;
        var nextCount = 42 - prevCount - countDayInMonth;
        data.head = [ ];
        for (var q = 0; q < 7; q++)
        {
            var item = { }
            var dayOfWeekCounter = q + 1;
            if (q === 6) dayOfWeekCounter = 0;
            item.text = fn.getShortNameDayOfWeekRu(dayOfWeekCounter);
            item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter);
            data.head.push(item);
        }

        data.array = [ ];
        for (var q = 0; q < prevCount; q++) data.array.push({ date : new Date(data.prev.getFullYear(), data.prev.getMonth(), q + prevDIndex + 1), state : "prev" });
        for (var q = 0; q < countDayInMonth; q++) data.array.push({ date : new Date(data.year, data.month, q + 1) });
        for (var q = 0; q < nextCount; q++) data.array.push({ date : new Date(data.next.getFullYear(), data.next.getMonth(), q + 1), state : "next" });
        var now = new Date();
        var dayOfWeekCounter = 1;
        for (var q = 0; q < data.array.length; q++)
        {
            var item = data.array[q];
            item.text = item.date.getDate();
            item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter);
            if ((item.date.getDate() === now.getDate()) && (item.date.getMonth() === now.getMonth()) && (item.date.getFullYear() === now.getFullYear())) item.current = true;
            if ((item.date.getDate() === data.day) && (item.date.getMonth() === data.month) && (item.date.getFullYear() === data.year)) item.selected = true;
            dayOfWeekCounter++;
            if (dayOfWeekCounter === 7) dayOfWeekCounter = 0;
        }
        return data;
    };
//---------------------------------------------------------------------------
    Calendar.prototype.getMonthTableData = function(date)
    {
        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.caption = data.year;
        data.prev = fn.shiftYear(data.date, -1);
        data.next = fn.shiftYear(data.date, +1);
        data.array = [ ];
        var now = new Date();
        var monthCounter = 0;
        for (var q = 0; q < 12; q++)
        {
            var item = { };
            item.date = new Date(data.year, monthCounter, fn.trimDay(data.year, q, data.day));
            item.text = fn.getShortNameMonthRu(monthCounter);
            item.class = fn.getShortNameMonth(monthCounter);
            if ((monthCounter === now.getMonth()) && (data.year === now.getFullYear())) item.current = true;
            if ((monthCounter === data.month)) item.selected = true;
            data.array.push(item);
            monthCounter++;
        }
        return data;
    };
//---------------------------------------------------------------------------
    Calendar.prototype.getYearTableData = function(date)
    {
        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.startDec = data.year - (data.year % 10);
        data.endDec = data.startDec + 9;
        data.caption = data.startDec + " - " + data.endDec;
        data.prev = fn.shiftYear(data.date, -10);
        data.next = fn.shiftYear(data.date, +10);
        data.array = [ ];
        var now = new Date();
        var yearCounter = data.startDec - 1;
        for (var q = 0; q < 12; q++)
        {
            var item = { };
            item.date = new Date(yearCounter, data.month, fn.trimDay(data.year, q, data.day));
            item.text = yearCounter;
            item.class = yearCounter;
            if ((yearCounter === now.getFullYear())) item.current = true;
            if ((yearCounter === data.year)) item.selected = true;
            if (q === 0) item.state = "prev";
            if (q === 11) item.state = "next";
            data.array.push(item);
            yearCounter++;
        }
        return data;
    };
//---------------------------------------------------------------------------
    return Calendar;
//---------------------------------------------------------------------------
});


define('aui/elements/DateSelector',[ "aui/core", "aui/aUtils", "aui/validator",
    "aui/elements/Button",
    "aui/elements/Edit",
    "aui/elements/Popup",
    "aui/elements/Calendar" ],
function(core, aUtils, validator,
Button,
Edit,
Popup,
Calendar)
{
//---------------------------------------------------------------------------
    function DateSelector(options)
    {
//Опции
        options = core.extend(
        {
            class : "dateSelector",
            mask : "dd.MM.yyyy",
            validator : new validator.Pattern("((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).[0-9]{4})")
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
//Функции
        function click()
        {
            var btn = this;
            if (btn.selected())
            {
                btn.unselect();
                return;
            }
            function select()
            {
                edit.value(aUtils.dateToStr(this.value(), options.mask));
                popup.remove();
            }
            var popup = new Popup().appendTo(that);
            popup.onRemove(btn.unselect);
            var calendar = new Calendar();
            calendar.value(aUtils.strToDate(edit.value(), options.mask));
            calendar.onClickDay(select);
            calendar.appendTo(popup);
            btn.select();
        }
//Сборка
        var edit = new Edit({ required : true }).appendTo(this);
        edit.validator(options.validator);
        edit.value(aUtils.dateToStr(new Date(), options.mask));
        var btn = new Button({ text : "...", onclick : click }).appendTo(this);
//    var btn = new aUI.Button({ onclick : click }).appendTo(this);

        this.value = edit.value;
        this.invalid = edit.invalid;
    }
    core.proto(DateSelector, core.Element);
//---------------------------------------------------------------------------
    return DateSelector;
//---------------------------------------------------------------------------
});
define('aui/elements/Progress',[ "aui/core", "aui/aUtils" ],
function(core, aUtils)
{
//---------------------------------------------------------------------------
    function Progress(options)
    {
//Опции
        options = core.extend(
        {
            class : "progress",
            orientation : "horizontal",
            value : 0,
            min : 0,
            max : 99,
            round : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var isHorizontal = true;
//Функции
        function update()
        {
            var min = 0;
            var max = 0;
            if (isHorizontal) max = e.clientWidth;
            else max = e.clientHeight;
            var value = aUtils.convertRangedValue(options.value, options.min, options.max, min, max);
            if (isHorizontal) p.style.width = value + "px";
            else p.style.height = value + "px";
        }
        this.value = function(value)
        {
            if (value === undefined) return options.value;
            options.value = aUtils.trimByRange(value, options.min, options.max);
            update();
        };
        this.round = function(fn)
        {
            if (fn === undefined) return options.round;
            if (typeof fn !== "function") throw new Error("fn for round not a function");
            options.round = fn;
        };
//Сборка
        isHorizontal = options.orientation !== "vertical";
        var progress = new core.Element({ class : "value" }).appendTo(this);
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
//    progress.width("100%");
//    progress.height("100%");
        var e = this.getElement();
        var p = progress.getElement();
        e.style.position = "relative";
        p.style.position = "absolute";
        p.style.width = "100%";
        p.style.height = "100%";
        p.style.left = "0px";
        p.style.bottom = "0px";
        update();
    };
    core.proto(Progress, core.Element);
//---------------------------------------------------------------------------
    return Progress;
//---------------------------------------------------------------------------
});

define('aui/elements/Scale',[ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    function Scale(options)
    {
//Опции
        options = core.extend(
        {
            class : "scale",
            begin : 0,
            end : 10,
            count : 10,
            each : 5
        }, options);
//    options.element = "canvas";
        core.Element.call(this, options);
//Переменные
        var that = this;
        var count = options.count; //options.end - options.begin;
        var each = options.each;
        var labels = [ ];
//Функции

        function updateLabels()
        {
            for (var index in labels) labels[index].remove();
            labels = [ ];
            for (var q = 0; q <= count; q++)
            {
                if (q % each !== 0) continue;
                var label = new core.Element({ class : "val", text : q }).appendTo(that);
                label.getElement().style.position = "absolute";
                labels.push(label);
            }
        }
        function update()
        {
            draw(count, each);
        }
        function draw(count, each)
        {
            var computedStyle = window.getComputedStyle(that.getElement());
//        console.log("computedStyle", computedStyle);
            var rect = core.rectPadding(that);
//        console.log("rect", rect);
            var indent = { };
            indent.left = 0;
            indent.right = 0;
            indent.top = 0;
            indent.bottom = 0;
            var ce = canvas.getElement();
            ce.width = rect.right - rect.left;
            ce.height = rect.bottom - rect.top;
            var ctx = ce.getContext("2d");
            ctx.clearRect(0, 0, ce.width, ce.height); //Очистка области
            ctx.strokeStyle = computedStyle.color;
            var h2 = Math.ceil(ce.height / 2);
            var d = ((ce.width - indent.left - indent.right) - 1) / count;
            var b = ce.height;
            var index = 0;
            for (var q = 0; q <= count; q++)
            {
                var h = h2;
                var l = Math.ceil((d * q) + indent.left);
                if (q % each === 0)
                {
                    h = 0;
                    var text = String(q);
                    var label = labels[index];
                    var wt = label.width();
                    label.top(b);
                    label.left(rect.left + Math.ceil(l - (wt / 2)));
//                var wt = ctx.measureText(text).width;
//                ctx.fillText(text, Math.ceil(l - (wt / 2)), b);
                    index++;
                }
                ctx.moveTo(l + 0.5, h + 0.5);
                ctx.lineTo(l + 0.5, b - 0.5);
                ctx.stroke();
            }

//        ctx.moveTo(rect.left + 0.5, rect.top + 0.5);
//        ctx.lineTo(rect.left + 0.5, rect.bottom - 0.5);

//        ctx.moveTo(0 + 0.5, 0 + 0.5);
//        ctx.lineTo(0 + 0.5, element.height - 0.5);
//        ctx.stroke();

//        ctx.moveTo(rect.right - 0.5, rect.top + 0.5);
//        ctx.lineTo(rect.right - 0.5, rect.bottom - 0.5);

//        ctx.moveTo(element.width - 0.5, 0 + 0.5);
//        ctx.lineTo(element.width - 0.5, element.height - 0.5);
//        ctx.stroke();
        }
//Сборка
        this.getElement().style.position = "relative";
//    this.getElement().style.zIndex = "200";
//    var element = this.getElement();

        var canvas = new core.Element({ element : "canvas" }).appendTo(this);
        this.onResize(update);
        this.getElement().onclick = update;
        updateLabels();
    }
    core.proto(Scale, core.Element);
//---------------------------------------------------------------------------
    return Scale;
//---------------------------------------------------------------------------
});
define('aui/elements/Scroll',[ "aui/core", "aui/aUtils" ],
function(core, aUtils)
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
            var value = aUtils.convertRangedValue(options.value, options.min, options.max, min, max);
            value = Math.round(value);
            d.style.left = value + "px";
            if (typeof options.onchange === "function") options.onchange.call(that, options.value);
        }
        function updateVertical()
        {
            var min = 0;
            var max = e.clientHeight - size;
            d.style.height = size + "px";
            var value = aUtils.convertRangedValue(options.value, options.min, options.max, min, max);
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
            pos = aUtils.trimByRange(pos, min, max);
            that.value(aUtils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onMoveVertical(event)
        {
            var min = 0;
            var max = e.clientHeight - size;
            var pos = event.clientY - progressRect.top - dragOffset;
            pos = aUtils.trimByRange(pos, min, max);
            that.value(aUtils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onDragStart()
        {
            return false;
        }
        this.value = function(value)
        {
            if (value === undefined) return options.value;
            if (options.round) value = options.round(value);
            value = aUtils.trimByRange(value, options.min, options.max);
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
define('aui/elements/Slider',[ "aui/core", "aui/aUtils", "aui/extension" ],
function(core, aUtils, extension)
{
//---------------------------------------------------------------------------
    function Slider(options)
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
        var value = new aUtils.NumInRange(options.value, options.min, options.max);
        var pos = new aUtils.NumInRange(0, 0, 0);
        value.onChange(changeValue);
        pos.onChange(changePos);
        var lastPos = null;
//Функции
        function onResize(event)
        {
            if (isHorizontal) pos.max(that.clientWidth() - drag.width());
            else pos.max(that.clientHeight() - drag.height());
//console.log("W", that.clientWidth(), "w", drag.width());
        }
        function onMoveStart(event)
        {
            if (isHorizontal) lastPos = drag.left();
            else lastPos = drag.top();
            that.addClass("move");
        }
        function onMoveEnd(event)
        {
            that.removeClass("move");
        }
        function onMove(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.value(aUtils.convertRangedValue(p, pos.min(), pos.max(), value.min(), value.max()));
        }
        function  changeValue(val)
        {
            pos.value(aUtils.convertRangedValue(value.value(), value.min(), value.max(), pos.min(), pos.max()));
            if (options.onchange) options.onchange.call(that, val);
        }
        function  changePos(val)
        {
            if (isHorizontal) drag.left(val);
            else drag.top(val);
        }
        this.value = function(val)
        {
//round val
            value.value(Math.ceil(val));
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
//    core.addEvent(this.getElement(), "resize", onResize);
//    var drag = new aUI.Movable({ class : "drag" }).appendTo(this);
        var drag = new core.Element({ class : "drag" }).appendTo(this);
        extension.movable(drag);
        drag.getElement().style.position = "absolute";
//    drag.getElement().style.zIndex = "100";

        drag.refreshOffsetOnMove(false);
        drag.onMove(onMove);
        drag.onMoveStart(onMoveStart);
        drag.onMoveEnd(onMoveEnd);
        drag.onResize(onResize);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal)
        {
            this.addClass("horisontal");
            drag.width("30px");
            drag.height("100%");
        }
        else
        {
            this.addClass("vertical");
            drag.width("100%");
            drag.height("30px");
        }
    };
    core.proto(Slider, core.Element);
//---------------------------------------------------------------------------
return Slider;

//---------------------------------------------------------------------------
});
define('aui/elements/Range',[ "aui/core", "aui/aUtils", "aui/extension" ],
function(core, aUtils, extension)
{
//---------------------------------------------------------------------------
    function Range(options)
    {
//Опции
        options = core.extend(
        {
            orientation : "horizontal",
            valueMin : 0,
            valueMax : 0,
            min : 0,
            max : 99,
            blocked : false,
            class : "range",
            round : null,
            onchange : null
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var valueMin = new aUtils.NumInRange(options.valueMin, options.min, options.max);
        var valueMax = new aUtils.NumInRange(options.valueMax, options.min, options.max);
        valueMin.onChange(changeValueMin);
        valueMax.onChange(changeValueMax);
        var posMin = new aUtils.NumInRange(0, 0, 0);
        var posMax = new aUtils.NumInRange(0, 0, 0);
        posMin.onChange(changePosMin);
        posMax.onChange(changePosMax);
        var lastPos = null;
        var roundDigits = 0;
        var fractionDigits = null;
//Функции
        function onResize(event)
        {
            var rect = core.rectPadding(that);
            if (isHorizontal)
            {
                posMin.min(rect.left);
                posMin.max(rect.right - dragMin.width());
                posMax.min(rect.left);
                posMax.max(rect.right - dragMax.width());
            }
            else
            {
                posMin.min(rect.top);
                posMin.max(rect.bottom - dragMin.height());
                posMax.min(rect.top);
                posMax.max(rect.bottom - dragMax.height());
            }
        }
        function onMoveStart(event)
        {
//onResize();
            if (isHorizontal) lastPos = this.left();
            else lastPos = this.top();
            that.addClass("move");
            this.addClass("move");
        }
        function onMoveEnd(event)
        {
            that.removeClass("move");
            this.removeClass("move");
        }
        function onMoveMin(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.valueMin(aUtils.convertRangedValue(p, posMin.min(), posMin.max(), valueMin.min(), valueMin.max()));
        }
        function onMoveMax(event, dX, dY)
        {
            var p = lastPos;
            if (isHorizontal) p += dX;
            else p += dY;
            that.valueMax(aUtils.convertRangedValue(p, posMax.min(), posMax.max(), valueMax.min(), valueMax.max()));
        }
        function  changeValueMin(val)
        {
            if (options.blocked)
            {
                if (valueMax.value() < valueMin.value()) valueMin.value(valueMax.value());
            }
            else if (valueMin.value() > valueMax.value()) valueMax.value(valueMin.value());
            posMin.value(aUtils.convertRangedValue(valueMin.value(), valueMin.min(), valueMin.max(), posMin.min(), posMin.max()));
            if (fractionDigits === null) dragMinValue.text(valueMin.value());
            else dragMinValue.text(valueMin.value().toFixed(fractionDigits));
            if (options.onchange) options.onchange.call(that);
        }
        function  changeValueMax(val)
        {
            if (options.blocked)
            {
                if (valueMin.value() > valueMax.value()) valueMax.value(valueMin.value());
            }
            else if (valueMax.value() < valueMin.value()) valueMin.value(valueMax.value());
            posMax.value(aUtils.convertRangedValue(valueMax.value(), valueMax.min(), valueMax.max(), posMax.min(), posMax.max()));
            if (fractionDigits === null) dragMaxValue.text(valueMax.value());
            else dragMaxValue.text(valueMax.value().toFixed(fractionDigits));
            if (options.onchange) options.onchange.call(that);
        }
        function  changePosMin(val)
        {
            if (isHorizontal) dragMin.left(val);
            else dragMin.top(val);
            updateLine();
        }
        function  changePosMax(val)
        {
            if (isHorizontal) dragMax.left(val);
            else dragMax.top(val);
            updateLine();
        }
        function updateLine()
        {
            if (isHorizontal)
            {
                line.left(posMin.min() + posMin.value());
                line.width(posMax.value() - posMin.value());
            }
            else
            {
                line.top(posMin.min() + posMin.value());
                line.height(posMax.value() - posMin.value());
            }
        }
        this.valueMin = function(val)
        {
            if (options.round) val = options.round(val);
            valueMin.value(val);
        };
        this.valueMax = function(val)
        {
            if (options.round) val = options.round(val);
            valueMax.value(val);
        };
        this.round = function(fn)
        {
            if (fn === undefined) return options.round;
            if (fn === null)
            {
                options.round = null;
                return;
            }
            if (typeof fn === "number")
            {
                if (fn === 0) roundDigits = 0;
                else roundDigits = 1 / fn;
                fractionDigits = Math.round(roundDigits / 10);
//            console.log(fractionDigits);
                options.round = roundValue;
                return;
            }
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.round = fn;
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return options.onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        };
        roundValue = function(value)
        {
            if (roundDigits === 0) return Math.round(value);
            return Math.round(value * roundDigits) / roundDigits;
        };
//Сборка
        this.getElement().style.position = "relative";
        this.onResize(onResize);
        var line = new core.Element({ class : "line" }).appendTo(this);
        line.getElement().style.position = "absolute";
        var dragMin = new core.Element({ class : "drag min" }).appendTo(this);
        extension.movable(dragMin);
//    var dragMin = new aUI.Movable({ class : "drag min" }).appendTo(this);
        dragMin.getElement().style.position = "absolute";
        dragMin.refreshOffsetOnMove(false);
        dragMin.onMove(onMoveMin);
        dragMin.onMoveStart(onMoveStart);
        dragMin.onMoveEnd(onMoveEnd);
        dragMin.onResize(onResize);
        var dragMinValue = new core.Element({ class : "value" }).appendTo(dragMin);
        var dragMax = new core.Element({ class : "drag max" }).appendTo(this);
        extension.movable(dragMax);
//    var dragMax = new aUI.Movable({ class : "drag max" }).appendTo(this);
        dragMax.getElement().style.position = "absolute";
        dragMax.refreshOffsetOnMove(false);
        dragMax.onMove(onMoveMax);
        dragMax.onMoveStart(onMoveStart);
        dragMax.onMoveEnd(onMoveEnd);
        dragMax.onResize(onResize);
        var dragMaxValue = new core.Element({ class : "value" }).appendTo(dragMax);
        var isHorizontal = options.orientation !== "vertical";
        if (isHorizontal) this.addClass("horisontal");
        else this.addClass("vertical");
        updateLine();
    }
    core.proto(Range, core.Element);
//---------------------------------------------------------------------------
    return Range;
//---------------------------------------------------------------------------
});
define('aui/elements/Movable',[ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    function Movable(options)
    {
//Опции
        options = core.extend(
        {
            onmove : undefined,
            onmovestart : undefined,
            onmoveend : undefined
        }, options);
        core.Element.call(this, options);
        extension.movable(this);
//Переменные
        var that = this;
//Функции

//Сборка
        this.getElement().style.position = "absolute";
//    this.getElement().style.zIndex = "100";
//    e.style.top = "0px";
//    e.style.left = "0px";
        this.onMove(options.onmove);
        this.onMoveStart(options.onmovestart);
        this.onMoveEnd(options.onmoveend);
    }
    core.proto(Movable, core.Element);
//---------------------------------------------------------------------------
    return Movable;
//---------------------------------------------------------------------------
});
define('aui/elements/XY',[ "aui/core", "aui/aUtils" ],
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
define('aui/aUI',[ "aui/core", "aui/validator", "aui/extension",
    //str
    "aui/elements/Link",
    "aui/elements/Button",
    "aui/elements/Check",
    "aui/elements/Edit",
    "aui/elements/Select",
    "aui/elements/Memo",
    //list
    "aui/elements/List",
    "aui/elements/ListItem",
    //area
    "aui/elements/Field",
    "aui/elements/Popup",
    "aui/elements/ScrollArea",
    "aui/elements/ScrollList",
    "aui/elements/SItem",
    "aui/elements/SList",
    //date
    "aui/elements/Calendar",
    "aui/elements/DateSelector",
    //indicator
    "aui/elements/Progress",
    "aui/elements/Scale",
    //mouse
    "aui/elements/Scroll",
    "aui/elements/Slider",
    "aui/elements/Range",
    //experemental
    "aui/elements/Movable",
    "aui/elements/XY"
],
function(core, validator, extension,
//std
Link, Button, Check, Edit, Select, Memo,
//list
List, ListItem,
//area
Field, Popup, ScrollArea, ScrollList, SItem, SList,
//date
Calendar, DateSelector,
//indicator
Progress, Scale,
//mouse
Scroll, Slider, Range,
//experemental
Movable, XY
)
{
    var aUI = { };
//------------------------------------------------------------------------------------------------------------------- 
    aUI.extend = core.extend;
    aUI.proto = core.proto;
    aUI.construct = core.construct;
    aUI.getElement = core.getElement;
    aUI.getElement = core.getElement;
//-------------------------------------------------------------------------------------------------------------------
    aUI.Element = core.Element;
//-------------------------------------------------------------------------------------------------------------------
    aUI.validator = validator;
//-------------------------------------------------------------------------------------------------------------------
    aUI.extensions = extension;
//-------------------------------------------------------------------------------------------------------------------
    //std
    aUI.Link = Link;
    aUI.Button = Button;
    aUI.Check = Check;
    aUI.Edit = Edit;
    aUI.Select = Select;
    aUI.Memo = Memo;
    //list
    aUI.List = List;
    aUI.ListItem = ListItem;
    //area
    aUI.Field = Field;
    aUI.Popup = Popup;
    aUI.ScrollArea = ScrollArea;
    aUI.ScrollList = ScrollList;
    aUI.SItem = SItem;
    aUI.SList = SList;
    //date
    aUI.Calendar = Calendar;
    aUI.DateSelector = DateSelector;
    //indicator
    aUI.Progress = Progress;
    aUI.Scale = Scale;
    //mouse
    aUI.Scroll = Scroll;
    aUI.Slider = Slider;
    aUI.Range = Range;
    //experemental
    aUI.Movable = Movable;
    aUI.XY = XY;
//-------------------------------------------------------------------------------------------------------------------
    return aUI;
//-------------------------------------------------------------------------------------------------------------------
});
