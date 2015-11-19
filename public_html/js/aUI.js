
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/create

var aUI = { };
//------------------------------------------------------------------------------------------------------------------- 
aUI.extend = function(source, target)
{
    var value = { };
    for (var index in source) value[index] = source[index];
    for (var index in target) value[index] = target[index];
    return value;
};
//-------------------------------------------------------------------------------------------------------------------
aUI.proto = function(heir, base)
{
    heir.prototype = Object.create(base.prototype);
    heir.prototype.constructor = heir;
};
//-------------------------------------------------------------------------------------------------------------------
aUI.construct = function(constructor, args)
{
    var array = [ null ];
    if (args instanceof Array) array = args;
    else for (var index in arguments) array.push(args[index]);
    return new (Function.prototype.bind.apply(constructor, array));
};
//-------------------------------------------------------------------------------------------------------------------
aUI.getElement = function(element)
{
    if (element === null) throw new Error("null is not element");
    if (element instanceof HTMLElement) return element;
    if (element instanceof aUI.Element) return element.getElement();
    if (element[0] instanceof HTMLElement) return element[0];
    console.log("getElement", element);
    throw new Error("is not HTMLElement");
};
//-------------------------------------------------------------------------------------------------------------------
aUI.validator = { };
//-------------------------------------------------------------------------------------------------------------------
/**
 * <b>Паттерн.</b><br/>
 * @param {string} value регулярное выражение<br/>
 * @returns {Pattern}
 */
aUI.validator.Pattern = function Pattern(value)
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
aUI.extensions = { };
//-------------------------------------------------------------------------------------------------------------------
aUI.extensions.selectable = function(owner)
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
aUI.extensions.clickable = function(owner)
{
    //Переменные
    var onclick = null;
    //Функции
    owner.onClick = function(fn)
    {
        if (fn === undefined) return onclick;
        if (fn === null)
        {
            onclick = null;
            return;
        }
        if (typeof fn === "function")
        {
            onclick = fn;
            return;
        }
        if (fn instanceof Array)
        {
            var isArrayFunction = true;
            for (var index in fn) if (typeof fn[index] !== "function") isArrayFunction = false;
            if (isArrayFunction)
            {
                onclick = function()
                {
                    for (var index in fn) fn[index].apply(owner, arguments);
                };
            }
        }
        throw new Error("type of onclick fn \"" + typeof fn + "\" is not a function");
    };
    //Сборка
    owner.getElement().onclick = function()
    {
        if (onclick) onclick.apply(owner, arguments);
    };
};
//-------------------------------------------------------------------------------------------------------------------
aUI.extensions.validable = function(owner)
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
    owner.getElement().onfocus = onvalidate;
    owner.getElement().onkeyup = onvalidate;
};
//-------------------------------------------------------------------------------------------------------------------
//aUI.extensions.dragable = function(owner)
//{
//https://learn.javascript.ru/drag-and-drop
//};
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
aUI.Element = function Element(options)
{
    //Опции
    options = aUI.extend(
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
        parent = aUI.getElement(parent);
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
    this.width = function(value)
    {
        if (value === undefined) return that.getElement().style.width;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        that.getElement().style.width = value;
    };
    this.height = function(value)
    {
        if (value === undefined) return that.getElement().style.height;
        if (value === null) value = "";
        if (typeof value === "number") value += "px";
        that.getElement().style.height = value;
    };
    //Сборка
    var element = document.createElement(options.element);
    element.aui = this;
    if (options.id) this.id(options.id);
    if (options.class) this.class(options.class);
    if (options.addclass) this.addClass(options.addclass);
    if (options.text || options.text === 0 || options.text === false) this.text(options.text);
    //if (options.html || options.html === 0 || options.html === false) this.html(options.html);
    if (options.width || options.width === 0) this.width(options.width);
    if (options.height || options.height === 0) this.height(options.height);
};
//-------------------------------------------------------------------------------------------------------------------
aUI.Link = function Link(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "a",
        href : "javascript:",
        onclick : null
    }, options);
    aUI.Element.call(this, options);
    aUI.extensions.clickable(this);
    //Переменные
    //Функции
    //Сборка
    if (options.href) this.attr("href", options.href);
    if (options.onclick) this.onClick(options.onclick);
};
aUI.proto(aUI.Link, aUI.Element);
//-------------------------------------------------------------------------------------------------------------------
/*
 * <b>Кнопка.<b><br/>
 * @param {object} options параметры:<br/>
 * @returns {Button}
 */
aUI.Button = function Button(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "div",
        class : "button",
        onclick : null,
        data : null
    }, options);
    aUI.Element.call(this, options);
    aUI.extensions.clickable(this);
    aUI.extensions.selectable(this);
    //Переменные
    this.data = options.data;
    //Функции
    //Сборка
    if (options.onclick) this.onClick(options.onclick);
//    this.attr("href", "javascript:;");
};
aUI.proto(aUI.Button, aUI.Element);
//-------------------------------------------------------------------------------------------------------------------
/**
 * <b>Спиок.</b><br/>
 * @param {object} options параметры:<br/>
 * @returns {List}
 */
aUI.List = function List(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "ul",
        id : null,
        class : null,
        itemConstructor : null
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    var itemConstructor = aUI.ListItem;
    //Функции
    this.itemConstructor = function(constructor)
    {
        if (constructor === undefined) return itemConstructor;
        if (typeof constructor !== "function") throw new Error("constructor not function");
        if (!constructor instanceof aUI.ListItem) throw new Error("constructor not proto aUI.ListItem");
        itemConstructor = constructor;
    };
    this.add = function()
    {
        var item = aUI.construct(that.itemConstructor(), arguments);
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
        if (element === undefined) return undefined;// throw new Error("index out of range " + index);
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
aUI.proto(aUI.List, aUI.Element);

//-------------------------------------------------------------------------------------------------------------------
/**
 * <b>Элемент спиока List.</b><br/>
 * @param {type} options параметры:<br/>
 * @returns {ListItem}
 * @see List
 */
aUI.ListItem = function ListItem(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "li",
        class : null
    }, options);
    aUI.Button.call(this, options);
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

};
aUI.proto(aUI.ListItem, aUI.Button);
//-------------------------------------------------------------------------------------------------------------------
/*aUI.Check = function Check(options)
 {
 //Опции по умолчанию
 options = aUI.extend(
 {
 class : "check",
 value : null
 }, options);
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
 //  //События
 //  function setKeyPress(fn) { $(input).keypress(fn); }
 //  function setChange(fn) { $(input).change(fn); }
 //  //Сборка
 //  var check = aUI.Element({ class : options.class, id : options.id });
 //  check.getValue = getValue;
 //  check.setValue = setValue;
 //  check.setFocus = setFocus;
 //  check.setKeyPress = setKeyPress;
 //  check.setChange = setChange;
 //  var input = aUI.Element({ element : "input" });
 //  $(input).attr("type", "checkbox");
 //// input.style.width="100%";
 //// input.style.height="100%";
 //  check.setValue(options.value);
 //  input.appendTo(check);
 //  //Возврат результата выполненого после сборки
 //  return check;
 };*/
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
aUI.ScrollArea = function ScrollArea(options)
{
    //Опции по умолчанию
    options = aUI.extend(
    {
        height : null,
        width : null,
        horizontal : "auto",
        vertical : "auto"
    }, options);
    aUI.Element.call(this, options);
    this.getElement().style.overflow = "auto";
    //Переменные
    //Функции
    //Сборка
    this.horizontalScrollBar(options.horizontal);
    this.verticalScrollBar(options.vertical);
    this.height(options.height);
    this.width(options.width);
};
aUI.proto(aUI.ScrollArea, aUI.Element);
aUI.ScrollArea.prototype.onScroll = function(fn)
{
    this.getElement().onscroll = fn;
};
aUI.ScrollArea.prototype.onResize = function(fn)
{
    this.getElement().onresize = fn;
};
aUI.ScrollArea.prototype.horizontalScrollBar = function(type)
{
    var x = this.getElement().style.overflowX;
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
    this.getElement().style.overflowX = x;
};
aUI.ScrollArea.prototype.verticalScrollBar = function(type)
{
    var y = this.getElement().style.overflowY;
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
    this.getElement().style.overflowY = y;
};
//---------------------------------------------------------------------------
/**
 * <b>Список в области прокрутки.</b><br/>
 * @param {object} options
 * @returns {ScrollList}
 */
aUI.ScrollList = function ScrollList(options)
{
    //Опции по умолчанию
    options = aUI.extend(
    {
        listOptions : { }
    }, options);
    aUI.ScrollArea.call(this, options);
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
    var list = new aUI.List(options.listOptions).appendTo(this);
    this.onScroll(scroll);
    this.onScroll = function(fn)
    {
        onScroll = fn;
    };

};
aUI.proto(aUI.ScrollList, aUI.ScrollArea);
//---------------------------------------------------------------------------
/**
 * <b>Строковое поле редактирования.</b><br/>
 * @param {object} options параметры:<br/>
 * - <b>element:</b> название элемента "input".<br/>
 * - <b>pattern:</b> регулярное выражение.<br/>
 * - <b>required:</b> обязательность наличия значения.<br/>
 * @returns {Edit}
 */
aUI.Edit = function Edit(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "input",
        type : null,
        placeholder : null,
        examples : null,
        required : false
    }, options);
    aUI.Element.call(this, options);
    aUI.extensions.validable(this);
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
        var datalist = new aUI.Element({ element : "datalist", id : id }).appendTo(this);
        for (var index in options.examples)
        {
            new aUI.Element({ element : "option", text : options.examples[index] }).appendTo(datalist);
        }
    }
};
aUI.proto(aUI.Edit, aUI.Element);
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
aUI.Select = function Select(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "select",
        value : null,
        items : null,
        disabled : null,
        required : false
    }, options);
    aUI.Element.call(this, options);
    aUI.extensions.validable(this);
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
                var option = new aUI.Element({ element : "option" });
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
                var option = new aUI.Element({ element : "option", text : items[index] });
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
aUI.proto(aUI.Select, aUI.Element);
//---------------------------------------------------------------------------
aUI.Memo = function Memo(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "textarea",
        required : false
    }, options);
    aUI.Element.call(this, options);
    aUI.extensions.validable(this);
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
    //Сборка
    if (options.required) this.required(options.required);
    if (options.placeholder) this.placeholder(options.placeholder);
    if (options.maxLength) this.maxLength(options.maxLength);
};
aUI.proto(aUI.Memo, aUI.Element);


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
 var memo = aUI.Element({ class : options.class, id : options.id });
 memo.setKeyPress = setKeyPress;
 memo.setFocus = setFocus;
 var input = aUI.Element({ element : "textarea" });
 if (options.name) $(input).attr("name", options.name);
 memo.setValue(options.value);
 input.appendTo(memo);
 
 //Возврат результата выполненого после сборки
 return memo;
 },*/
//---------------------------------------------------------------------------





/**
 * <b>Календарь.</b><br/>
 * @param {object} options параметры:<br/>
 * - <b>class:</b> по умолчанию имеет значение "calendar".<br/>
 * - <b>onchange:</b> функция, вызываемая в момент выбора даты.<br/>
 * - <b>date:</b> по умолчанию имеет значение текущей даты.<br/>
 * @returns {Calendar}
 */
aUI.Calendar = function Calendar(options)
{
    //Опции по умолчанию
    options = aUI.extend(
    {
        class : "calendar",
        onclickday : null,
        onclickmonth : null,
        onclickyear : null,
        onchange : null,
        date : new Date()
    }, options);
    aUI.Element.call(this, options);
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

        new aUI.Button({ class : "prev", text : "<", data : dayTableData.prev, onclick : clickPrev }).appendTo(that);
        new aUI.Button({ class : "level days", text : dayTableData.caption, onclick : clickMonthsMode }).appendTo(that);
        new aUI.Button({ class : "prev", text : ">", data : dayTableData.next, onclick : clickNext }).appendTo(that);

        var table = new aUI.Element({ element : "table", class : "days" });

        var th = new aUI.Element({ element : "tr" });
        for (var d = 0; d < 7; d++)
        {
            var item = dayTableData.head[d];
            var td = new aUI.Element({ element : "th", class : item.class, text : item.text });
            td.appendTo(th);
        }
        th.appendTo(table);

        for (var w = 0; w < 6; w++)
        {
            var tr = new aUI.Element({ element : "tr" });
            for (var d = 0; d < 7; d++)
            {
                var item = dayTableData.array[(w * 7) + d];
                var td = new aUI.Button({ element : "td", class : item.class, text : item.text, data : item.date });
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

        new aUI.Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
        new aUI.Button({ class : "level months", text : data.caption, onclick : clickYearsMode }).appendTo(that);
        new aUI.Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);

        var table = new aUI.Element({ element : "table", class : "months" });

        for (var h = 0; h < 3; h++)
        {
            var tr = new aUI.Element({ element : "tr" });
            for (var w = 0; w < 4; w++)
            {
                var item = data.array[(h * 4) + w];
                var td = new aUI.Button({ element : "td", class : item.class, text : item.text, data : item.date });
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

        new aUI.Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
        new aUI.Button({ class : "level years", text : data.caption }).appendTo(that);
        new aUI.Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);

        var table = new aUI.Element({ element : "table", class : "months" });

        for (var h = 0; h < 3; h++)
        {
            var tr = new aUI.Element({ element : "tr" });
            for (var w = 0; w < 4; w++)
            {
                var item = data.array[(h * 4) + w];
                var td = new aUI.Button({ element : "td", class : item.class, text : item.text, data : item.date });
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
//    this.value(options.date);
};
aUI.proto(aUI.Calendar, aUI.Element);
aUI.Calendar.prototype.getDayTableData = function(date)
{
    function getFirsInMonthDayOfWeek(year, month)
    {
        return (new Date(year, month, 1)).getDay();
    }

    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.caption = aUtils.getFullNameMonthRu(data.month) + " " + data.year;

    data.prev = aUtils.shiftMonth(data.date, -1);
    data.next = aUtils.shiftMonth(data.date, +1);

    var countDayInPrevMonth = aUtils.countDayInMonth(data.prev.getFullYear(), data.prev.getMonth());
    var countDayInMonth = aUtils.countDayInMonth(data.year, data.month);
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
        item.text = aUtils.getShortNameDayOfWeekRu(dayOfWeekCounter);
        item.class = aUtils.getShortNameDayOfWeek(dayOfWeekCounter);
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
        item.class = aUtils.getShortNameDayOfWeek(dayOfWeekCounter);
        if ((item.date.getDate() === now.getDate()) && (item.date.getMonth() === now.getMonth()) && (item.date.getFullYear() === now.getFullYear())) item.current = true;
        if ((item.date.getDate() === data.day) && (item.date.getMonth() === data.month) && (item.date.getFullYear() === data.year)) item.selected = true;
        dayOfWeekCounter++;
        if (dayOfWeekCounter === 7) dayOfWeekCounter = 0;
    }
    return data;
};
aUI.Calendar.prototype.getMonthTableData = function(date)
{
    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.caption = data.year;

    data.prev = aUtils.shiftYear(data.date, -1);
    data.next = aUtils.shiftYear(data.date, +1);

    data.array = [ ];
    var now = new Date();
    var monthCounter = 0;
    for (var q = 0; q < 12; q++)
    {
        var item = { };
        item.date = new Date(data.year, monthCounter, aUtils.trimDay(data.year, q, data.day));
        item.text = aUtils.getShortNameMonthRu(monthCounter);
        item.class = aUtils.getShortNameMonth(monthCounter);
        if ((monthCounter === now.getMonth()) && (data.year === now.getFullYear())) item.current = true;
        if ((monthCounter === data.month)) item.selected = true;
        data.array.push(item);
        monthCounter++;
    }
    return data;
};
aUI.Calendar.prototype.getYearTableData = function(date)
{
    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.startDec = data.year - (data.year % 10);
    data.endDec = data.startDec + 9;

    data.caption = data.startDec + " - " + data.endDec;

    data.prev = aUtils.shiftYear(data.date, -10);
    data.next = aUtils.shiftYear(data.date, +10);

    data.array = [ ];
    var now = new Date();
    var yearCounter = data.startDec - 1;
    for (var q = 0; q < 12; q++)
    {
        var item = { };
        item.date = new Date(yearCounter, data.month, aUtils.trimDay(data.year, q, data.day));
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
/**
 * <b>Дата.</b><br/>
 * @param {object} options параметры:<br/>
 * @returns {Date}
 */
aUI.Date = function Date(options)
{
    //Опции
    options = aUI.extend(
    {
    }, options);
    aUI.Element.call(this, options);
    //Переменные
//    var that = this;
    //Функции
    //Сборка
};
aUI.proto(aUI.Date, aUI.Element);
//---------------------------------------------------------------------------
aUI.Field = function Field(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "field",
        caption : null
    }, options);
    aUI.Element.call(this, options);
    //Переменные
//    var that = this;
    //Функции
    //Сборка
    this.caption = new aUI.Element({ class : "caption" }).appendTo(this);
    this.value = new aUI.Element({ class : "value" }).appendTo(this);
    if (options.caption) this.caption.text(options.caption);
};
aUI.proto(aUI.Field, aUI.Element);
//---------------------------------------------------------------------------
aUI.SItem = function SItem(options)
{
    //Опции
    options = aUI.extend(
    {
    }, options);
    aUI.ListItem.call(this, options);
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
    var caption = new aUI.Element({ class : "caption" }).appendTo(this);
    var content = new aUI.Element({ class : "content" }).appendTo(this);
};
aUI.proto(aUI.SItem, aUI.ListItem);
//---------------------------------------------------------------------------
aUI.SList = function SList(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "slist"
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    //Функции
//    function sectionMenuClick()
//    {
//       aURL.set("selected", this.index());
//    }
    this.add = function(params)
    {
        menu.add({ text : params.text, onclick : menuClick });
        if (menu.count() === 1) menu.selectSingle(0);
        var item = list.add();//{ text : params.text }
        item.caption().text(params.text);
    };

    function menuClick()
    {
        select(this.index());
    }

    function select(index)
    {
        console.log("select", index);
        if (scrollList.topIndex() === Number(index)) return;
//        scrollList.list().getElement().transform .css("transition", "transform 0.6s ease-in-out");
        scrollList.topIndex(index);


//    -webkit-transition: -webkit-transform 0.6s ease-in-out;
//    -moz-transition: -moz-transform 0.6s ease-in-out;
//    -o-transition: -o-transform 0.6s ease-in-out;
//    transition: transform 0.6s ease-in-out;        
    }
    function changeTop()
    {
        menu.selectSingle(this.index());
    }
    //Сборка
    var menu = new aUI.List({ class : "menu" }).appendTo(this);
    var scrollList = new aUI.ScrollList({ class : "scrollarea", listOptions : { itemConstructor : aUI.SItem } }).appendTo(this);
    scrollList.onChangeTop(changeTop);
    var list = scrollList.list();
    //menu.css("background-color", "red");
};
aUI.proto(aUI.SList, aUI.Element);
//---------------------------------------------------------------------------
aUI.Progress = function Progress(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "progress",
        orientation : "horizontal",
        value : 0,
        min : 0,
        max : 99,
        round : null
    }, options);
    aUI.Element.call(this, options);
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
    var progress = new aUI.Element({ class : "value" }).appendTo(this);
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
aUI.proto(aUI.Progress, aUI.Element);
//---------------------------------------------------------------------------
aUI.Scroll = function Scroll(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "scroll",
        orientation : "horizontal",
        value : 0,
        min : 0,
        max : 99,
        round : null,
        onchange : null
    }, options);
    aUI.Element.call(this, options);
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
        aUtils.addEvent(document, "mousemove", onMouseMove);
        aUtils.addEvent(document, "mouseup", onMouseUp);
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
        aUtils.removeEvent(document, "mousemove", onMouseMove);
        aUtils.removeEvent(document, "mouseup", onMouseUp);
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
    var drag = new aUI.Element({ class : "drag" }).appendTo(this);
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
};
aUI.proto(aUI.Scroll, aUI.Element);
//---------------------------------------------------------------------------
aUI.XY = function XY(options)
{
    //Опции
    options = aUI.extend(
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
    aUI.Element.call(this, options);
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
        aUtils.addEvent(document, "mousemove", onMouseMove);
        aUtils.addEvent(document, "mouseup", onMouseUp);
        onMouseMove(event);
    }
    function onMouseUp(event)
    {
        aUtils.removeEvent(document, "mousemove", onMouseMove);
        aUtils.removeEvent(document, "mouseup", onMouseUp);
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
    var area = new aUI.Element({ class : "area" }).appendTo(this);
    var progressX = new aUI.Element({ class : "x" }).appendTo(area);
    var progressY = new aUI.Element({ class : "y" }).appendTo(area);
    var move = new aUI.Element({ class : "move", width : 15, height : 15 }).appendTo(area);
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
};
aUI.proto(aUI.XY, aUI.Element);
//---------------------------------------------------------------------------
aUI.Popup = function Popup(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "popup",
        onremove : null
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    var isClicked = false;
    var ovner = null;
    var appendTo = this.appendTo;
    var remove = this.remove;
    var e = this.getElement();
    //Функции
    function onDocumentWheelOrResize(event)
    {
        that.remove();
    }
    function onDocumentMouseDown(event)
    {
        if (!isClicked) that.remove();
        isClicked = false;
    }
    function show()
    {
        updatePosition();
        aUtils.addEvent(document, "mousedown", onDocumentMouseDown);
        aUtils.addEvent(document, "wheel", onDocumentWheelOrResize);
        aUtils.addEvent(document, "resize", onDocumentWheelOrResize);
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
        ovner = aUI.getElement(parent);
        show();
        return that;
    };
    this.remove = function()
    {
        if (options.onremove) if (options.onremove() === false) return;
        aUtils.removeEvent(document, "mousedown", onDocumentMouseDown);
        aUtils.removeEvent(document, "wheel", onDocumentWheelOrResize);
        aUtils.removeEvent(document, "resize", onDocumentWheelOrResize);
        remove();
    };
    function onMouseDown(event)
    {
        isClicked = true;
    }
    function onClick(event)
    {
        event.preventDefault();
    }
    this.onRemove = function(fn)
    {
        if (fn === undefined) return options.onremove;
        if (typeof fn !== "function") throw new Error("fn for onClose not a function");
        options.onremove = fn;
    };
    //Сборка
    e.onmousedown = onMouseDown;
    e.onclick = onClick;
    e.style.display = "none";
    e.style.position = "absolute";
    e.style.zIndex = "100";
    e.style.top = "0px";
    e.style.left = "0px";
//    var body = document.getElementsByTagName("body").item(0);
//    this.appendTo(body);
    appendTo(document.body);
};
aUI.proto(aUI.Popup, aUI.Element);
//---------------------------------------------------------------------------
aUI.Movable = function Movable(options)
{
    //Опции
    options = aUI.extend(
    {
        class : "movable",
        onmove : null
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    var e = this.getElement();
    var rect;
    var dragOffsetX = 0;
    var dragOffsetY = 0;
    //Функции
    function onMouseDown(event)
    {
        aUtils.addEvent(document, "mousemove", onMouseMove);
        aUtils.addEvent(document, "mouseup", onMouseUp);
        that.addClass("move");
        rect = e.getBoundingClientRect();

//        console.log(rect);
//        console.log(event);

        dragOffsetX = event.clientX - rect.left;
        dragOffsetY = event.clientY - rect.top;

        //console.log(dragOffsetX, dragOffsetY);

        onMouseMove(event);

        if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
        else event.returnValue = false; // Вариант Internet Explorer:
    }
    function onMouseUp(event)
    {
        aUtils.removeEvent(document, "mousemove", onMouseMove);
        aUtils.removeEvent(document, "mouseup", onMouseUp);
        that.removeClass("move");
        if (event.preventDefault) event.preventDefault(); // Вариант стандарта W3C:
        else event.returnValue = false; // Вариант Internet Explorer:
    }
    function onMouseMove(event)
    {
        var posX = (event.clientX - rect.left) - dragOffsetX;
        var posY = (event.clientY - rect.top) - dragOffsetY;
        console.log(posX, posY);
    }
    function onDragStart()
    {
        return false;
    }
    //Сборка
    e.ondragstart = onDragStart;
    e.onmousedown = onMouseDown;
//    e.style.display = "none";
    e.style.position = "absolute";
    e.style.zIndex = "100";
//    e.style.top = "0px";
//    e.style.left = "0px";

};
aUI.proto(aUI.Movable, aUI.Element);
//---------------------------------------------------------------------------
