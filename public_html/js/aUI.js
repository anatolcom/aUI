
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
    if (parent === null) throw new Error("can not apply appendTo for null");
    if (parent instanceof aUI.Element) parent = parent.getElement();
    if (!parent instanceof HTMLElement) throw new Error("can not apply appendTo for non HTMLElement");
    parent.appendChild(this.getElement());
    return this;
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
    if (hidden) this.getElement().style.display = "none";
    else this.getElement().style.display = "";
};
aUI.Element.prototype.toggleHidden = function()
{
    this.getElement().hidden = !this.getElement().hidden;
};
aUI.Element.prototype.width = function(value)
{
    if (value === undefined) return this.getElement().style.width;
    if (value === null) value = "";
    if (typeof value === "number") value += "px";
    this.getElement().style.width = value;
};
aUI.Element.prototype.height = function(value)
{
    if (value === undefined) return this.getElement().style.height;
    if (value === null) value = "";
    if (typeof value === "number") value += "px";
    this.getElement().style.height = value;
};
aUI.Element.prototype.attr = function(name, value)
{
    if (value === undefined) return this.getElement().setAttribute(name);
    if (value === null) value = "";
    this.getElement().setAttribute(name, value);
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
        //examples : null,
        pattern : null, //??? лишает гибкости
        required : false
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    var validator = null;
    //Функции
    function onvalidate()
    {
        if (validate(that.value(), options.required)) that.removeClass("invalid");
        else that.addClass("invalid");
    }
    function validate(value, required)
    {
        if (value.length === 0) return !required;
        if (validator) return validator.validate(value);
        return true;
    }
    this.validator = function(value)
    {
        if (value === undefined) return validator;
        validator = value;
    };
    //Сборка
    if (options.type) this.type(options.type);
    if (options.placeholder) this.placeholder(options.placeholder);
    if (options.pattern) validator = new aUI.validator.Pattern(options.pattern);//???
    this.getElement().onfocus = onvalidate;
    this.getElement().onkeyup = onvalidate;
};
aUI.proto(aUI.Edit, aUI.Element);
aUI.Edit.prototype.value = function(value)
{
    if (value === undefined) return this.getElement().value;
    this.getElement().value = value;
};
aUI.Edit.prototype.type = function(value)
{
    if (value === undefined) return this.attr("type");
    this.attr("type", value);
};
aUI.Edit.prototype.placeholder = function(value)
{
    if (value === undefined) return this.attr("placeholder");
    this.attr("placeholder", value);
};
aUI.Edit.prototype.invalid = function()
{
    return this.hasClass("invalid");
};
//---------------------------------------------------------------------------
/**
 * <b>Календарь.</b><br/>
 * @param {object} options параметры:<br/>
 * - <b>class:</b> по умолчанию имеет значение "calendar".<br/>
 * - <b>onselect:</b> функция, вызываемая в момент выбора даты.<br/>
 * - <b>date:</b> по умолчанию имеет значение текущей даты.<br/>
 * @returns {Calendar}
 */
aUI.Calendar = function Calendar(options)
{
    //Опции по умолчанию
    options = aUI.extend(
    {
        class : "calendar",
        onselect : null,
        date : new Date()
    }, options);
    aUI.Element.call(this, options);
    //Переменные
    var that = this;
    var mode = "days";
//    var mode = "months";
    var shortNameDayOfWeekRu = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
    var shortNameDayOfWeek = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
//    var fullNameDayOfWeekRu = [ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
//    var shortNameMonth = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
//    var fullNameMonthNum = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
    var shortNameMonth = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
    var shortNameMonthRu = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
    var fullNameMonthRu = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
    //Функции
    function numToLStr(number, length)
    {
        var value = String(number);
        while (value.length < length) value = "0" + value;
        return value;
    }

    this.value = function(date)
    {
        if (date === undefined) return options.date;
        options.date = date;
        if (mode === "days") showDays(options.date);
        if (mode === "months") showMonths(options.date);
        if (mode === "years") showYears(options.date);
    };
    function clickMonthsMode()
    {
        mode = "months";
        that.value(options.date);
    }
    function clickYearsMode()
    {
        mode = "years";
        that.value(options.date);
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
        if (options.onselect) options.onselect.call(that);
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
    this.onSelect = function(fn)
    {
        options.onselect = fn;
    };

    function showDays(date)
    {
        that.clear();
        var dayTableData = that.getDayTableData(date);

        var prevMonth = new aUI.Button({ class : "prev", text : "<", data : dayTableData.prev });
        prevMonth.onClick(clickPrev);
        prevMonth.appendTo(that);

        var monthAndYear = new aUI.Button({ class : "levelUp", text : fullNameMonthRu[dayTableData.month] + " " + dayTableData.year });
        monthAndYear.onClick(clickMonthsMode);
        monthAndYear.appendTo(that);

        var nextMonth = new aUI.Button({ class : "prev", text : ">", data : dayTableData.next });
        nextMonth.onClick(clickNext);
        nextMonth.appendTo(that);

        var table = new aUI.Element({ element : "table", class : "days" });

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
                var item = dayTableData.array[(w * 7) + d];
                var td = new aUI.Button({ element : "td", class : shortNameDayOfWeek[item.dayOfWeek] });
                if (item.state) td.addClass(item.state);
                if (item.current) td.addClass("current");
                if (item.selected) td.addClass("selected");
                td.text(item.day);
                td.data = new Date(item.year, item.month, item.day);
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
        var monthTableData = that.getMonthTableData(date);

        var prevYear = new aUI.Button({ class : "prev", text : "<", data : monthTableData.prev });
        prevYear.onClick(clickPrev);
        prevYear.appendTo(that);

        var year = new aUI.Button({ class : "levelUp", text : monthTableData.year });
        year.onClick(clickYearsMode);
        year.appendTo(that);

        var nextYear = new aUI.Button({ class : "prev", text : ">", data : monthTableData.next });
        nextYear.onClick(clickNext);
        nextYear.appendTo(that);

        var table = new aUI.Element({ element : "table", class : "months" });

        for (var h = 0; h < 3; h++)
        {
            var tr = new aUI.Element({ element : "tr" });
            for (var w = 0; w < 4; w++)
            {
                var item = monthTableData.array[(h * 4) + w];
                var td = new aUI.Button({ element : "td", class : shortNameMonth[item.month] });
                if (item.state) td.addClass(item.state);
                if (item.current) td.addClass("current");
                if (item.selected) td.addClass("selected");
                td.text(shortNameMonthRu[item.month]);
                td.data = new Date(item.year, item.month, item.day);
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
        var yearTableData = that.getYearTableData(date);

        var prevYear = new aUI.Button({ class : "prev", text : "<", data : yearTableData.prev });
        prevYear.onClick(clickPrev);
        prevYear.appendTo(that);

        var year = new aUI.Button({ class : "levelUp", text : yearTableData.startDec + " - " + yearTableData.endDec });
//        year.onClick(clickYearsMode);
        year.appendTo(that);

        var nextYear = new aUI.Button({ class : "prev", text : ">", data : yearTableData.next });
        nextYear.onClick(clickNext);
        nextYear.appendTo(that);

        var table = new aUI.Element({ element : "table", class : "months" });

        for (var h = 0; h < 3; h++)
        {
            var tr = new aUI.Element({ element : "tr" });
            for (var w = 0; w < 4; w++)
            {
                var item = yearTableData.array[(h * 4) + w];
                var td = new aUI.Button({ element : "td", class : item.year });
                if (item.state) td.addClass(item.state);
                if (item.current) td.addClass("current");
                if (item.selected) td.addClass("selected");
                td.text(item.year);
                td.data = new Date(item.year, item.month, item.day);
                td.onClick(clickYear);
                td.appendTo(tr);
            }
            tr.appendTo(table);
        }
        table.appendTo(that);
    }
    //Сборка
    this.value(options.date);
};
aUI.proto(aUI.Calendar, aUI.Element);
aUI.Calendar.prototype.getDayTableData = function(date)
{
    function countDayInMonth(year, month)
    {
        return (new Date(year, month + 1, 0)).getDate();
    }
    function trimDay(year, month, day)
    {
        while (day > countDayInMonth(year, month)) day--;
        return day;
    }
    function prevMonth(date)
    {
        var day = date.getDate();
        var month = date.getMonth() - 1;
        var year = date.getFullYear();
        if (month === 0)
        {
            month = 11;
            year--;
        }
        return new Date(year, month, trimDay(year, month, day));
    }
    function nextMonth(date)
    {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (month === 12)
        {
            month = 0;
            year++;
        }
        return new Date(year, month, trimDay(year, month, day));
    }
    function getFirsInMonthDayOfWeek(year, month)
    {
        return (new Date(year, month, 1)).getDay();
    }

    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.prev = prevMonth(data.date);
    data.next = nextMonth(data.date);

    var countDayInPrevMonth = countDayInMonth(data.prev.getFullYear(), data.prev.getMonth());
    var countDayInMonth = countDayInMonth(data.year, data.month);
    var firstInMonthDayOfWeek = getFirsInMonthDayOfWeek(data.year, data.month);

    var prevCount = firstInMonthDayOfWeek - 1;
    if (prevCount < 0) prevCount = 6;
    var prevDIndex = countDayInPrevMonth - prevCount;
    var nextCount = 42 - prevCount - countDayInMonth;

    data.array = [ ];

    for (var q = 0; q < prevCount; q++) data.array.push({ day : q + prevDIndex + 1, month : data.prev.getMonth(), year : data.prev.getFullYear(), state : "prev" });
    for (var q = 0; q < countDayInMonth; q++) data.array.push({ day : q + 1, month : data.month, year : data.year, state : "" });
    for (var q = 0; q < nextCount; q++) data.array.push({ day : q + 1, month : data.next.getMonth(), year : data.next.getFullYear(), state : "next" });

    var dayOfWeekCounter = 1;

    var now = new Date();

    for (var q = 0; q < data.array.length; q++)
    {
        var item = data.array[q];
        if ((item.day === now.getDate()) && (item.month === now.getMonth()) && (item.year === now.getFullYear())) item.current = true;
        if ((item.day === data.day) && (item.month === data.month) && (item.year === data.year)) item.selected = true;
        if (dayOfWeekCounter === 7) dayOfWeekCounter = 0;
        item.dayOfWeek = dayOfWeekCounter;
        dayOfWeekCounter++;
    }

    return data;
};
aUI.Calendar.prototype.getMonthTableData = function(date)
{
    function countDayInMonth(year, month)
    {
        return (new Date(year, month + 1, 0)).getDate();
    }
    function trimDay(year, month, day)
    {
        while (day > countDayInMonth(year, month)) day--;
        return day;
    }
    function prevYear(date)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() - 1;
        return new Date(year, month, trimDay(year, month, day));
    }
    function nextYear(date)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() + 1;
        return new Date(year, month, trimDay(year, month, day));
    }

    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.prev = prevYear(data.date);
    data.next = nextYear(data.date);

    data.array = [ ];

    var now = new Date();

    for (var q = 0; q < 12; q++)
    {
        var item = { day : trimDay(data.year, q, data.day), month : q, year : data.year };
        if ((item.month === now.getMonth()) && (item.year === now.getFullYear())) item.current = true;
        if ((data.month === item.month) && (data.year === item.year)) item.selected = true;
        data.array.push(item);
    }
    return data;
};
aUI.Calendar.prototype.getYearTableData = function(date)
{
    function countDayInMonth(year, month)
    {
        return (new Date(year, month + 1, 0)).getDate();
    }
    function trimDay(year, month, day)
    {
        while (day > countDayInMonth(year, month)) day--;
        return day;
    }
    function prevYearDec(date)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() - 10;
        return new Date(year, month, trimDay(year, month, day));
    }
    function nextYearDec(date)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() + 10;
        return new Date(year, month, trimDay(year, month, day));
    }

    var data = { date : date };
    data.day = date.getDate();
    data.month = date.getMonth();
    data.year = date.getFullYear();

    data.startDec = data.year - (data.year % 10);
    data.endDec = data.startDec + 9;

    data.prev = prevYearDec(data.date);
    data.next = nextYearDec(data.date);

    data.array = [ ];

    var now = new Date();
    var yearCounter = data.startDec - 1;

    for (var q = 0; q < 12; q++)
    {
        var item = { day : trimDay(data.year, q, data.day), month : data.month, year : yearCounter, state : "" };
        if ((item.year === now.getFullYear())) item.current = true;
        if ((data.year === item.year)) item.selected = true;
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
