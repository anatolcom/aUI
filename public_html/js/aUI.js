
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
    var array = [null];
    if (args instanceof Array) array = args;
    else for (var index in arguments) array.push(args[index]);
    return new (Function.prototype.bind.apply(constructor, array));

    /*
     var array = null;
     if (args instanceof Array) array = args;
     if (args instanceof Arguments) array = [null];
     if (array === null) throw new Error("Incorrect type of args", args);
     for (var index in arguments) array.push(args[index]);
     return new (Function.prototype.bind.apply(constructor, array));
     
     */

};
/**
 * <b>Элемент DOM браузера.</b><br/>
 * По умолчанию div.<br/>
 * @param {object} options входные данные:<br/>
 * element: название элемента, например "div" или "span"<br/>
 * id: id элемента, например для привязки стилей через "#".<br/>
 * class: класс элемента, например для привязки стилей через ".".<br/>
 * text: содержимое элемента в виде текста.<br/>
 * html: содержимое элемента ввиде HTML данных.<br/>
 * @returns {aUI.Element.element|Element}
 */
aUI.Element = function Element(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "div",
        id : null,
        class : null,
        text : null,
        html : null
    }, options);
    //Переменные
    //var that = this;
    //Функции
    this.getElement = function()
    {
        return element;
    };
    //Сборка
    var element = document.createElement(options.element);
    if (options.id) this.setId(options.id);
    if (options.class) this.setClass(options.class);
    if (options.text || options.text === 0 || options.text === false) this.setText(options.text);
    if (options.html || options.html === 0 || options.html === false) this.setHtml(options.html);
};
/**
 * Добавление елемента как дочернего к указанному елементу.<br/>
 * В качестве контейнера можно указывать только елементы проходящие проверку instanceof aUI.Element или instanceof HTMLElement
 * @param {type} parent елемент, который станет контейнером для текушего элемента. 
 * @returns {undefined}
 */
aUI.Element.prototype.appendTo = function(parent)
{
    if (parent instanceof aUI.Element) parent = parent.getElement();
    if (!parent instanceof HTMLElement) throw new Error("can not apply appendTo for non HTMLElement");
    parent.appendChild(this.getElement());
};
aUI.Element.prototype.clear = function()
{
    var element = this.getElement();
    while (element.childNodes[0] !== undefined) element.removeChild(element.childNodes[0]);
};
aUI.Element.prototype.remove = function()
{
    var element = this.getElement();
    var parent = element.parentElement;
    if (parent) parent.removeChild(element);
};
aUI.Element.prototype.getId = function()
{
    return this.getElement().id;
};
aUI.Element.prototype.setId = function(id)
{
    this.getElement().id = id;
};
aUI.Element.prototype.getClass = function()
{
    return this.getElement().className;
};
aUI.Element.prototype.setClass = function(name)
{
    this.getElement().className = name;
};
aUI.Element.prototype.addClass = function(name)
{
    this.getElement().classList.add(name);
};
aUI.Element.prototype.removeClass = function(name)
{
    this.getElement().classList.remove(name);
};
aUI.Element.prototype.hasClass = function(name)
{
    return this.getElement().classList.contains(name);
};
aUI.Element.prototype.toggleClass = function(name)
{
    this.getElement().classList.toggle(name);
};
aUI.Element.prototype.getText = function()
{
    return this.getElement().textContent;
};
aUI.Element.prototype.setText = function(text)
{
    this.getElement().textContent = text;
};
aUI.Element.prototype.getHtml = function()
{
    return this.getElement().innerHtml;
};
aUI.Element.prototype.setHtml = function(html)
{
    this.getElement().innerHtml = html;
};
aUI.Element.prototype.hidden = function(hidden)
{
    if (hidden === undefined) return this.getElement().hidden;
    if (hidden)
    {
//        this.getElement().hidden = true;
        this.getElement().style.display = "none";
    }
    else
    {
//        this.getElement().hidden = false;
        this.getElement().style.display = "";
    }
};
//-------------------------------------------------------------------------------------------------------------------
aUI.Element.prototype.toggleHidden = function()
{
    this.getElement().hidden = !this.getElement().hidden;
};
//-------------------------------------------------------------------------------------------------------------------
aUI.Element.prototype.width = function(value)
{
    if (value === undefined) return this.getElement().style.width;
    if (value === null) value = "";
    this.getElement().style.width = value;
};
//-------------------------------------------------------------------------------------------------------------------
aUI.Element.prototype.height = function(value)
{
    if (value === undefined) return this.getElement().style.height;
    if (value === null) value = "";
    this.getElement().style.height = value;
};
//-------------------------------------------------------------------------------------------------------------------
/*
 * <b>Кнопка.<b><br/>
 * @param {object} options параметры
 * @returns {aUI.Button}
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
    //Переменные
    var that = this;
    this.data = options.data;
    //Функции
    function click()
    {
        if (options.onclick) options.onclick.apply(that, arguments);
    }
    this.setClick = function(fn)
    {
        options.onclick = fn;
    };
    //Сборка
    this.getElement().onclick = click;
};
aUI.proto(aUI.Button, aUI.Element);
//-------------------------------------------------------------------------------------------------------------------
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
    var itemConstructor = aUI.ListItem;
    //Функции
    this.setItemConstructor = function(constructor)
    {
        if (typeof constructor !== "function") throw new Error("constructor not function");
        if (!constructor instanceof aUI.ListItem) throw new Error("constructor not proto aUI.ListItem");
        itemConstructor = constructor;
    };
    this.getItemConstructor = function()
    {
        return itemConstructor;
    };
    //Сборка
    if (options.itemConstructor) this.setItemConstructor(options.itemConstructor);
};
aUI.proto(aUI.List, aUI.Element);
aUI.List.prototype.add = function()
{
    var item = aUI.construct(this.getItemConstructor(), arguments);
    item.appendTo(this);
    return item;
};
aUI.List.prototype.count = function()
{
    return this.getElement().childElementCount;
};
aUI.List.prototype.item = function(index)
{
    return this.getElement().childNodes[index].aui;
};
aUI.List.prototype.items = function()
{
    var nodes = this.getElement().childNodes;
    var items = [];
    for (var index = 0; index < nodes.length; index++) items.push(nodes[index].aui);
    return items;
};
aUI.List.prototype.selected = function()
{
    var nodes = this.getElement().childNodes;
    var items = [];
    for (var index = 0; index < nodes.length; index++)
    {
        var item = nodes[index].aui;
        if (!item.selected()) continue;
        items.push(item);
    }
    return items;
};
//-------------------------------------------------------------------------------------------------------------------
aUI.ListItem = function ListItem(options)
{
    //Опции
    options = aUI.extend(
    {
        element : "li",
        id : null,
        class : null
    }, options);
    aUI.Button.call(this, options);
    //Переменные
    //Функции
    this.getSelectClass = function()
    {
        return "selected";
    };
    //Сборка
    this.getElement().aui = this;
};
aUI.proto(aUI.ListItem, aUI.Button);
aUI.ListItem.prototype.select = function()
{
    this.addClass(this.getSelectClass());
};
aUI.ListItem.prototype.unselect = function()
{
    this.removeClass(this.getSelectClass());
};
aUI.ListItem.prototype.selected = function()
{
    return this.hasClass(this.getSelectClass());
};
aUI.ListItem.prototype.toggleSelect = function()
{
    this.toggleClass(this.getSelectClass());
};
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
 * @param {object} options настройки:
 * @param {number} options.height высота
 * @param {number} options.width ширина
 * @param {string} options.horizontal горизонтальная полоса прокрутки. варианты: "auto", "show", "hide"
 * @param {string} options.vertical вертикальная полоса прокрутки. варианты: "auto", "show", "hide"
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
    this.onScroll = function(fn)
    {
        this.getElement().onscroll = fn;
    };
    this.onResize = function(fn)
    {
        this.getElement().onresize = fn;
    };
    this.horizontalScrollBar = function(type)
    {
        switch (type)
        {
            case "auto":
                options.horizontal = "auto";
                break;
            case "show":
                options.horizontal = "scroll";
                break;
            case "hide":
                options.horizontal = "hidden";
                break;
            default:
                options.horizontal = "auto";
                throw new Error("Unknow horizontal type " + type);
        }
        this.getElement().style.overflowX = options.horizontal;
    };
    this.verticalScrollBar = function(type)
    {
        switch (type)
        {
            case "auto":
                options.vertical = "auto";
                break;
            case "show":
                options.vertical = "scroll";
                break;
            case "hide":
                options.vertical = "hidden";
                break;
            default:
                options.vertical = "auto";
                throw new Error("Unknow vertical type " + type);
        }
        this.getElement().style.overflowY = options.vertical;
    };
    //Сборка
    this.horizontalScrollBar(options.horizontal);
    this.verticalScrollBar(options.vertical);
    this.height(options.height);
    this.width(options.width);
};
aUI.proto(aUI.ScrollArea, aUI.Element);
//---------------------------------------------------------------------------
/**
 * 
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
    var changeTopIndex = null;
    var lastTopIndex = null;
    //Функции
    this.getList = function()
    {
        return list;
    };
    function scroll()
    {
        var topIndex = that.topIndex();
        if (lastTopIndex !== topIndex)
        {
            lastTopIndex = topIndex;
            if (changeTopIndex) changeTopIndex();
            console.log("topIndex", topIndex);
        }
    }
    this.onChangeTopIndex = function(fn)
    {
        if (typeof fn !== "function") throw new Error("fn is not a function");
        changeTopIndex = fn;
    };

    //Сборка
    var list = new aUI.List(options.listOptions);
    list.appendTo(this);
    this.onScroll(scroll);
};
aUI.proto(aUI.ScrollList, aUI.ScrollArea);
aUI.ScrollList.prototype.topIndex = function(value)
{
    var list = this.getList();
    var nodes = list.getElement().childNodes;
    var count = list.count();
    if (value === undefined)
    {
        var offsetTop = this.getElement().scrollTop + list.getElement().offsetTop;
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
        if (value < 0 || value >= count) throw new Error("value " + value + " out of range 0 - " + count);
        this.getElement().scrollTop = nodes[value].offsetTop - list.getElement().offsetTop;
    }
};