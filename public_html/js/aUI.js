
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
    if (options.id) this.id(options.id);
    if (options.class) this.class(options.class);
    if (options.text || options.text === 0 || options.text === false) this.text(options.text);
    if (options.html || options.html === 0 || options.html === false) this.html(options.html);
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
aUI.Element.prototype.id = function(id)
{
    if (id === undefined) return this.getElement().id;
    this.getElement().id = id;
};
aUI.Element.prototype.class = function(name)
{
    if (name === undefined) return this.getElement().className;
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
aUI.Element.prototype.text = function(text)
{
    if (text === undefined) return this.getElement().textContent;
    this.getElement().textContent = text;
};
aUI.Element.prototype.html = function(html)
{
    if (html === undefined) return this.getElement().innerHtml;
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
    //Переменные
    var that = this;
    this.data = options.data;
    //Функции
    function onclick()
    {
        if (options.onclick) options.onclick.apply(that, arguments);
    }
    this.onClick = function(fn)
    {
        options.onclick = fn;
    };
    //Сборка
    this.getElement().onclick = onclick;
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
//    this.onAdd = function()
//    {
//        
//    }
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
aUI.List.prototype.remove = function(index)
{
    this.item(index).remove();
//    var item = aUI.construct(this.getItemConstructor(), arguments);
//    item.appendTo(this);
//    return item;

};

aUI.List.prototype.count = function()
{
    return this.getElement().childElementCount;
};
aUI.List.prototype.item = function(index)
{
    var element = this.getElement().childNodes[index];
    if (element === undefined) return undefined;// throw new Error("index out of range " + index);
    return element.aui;
};
aUI.List.prototype.items = function()
{
    var nodes = this.getElement().childNodes;
    var items = [ ];
    for (var index = 0; index < nodes.length; index++) items.push(nodes[index].aui);
    return items;
};
aUI.List.prototype.selected = function()
{
    var nodes = this.getElement().childNodes;
    var items = [ ];
    for (var q = 0; q < nodes.length; q++)
    {
        var item = nodes[q].aui;
        if (!item.selected()) continue;
        items.push(item);
    }
    return items;
};
aUI.List.prototype.unselected = function()
{
    var nodes = this.getElement().childNodes;
    var items = [ ];
    for (var q = 0; q < nodes.length; q++)
    {
        var item = nodes[q].aui;
        if (item.selected()) continue;
        items.push(item);
    }
    return items;
};
aUI.List.prototype.selectSingle = function(index)
{
    var nodes = this.getElement().childNodes;
    for (var q = 0; q < nodes.length; q++)
    {
        var item = nodes[q].aui;
        if (index === q) item.select();
        else item.unselect();
    }
};
aUI.List.prototype.selectAll = function()
{
    var nodes = this.getElement().childNodes;
    for (var q = 0; q < nodes.length; q++) nodes[q].aui.select();
};
aUI.List.prototype.unselectAll = function()
{
    var nodes = this.getElement().childNodes;
    for (var q = 0; q < nodes.length; q++) nodes[q].aui.unselect();
};
aUI.List.prototype.toggleSelectAll = function()
{
    var nodes = this.getElement().childNodes;
    for (var q = 0; q < nodes.length; q++) nodes[q].aui.toggleSelect();
};
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
                id : null,
                class : null
            }, options);
    aUI.Button.call(this, options);
    //Переменные
    //Функции
    this.getSelectedClass = function()
    {
        return "selected";
    };
    //Сборка
    this.getElement().aui = this;
};
aUI.proto(aUI.ListItem, aUI.Button);
aUI.ListItem.prototype.select = function()
{
    this.addClass(this.getSelectedClass());
};
aUI.ListItem.prototype.unselect = function()
{
    this.removeClass(this.getSelectedClass());
};
aUI.ListItem.prototype.selected = function()
{
    return this.hasClass(this.getSelectedClass());
};
aUI.ListItem.prototype.toggleSelect = function()
{
    this.toggleClass(this.getSelectedClass());
};
aUI.ListItem.prototype.index = function()
{
    var element = this.getElement();
    var parent = element.parentElement;
    if (!parent) return undefined;
    for (var index = 0; index < parent.childNodes.length; index++)
    {
        if (parent.childNodes[index] === element) return index;
    }
    return undefined;
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
    this.getList = function()
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
    //Сборка
    var list = new aUI.List(options.listOptions);
    list.appendTo(this);
    this.onScroll(scroll);
    this.onScroll = function(fn)
    {
        onScroll = fn;
    };

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
        if (value < 0 || count <= value) throw new Error("value " + value + " out of range 0 - " + (count - 1));
        this.getElement().scrollTop = nodes[value].offsetTop - list.getElement().offsetTop;
    }
};
//---------------------------------------------------------------------------
<<<<<<< HEAD
//aUI.Edit = function Edit(options)
//{
//    //Опции по умолчанию
//    options = aUI.extend(
//            {
////               element : "div"
//            }, options);
//    //Переменные
//    //Функции
//    //Сборка
//
////    var input = new aUI.Element({ element : "input" });
////    input.getElement().style.width = "100%";
////    input.getElement().style.height = "100%";
////    input.appendTo(this.getElement());
//};
//aUI.proto(aUI.Edit, aUI.Element);
//---------------------------------------------------------------------------
aUI.Edit = function Edit(options)
{
    //Опции
    options = aUI.extend(
            {
//                element : "div",
//                class : "button",
//                onclick : null,
//                data : null
            }, options);
    aUI.Element.call(this, options);
    //Переменные
//    var that = this;
//    this.data = options.data;
    //Функции
//    function onclick()
//    {
//        if (options.onclick) options.onclick.apply(that, arguments);
//    }
//    this.onClick = function(fn)
//    {
//        options.onclick = fn;
//    };
    //Сборка
//    this.getElement().onclick = onclick;
    var input = new aUI.Element({ element : "input" });
    input.getElement().style.width = "100%";
    input.getElement().style.height = "100%";
    input.appendTo(this.getElement());
};
aUI.proto(aUI.Edit, aUI.Element);
//---------------------------------------------------------------------------
=======
aUI.Calendar = function Calendar(options)
{
    //Опции по умолчанию
    options = aUI.extend(
    {
    }, options);
    aUI.Element.call(this, options);
    //Переменные
//    var that = this;
    var shortNameDayOfWeekRu = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
    var shortNameDayOfWeek = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
    var fullNameDayOfWeekRu = [ "воскпесенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
    //Функции
    function numToLStr(number, length)
    {
        var value = String(number);
        while (value.length < length) value = "0" + value;
        return value;
    }

    //Сборка
    var date = new Date();

    var array = this.calendarData(date);

    var table = new aUI.Element({ element : "table", class : "calendar" });

    var th = new aUI.Element({ element : "tr" });
    for (var d = 0; d < 7; d++)
    {
        var day = d + 1;
        if (d === 6) day = 0;
        var td = new aUI.Element({ element : "th", class : shortNameDayOfWeek[day], text : shortNameDayOfWeekRu[day] });
        td.appendTo(th);
    }
    th.appendTo(table);

    for (var w = 0; w < 6; w++)
    {
        var tr = new aUI.Element({ element : "tr" });
        for (var d = 0; d < 7; d++)
        {
            var item = array[(w * 7) + d];
            var td = new aUI.Button({ element : "td", class : shortNameDayOfWeek[item.dayOfWeek] });
            if (item.state) td.addClass(item.state);
            if (item.current) td.addClass("current");
            td.text(item.day);
            td.data = new Date(item.year, item.month - 1, item.day);
            td.appendTo(tr);
        }
        tr.appendTo(table);
    }
    table.appendTo(this);
};
aUI.proto(aUI.Calendar, aUI.Element);
aUI.Calendar.prototype.calendarData = function(date)
{
    function getCountDayInMonth(year, month)
    {
        var date = new Date(year, month, 0);
        return date.getDate();
    }
    function getFirsInMonthDayOfWeek(year, month)
    {
        var date = new Date(year, month - 1, 1);
        return date.getDay();
    }

//    var dayOfWeek = date.getDay();
    var dayNumber = date.getDate();
    var monthNumber = date.getMonth() + 1;
    var yearNumber = date.getFullYear();

    var firstInMonthDayOfWeek = getFirsInMonthDayOfWeek(yearNumber, monthNumber);

    var prevMonthNumber = monthNumber - 1;
    var prevYearNumber = yearNumber;
    if (prevMonthNumber === 0)
    {
        prevMonthNumber = 12;
        prevYearNumber--;
    }

    var nextMonthNumber = monthNumber + 1;
    var nextYearNumber = yearNumber;
    if (nextMonthNumber === 13)
    {
        nextMonthNumber = 1;
        nextYearNumber++;
    }

    var countDayInPrevMonth = getCountDayInMonth(prevYearNumber, prevMonthNumber);
    var countDayInMonth = getCountDayInMonth(yearNumber, monthNumber);

    var prevCount = firstInMonthDayOfWeek - 1;
    var prevDIndex = countDayInPrevMonth - prevCount;
    var nextCount = 42 - prevCount - countDayInMonth;

    var array = [ ];

    for (var q = 0; q < prevCount; q++) array.push({ day : q + prevDIndex + 1, month : prevMonthNumber, year : prevYearNumber, state : "prev" });
    for (var q = 0; q < countDayInMonth; q++) array.push({ day : q + 1, month : monthNumber, year : yearNumber, state : "" });
    for (var q = 0; q < nextCount; q++) array.push({ day : q + 1, month : nextMonthNumber, year : nextYearNumber, state : "next" });

    var dayOfWeekCounter = 1;

    var now = new Date();

//    console.log(now.getDate(), now.getMonth() + 1, now.getYear());
//    console.log(typeof array[28].day, array[28].day, array[28].day === now.getDate());

    for (var q = 0; q < array.length; q++)
    {
        var item = array[q];
        //if (item.day === now.getDate() && item.month === now.getMonth() + 1 && item.year === now.getYear()) item.current = true;
        if (item.day === now.getDate()) item.current = true;
        if (dayOfWeekCounter === 7) dayOfWeekCounter = 0;
        item.dayOfWeek = dayOfWeekCounter;
        dayOfWeekCounter++;
    }
//    console.log(array[28].current);

    return array;

};


//---------------------------------------------------------------------------

>>>>>>> origin/master
