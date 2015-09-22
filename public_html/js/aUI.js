function aError(options)
{
 this.message = options;
 console.error(this.message);
}
/**
 * Библиотека элементов пользовательского интерфейса.<br/>
 * @type object
 */
var aUI =
{
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
 /**
  * <b>Настройки для Button.</b><br.>
  * @param {type} caption заголовок кнопкиж
  * @param {type} onclick вызываемая функция
  * @param {type} data любые вспомогательные данные
  * @returns {undefined}
  */
 ButtonParam : function (caption, onclick, data)
 {
  this.caption = caption;
  this.onclick = onclick;
  this.data = null;
  if (data !== undefined) this.data = data;
 },
//---------------------------------------------------------------------------
 /**
  * <b>Элемент DOM модели браузера.</b><br/>
  * По умолчанию div.<br/>
  * @param {object} options входные данные:<br/>
  * element: название элемента, например "div" или "span"<br/>
  * id: id элемента, например для привязки стилей через "#".<br/>
  * class: класс элемента, например для привязки стилей через ".".<br/>
  * text: содержимое элемента в виде текста.<br/>
  * html: содержимое элемента ввиде HTML данных.<br/>
  * @returns {aUI.Element.element|Element}
  */
 Element : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   element : null,
   id : null,
   class : null,
   text : null,
   html : null
  }, options);
  if (!options.element) options.element = "div";
  //Функция
  function clear() { $(this).empty(); }
  function remove() { $(this).remove(); }
  function click() { options.onclick(options.params); }
  function getAttr(name) { return $(this).attr(name); }
  function setAttr(name, value) { $(this).attr(name, value); }
  function addClass(name) { $(this).addClass(name); }
  function removeClass(name) { if ($(this).is("." + name)) $(this).removeClass(name); }
  function isClass(name) { return $(this).is("." + name); }
  function toggleClass(name) { $(this).toggleClass(name); }
  function appendTo(target) 
  {
   $(this).appendTo(target);
   return this;
  }
  function prependTo(target)
  {
   $(this).prependTo(target);
   return this;
  }
  function getWidth() { return $(this).width(); }
  function setWidth(value) { $(this).width(value); }
  function getHeight() { return $(this).height(); }
  function setHeight(value) { $(this).height(value); }
  function show() { $(this).show(); }
  function hide() { $(this).hide(); }
  function toggle() { $(this).toggle(); }
  //Сборка
  var element = document.createElement(options.element);
  //public
  element.getAttr = getAttr;
  element.setAttr = setAttr;
  element.addClass = addClass;
  element.removeClass = removeClass;
  element.isClass = isClass;
  element.toggleClass = toggleClass;
  element.appendTo = appendTo;
  element.prependTo = prependTo;
  element.getWidth = getWidth;
  element.setWidth = setWidth;
  element.getHeight = getHeight;
  element.setHeight = setHeight;
  element.show = show;
  element.hide = hide;
  element.toggle = toggle;
  element.clear = clear;
  element.remove = remove;
  //private
// element.setHtml=function(value){if(value)$(this).html(value);else $(this).empty();};
// element.getHtml=function(){return $(this).html();};
// element.setText=function(value){if(value)$(this).text(value);else $(this).empty();};
// element.getText=function(){return $(this).text();};
  //$(element).addClass(options.class);
  element.addClass(options.class);
  if (options.id) $(element).attr("id", options.id);
  if (options.text) $(element).text(options.text);
  if (options.html) $(element).html(options.html);
// if(options.text)element.setText(options.text);
// if(options.html)element.setHtml(options.html);
  if (options.onclick) $(element).click(click);
  //Возврат результата выполненого после сборки
  return element;
 },
//---------------------------------------------------------------------------
 TextElement : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
  }, options);
  //Функции
  function getText() { return $(ui).text(); }
  function setText(value) { $(ui).text(value); }
  function getHtml() { return $(ui).html(); }
  function setHtml(value) { $(ui).html(value); }
  //Сборка
  var ui = aUI.Element(options);
  ui.getText = getText;
  ui.setText = setText;
  ui.getHtml = getHtml;
  ui.setHtml = setHtml;
  //Возврат результата выполненого после сборки
  return ui;
 },
//---------------------------------------------------------------------------
 /*
  * <b>Кнопка.<b><br/>
  * @param {object} options параметры
  * @returns {aUI.Button.ui|aUI.Element.element|Element}
  */
 Button : function (options)
 {
  try
  {
   //Опции по умолчанию
   function click() { alert("Default click function.\nAdd option: onclick:function(){...}"); }
   options = $.extend(
   {
    element : "div",
    id : null,
    class : "Button",
    caption : "Button",
    onclick : click,
    data : null
   }, options);
   //Функция по умолчанию
   function setCaption(value)
   {
    if (value) $(this).html(value);
    else $(this).empty();
   }
   function checkFunction(fn)
   {
    try
    {
     if (!fn) return null;
     //Проверка onclick это string или нет и преобразование в function
     if ((typeof fn) === "string")
     {
      var f = fn;
      fn = function ()
      {
       alert("eval string: " + f);
       eval(f);
      };
     }
     //Проверка onclick это function или нет
     if ((typeof fn) !== "function")
     {
      alert("Button \"" + options.caption + "\" have onclick has not function.\nType of onclick \"" + (typeof fn) + "\"");
      return null;
     }
     return fn;
    }
    catch (err)
    {
     throw new Error("checkFunction(" + err.message + ")");
    }
   }
   function setClick(fn) { this.onclick = checkFunction(fn); }
//  function addClick(fn) { $(this).onclick = checkFunction(fn); }
//  function getData() { return options.data; }
//  function setData(data) { options.data = data; }
   function getData() { return ui.data; }
   function setData(data) { ui.data = data; }

   //Сборка
   var ui = aUI.Element({ element : options.element, id : options.id });//,onclick:options.onclick,params:options.params
   ui.data = options.data;
   ui.addClass(options.class);
   ui.setCaption = setCaption;
   ui.setClick = setClick;
//  btn.addClick = addClick;
   ui.getData = getData;
   ui.setData = setData;
   ui.setCaption(options.caption);
   ui.setClick(options.onclick);
   ui.setData(options.data);
   //Возврат результата выполненого после сборки
   return ui;
  }
  catch (err)
  {
   throw new Error("Button(" + err.message + ")");
  }
 },
//---------------------------------------------------------------------------
 Check : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : "Check",
   id : null,
   value : null
  }, options);
  //Функции
  function getValue() { return $(input).is(":checked"); }
  function setValue(value)
  {
   if (getValue() === value) return this;
   if (value) $(input).attr("checked", "checked");
   else $(input).removeAttr("checked");
   return this;
  }
  function setFocus() { $(input).focus(); }
  //События
  function setKeyPress(fn) { $(input).keypress(fn); }
  function setChange(fn) { $(input).change(fn); }
  //Сборка
  var check = aUI.Element({ class : options.class, id : options.id });
  check.getValue = getValue;
  check.setValue = setValue;
  check.setFocus = setFocus;
  check.setKeyPress = setKeyPress;
  check.setChange = setChange;
  var input = aUI.Element({ element : "input" });
  $(input).attr("type", "checkbox");
// input.style.width="100%";
// input.style.height="100%";
  check.setValue(options.value);
  input.appendTo(check);
  //Возврат результата выполненого после сборки
  return check;
 },
//---------------------------------------------------------------------------
 /**
  * <b>Область прокрутки.</b><br/>
  * Методы horizontalScrollBar и verticalScrollBar управляют видимостью полос прокрутки.<br/>
  * вырианты:<br/>
  * - show : показывать всегда,<br/>
  * - hide : скрывать всегда,<br/>
  * - auto : показывать при необходимости.<br/>
  * События onScroll и onResize.<br/>
  * @param {type} options
  * @returns {aUI.Element.element|Element|aUI.ScrollArea.area}
  */
 ScrollArea : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : "ScrollArea",
   height : null,
   width : null,
   type : "auto",
   horizontal : "auto",
   vertical : "auto"
  }, options);
  //Функции
  function add(element)
  {
   $(element).appendTo(area);
   return element;
  }
  function onScroll(fn) { $(area).scroll(fn); }
  function onResize(fn)
  {
   $(area).resize(fn);
  }
  function horizontalScrollBar(type)
  {
   switch (type)
   {
    case "show":
     options.horizontal = "scroll";
     break;
    case "hide":
     options.horizontal = "hidden";
     break;
    case "auto":
     options.horizontal = "auto";
     break;
    default:
     throw new Error("Unknow horizontal type " + type);
   }
   $(area).css({ "overflow-x" : options.horizontal });
  }
  function verticalScrollBar(type)
  {
   switch (type)
   {
    case "show":
     options.vertical = "scroll";
     break;
    case "hide":
     options.vertical = "hidden";
     break;
    case "auto":
     options.vertical = "auto";
     break;
    default:
     throw new Error("Unknow vertical type " + type);
   }
   $(area).css({ "overflow-y" : options.vertical });
  }
  //Сборка
  var area = aUI.Element({ class : options.class });
  area.add = add;
  area.onScroll = onScroll;
  area.onResize = onResize;
  area.horizontalScrollBar = horizontalScrollBar;
  area.verticalScrollBar = verticalScrollBar;
  horizontalScrollBar(options.horizontal);
  verticalScrollBar(options.vertical);
  $(area).css({ height : options.height });
  $(area).css({ width : options.width });
  //Возврат результата выполненого после сборки
  return area;
 },
//---------------------------------------------------------------------------
 List : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   element : "ul",
   class : "List",
   id : null,
   onclick : null,
//  onselesct:null,
   array : []
  }, options);
  //Функции
  function addItem(data)
  {
   var item = aUI.ListItem(data);
   item.setClick(options.onclick);
   item.appendTo(this);
   return item;
  }
  function getItem(index)
  {
//  var path = "li" + ":eq(" + index + ")";
//  return $(list).children(path);
   var items = list.getItems();
   return items[index];
  }
  function getIndex()
  {
   var items = list.getItems();
   for (var q = 0; q < items.length; q++)
   {
    var item = items[q];
    if ($(item).is(".Selected")) return q;
   }
   return -1;
  }
  function getItemByData(data)
  {
   var items = list.getItems();
   for (var q = 0; q < items.length; q++)
   {
    var item = items[q];
    if (item.getData() === data) return item;
   }
   return null;
  }
  function getItems() { return $(list).children(); }
  function getSelected() { return $(list).children(".Selected"); }
  function selectAll()
  {
   var childs = $(list).children();
   for (var q = 0; q < childs.length; q++) childs[q].select();
  }
  function unselectAll()
  {
   var childs = $(list).children();
   for (var q = 0; q < childs.length; q++) childs[q].unselect();
  }
  function clear() { $(list).empty(); }
  function setFocus()
  {
   $(list).focus(); //???
  }
  function setKeyPress(fn)
  {
   $(list).keypress(fn); //???
  }

  //Сборка
  var list = aUI.Element({ element : options.element, id : options.id, class : options.class });
  list.addItem = addItem;
  list.getItem = getItem;
  list.getIndex = getIndex;
  list.getItemByData = getItemByData;
  list.getItems = getItems;
  list.getSelected = getSelected;
  list.selectAll = selectAll;
  list.unselectAll = unselectAll;
  list.clear = clear;
  list.setFocus = setFocus;
  list.setKeyPress = setKeyPress;
  for (var index in options.array) list.addItem({ text : options.array[index], data : index });
  //Возврат результата выполненого после сборки
  return list;
 },
//---------------------------------------------------------------------------
 ListItem : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   element : "li",
   class : null,
//  onclick:null,
   onselect : null,
   selected : "Selected",
   text : "",
   data : null
  }, options);
  //Функции
  function getIndex() { return $(this).index(); }
// function getData(){return options.data;}
// function setData(data){options.data=data;}
// function getData(){return item.getData();}
// function setData(data){item.setData(data);}
  function setSelect(onselect) { this.onselect = onselect; }
  function select()
  {
   this.addClass(options.selected);
   if (this.onselect !== null) this.onselect();
  }
  function unselect() { this.removeClass(options.selected); }
  function isSelected() { return this.isClass(options.selected); }
  //Сборка
  var item = aUI.Button({ element : options.element, class : options.class, caption : options.text });//, onclick:options.onclick
  item.getIndex = getIndex;
// item.getData=getData;
// item.setData=setData;
  item.select = select;
  item.unselect = unselect;
  item.isSelected = isSelected;
  item.setSelect = setSelect;
  item.setData(options.data);

  //Возврат результата выполненого после сборки
  return item;
 },
//---------------------------------------------------------------------------
 ScrollList : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
//  class:null,
//  classList:null,
//  height:null,
//  width:null,
   array : [],
   onclick : null
  }, options);
  //Функции
  function getList() { return list; }
  //Сборка
  var area = aUI.ScrollArea({ class : options.class, height : options.height, width : options.width });
  var list = aUI.List({ class : options.classList, array : options.array, onclick : options.onclick });
  list.appendTo(area);
  area.getList = getList;
  //Возврат результата выполненого после сборки
  return area;
 },
//---------------------------------------------------------------------------
 ScrollPanel : function (options)
 {
  try
  {
   //Опции по умолчанию
   options = $.extend(
   {
    class : null,
    width : 100,
    height : 100,
    horizontal : "auto",
    vertical : "auto",
//   top:{height:20},
//   bottom:{height:20},
//   left:{width:20},
//   right:{width:20},
    array : []
   }, options);
   //Функции
   function getArea() { return area; }
   function getTop() { return top; }
   function getBottom() { return bottom; }
   function getLeft() { return left; }
   function getRight() { return right; }
//  function setAreaWidth(value)
//  {
//   area.setWidth(value);
//   top.setWidth(value);
//   bottom.setWidth(value);
//  }
//  function setAreaHeight(value)
//  {
//   area.setHeight(value);
//   left.setHeight(value);
//   right.setHeight(value);
//  }
//  function setTopHeight(value)
//  {
//   top.setHeight(value);
//   lt.setHeight(value);
//   rt.setHeight(value);
//  }
//  function setBottomHeight(value)
//  {
//   bottom.setHeight(value);
//   lb.setHeight(value);
//   rb.setHeight(value);
//  }
//  function setLeftWidth(value)
//  {
//   left.setWidth(value);
//   lt.setWidth(value);
//   lb.setWidth(value);
//  }
//  function setRightWidth(value)
//  {
//   right.setWidth(value);
//   rt.setWidth(value);
//   rb.setWidth(value);
//  }

   //Сборка
   /*
    * lt  t  rt
    * l   a   r
    * lb  b  rb
    */
//  var panel=aUI.Element();
////  panel.setHeight=setHeight;
//  panel.getArea=getArea;
//
//  var area=aUI.ScrollArea({class:options.class});
//
//  var top=aUI.ScrollArea({class:"Top"});
//  var bottom=aUI.ScrollArea({class:"Bottom"});
//  var left=aUI.ScrollArea({class:"Left"});
//  var right=aUI.ScrollArea({class:"Right"});
//  
//  var lt=aUI.Element({class:"LeftTop"});
//  var rt=aUI.Element({class:"RightTop"});
//  var lb=aUI.Element({class:"LeftBottom"});
//  var rb=aUI.Element({class:"RightBottom"});
//  
//  lt.appendTo(panel);
//  top.appendTo(panel);
//  rt.appendTo(panel);
//  left.appendTo(panel);
//  area.appendTo(panel);
//  right.appendTo(panel);
//  lb.appendTo(panel);
//  bottom.appendTo(panel);
//  rb.appendTo(panel);
//  
//  setAreaWidth(options.width);
//  setAreaHeight(options.height);
//  setTopHeight(options.top.height);
//  setBottomHeight(options.bottom.height);
//  setLeftWidth(options.left.width);
//  setRightWidth(options.right.width);

   var panel = aUI.Table({ class : options.class });

   var topEntry = panel.addEntry();
   topEntry.addField({ class : "LeftTop", data : "LeftTop" });
   var topField = topEntry.addField({ class : "Top" });
   var top = aUI.ScrollArea({ class : "", horizontal : "hide", vertical : "hide" });
   top.appendTo(topField);
   topEntry.addField({ class : "RightTop", data : "RightTop" });
   var middleEntry = panel.addEntry();
   var leftField = middleEntry.addField({ class : "Left" });
   var left = aUI.ScrollArea({ class : "", horizontal : "hide", vertical : "hide" });
   left.appendTo(leftField);
   var areaField = middleEntry.addField({ class : "Area" });
   var area = aUI.ScrollArea({ class : "", horizontal : options.horizontal, vertical : options.vertical });
   area.appendTo(areaField);
   var rightField = middleEntry.addField({ class : "Right" });
   var right = aUI.ScrollArea({ class : "", horizontal : "hide", vertical : "hide" });
   right.appendTo(rightField);
   var bottomEntry = panel.addEntry();
   bottomEntry.addField({ class : "LeftBottom", data : "LeftBottom" });
   var bottomField = bottomEntry.addField({ class : "Bottom" });
   var bottom = aUI.ScrollArea({ class : "", horizontal : "hide", vertical : "hide" });
   bottom.appendTo(bottomField);
   bottomEntry.addField({ class : "RightBottom", data : "RightBottom" });

   function onscroll()
   {
    var x = $(area).scrollLeft();
    var y = $(area).scrollTop();
    $(top).scrollLeft(x);
    $(left).scrollTop(y);
    $(bottom).scrollLeft(x);
    $(right).scrollTop(y);
   }
//  $(top).scroll(onscroll);
   area.onScroll(onscroll);


   function updateSize()
   {
//   alert("onresize");
//   var w=$(area).width();
//   var h=$(area).height();
//   top.setHeight(h);
//   left.setWidth(w);
//   bottom.setHeight(h);
//   right.setWidth(w);
   }

   //area.onResize(onresize);
//  onresize();

   panel.getArea = getArea;
   panel.getTop = getTop;
   panel.getBottom = getBottom;
   panel.getLeft = getLeft;
   panel.getRight = getRight;
   panel.updateSize = updateSize;
   //Возврат результата выполненого после сборки
   return panel;
  }
  catch (err) 
  {
   throw new Error("ScrollPanel(" + err.message + ")");
  }
 },
//---------------------------------------------------------------------------
 Edit : function (options)
 {
  try
  {
   //Опции по умолчанию
   options = $.extend(
   {
    class : "Edit",
    id : null,
    name : "EDIT",
    value : null,
    placeholder : null,
    examples : null,
    onkeypress : null,
    pattern : null
   }, options);
   //Функции
   function getValue() { return $(input).val(); }
   function setValue(value) { return $(input).val(value); }
   function textMode() { $(input).attr("type", "text"); }
   function passwordMode() { $(input).attr("type", "password"); }
   function setClick(onclick) { this.onclick = onclick; }
   function setFocus() { $(input).focus(); }
   function setKeyPress(fn) { $(input).keypress(fn); }
   function setOnChange(fn)
   {
    $(input).keyup(function ()
    {
     if (fn) fn(edit);
    });
   }

   //Константы
   function fnUID(char)
   {
    var r = Math.random() * 16 | 0;
    var v = char === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
   }
   var UID = "_EXAMPLES_" + "xxxxxxxxxxxxxxxx".replace(/[x]/g, fnUID);
   //Сборка
   var edit = aUI.Element({ class : options.class, id : options.id });
   edit.getValue = getValue;
   edit.setValue = setValue;
   edit.setKeyPress = setKeyPress;
   edit.setOnChange = setOnChange;
   edit.setClick = setClick;
   edit.setFocus = setFocus;
   edit.textMode = textMode;
   edit.passwordMode = passwordMode;
   var input = aUI.Element({ element : "input" });
   input.style.width = "100%";
   input.style.height = "100%";
   if (options.name)
   {
    $(input).attr("name", options.name);
    $(input).attr("list", options.name + UID);
   }
   if (options.placeholder) $(input).attr("placeholder", options.placeholder);
   edit.textMode();
   edit.setValue(options.value);
   input.appendTo(edit);


   if (options.examples)
   {
    var datalist = aUI.Element({ element : "datalist", id : options.name + UID });
    for (var q = 0; q < options.examples.length; q++)
    {
     aUI.Element({ element : "option", text : options.examples[q] }).appendTo(datalist);
    }
    datalist.appendTo(edit);
   }

   // function onKeyPress(event)
   // {
   //  var key=String.fromCharCode((event.keyCode||event.charCode));
   //  if(options.pattern)
   //  {
   ////   pattern = /[A-Za-z0-9]/;
   //   if(!key.match(options.pattern))
   //   {
   //    event.preventDefault();
   //    return;
   //   }
   //  }
   //  if(options.onkeypress)options.onkeypress(event);
   // }         
   //Возврат результата выполненого после сборки
   return edit;
  }
  catch (err) 
  {
   throw new Error("Edit(" + err.message + ")");
  }
 },
//---------------------------------------------------------------------------
 /**
  * <b>Выпадающий список.</b><br/>
  * Методы getValue и setValue возвращают и устанавливают текущее значение.<br/>
  * Метод setFocus делает компанент активным.<br/>
  * События onKeyPress и onChange.<br/>
  * @param {object} options входные данные:<br/>
  * value: текущее значение, null если нет значения<br/>
  * items: имеет разные варианты заполнения:
  * - список названий ["Название1","Название2"]. значением будет порядковый номер названия.<br/>
  * - ключи и значения {value1:"Название1",value2:"Название2"}. не гарантируется последовательность.<br/>
  * - список ключей и значений [{value:key1,text:"Название1"},{value:key2,text:"Название2"}].<br/>
  * disabled: значение невыбираемого элемента, null если нет значения<br/>
  * @returns {aUI.Element.element|Element|aUI.Select.select}
  */
 Select : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : "Select",
   id : null,
   name : null,
   value : null,
   items : null,
   disabled : null
  }, options);
  //Данные
//  var items = null;
  //Функции
  function getValue() 
  {
   var value = $(input).val(); 
   if (value === null && options.disabled === 0) value = options.disabled; //???
   console.log("select = " + value + " " + typeof(value));
   return value;
  }
  function setValue(value) { $(input).val(value); }
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
  function setItems(items, disabled)
  {
   //console.log("setItems disabled: " + disabled);
   options.items = items;
   options.disabled = disabled;
   if (items === null) return;
   if (items instanceof Array)
   {
    for (var index in items)
    {
     var item = items[index];
     if (item instanceof Object)
     {
      var option = aUI.Element({ element : "option", text : item.text });
      option.setAttr("value", item.value);
      if (item.value === disabled) option.setAttr("disabled", "");
      option.appendTo(input);
     }
     else
     {
      var option = aUI.Element({ element : "option", text : items[index] });
      option.setAttr("value", index);
      if (index === disabled) option.setAttr("disabled", "");
      option.appendTo(input);
     }
    }
   }
   else
   {
    for (var index in items)
    {
     var option = aUI.Element({ element : "option", text : items[index] });
     option.setAttr("value", index);
     if (index === disabled) option.setAttr("disabled", "");
//    $(option).attr("value", index);
//    if (index === disabled) $(option).attr("disabled", "");
     option.appendTo(input);
    }
   }
  }
// function Claer() { $(input). }

  function setFocus() { $(input).focus(); }
  //События
  function setKeyPress(fn) { $(input).keypress(fn); }
  function setChange(fn) { $(input).change(fn); }
//Сборка
  var select = aUI.Element({ class : options.class, id : options.id });
  select.getValue = getValue;
  select.setValue = setValue;
  select.setItems = setItems;
  select.setFocus = setFocus;
  select.setKeyPress = setKeyPress;
  select.setChange = setChange;
  var input = aUI.Element({ element : "select" });
  input.style.width = "100%";
  input.style.height = "100%";
  input.appendTo(select);
  $(input).attr("name", options.name);
  if (options.name) $(input).attr("name", options.name);
// console.log("disabled: " + options.disabled);
  setItems(options.items, options.disabled);
  /*if (options.items) 
   {
   for(var index in options.items)
   {
   var option = aUI.Element({ element:"option", text:options.items[index] });
   $(option).attr("value", index);
   if (index === options.disabled) $(option).attr("disabled", "");
   option.appendTo(input);
   }
   }*/
  select.setValue(options.value);
  //Возврат результата выполненого после сборки
  return select;
 },
//---------------------------------------------------------------------------
 Memo : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : "Memo",
   id : null,
   name : null,
   value : null,
   width : null,
   height : null
//  examples:[]
  }, options);
  //Функции
  function getValue() { return $(input).val(); }
  function setValue(value) { return $(input).val(value); }
  function setFocus() { $(input).focus(); }
  function setWidth(value) { $(input).width(value); }
  function setHeight(value) { $(input).height(value); }
  //События
  function setKeyPress(fn) { $(input).keypress(fn); }
  //Сборка
  var memo = aUI.Element({ class : options.class, id : options.id });
  memo.getValue = getValue;
  memo.setValue = setValue;
  memo.setKeyPress = setKeyPress;
  memo.setFocus = setFocus;
  memo.setWidth = setWidth;
  memo.setHeight = setHeight;
  var input = aUI.Element({ element : "textarea" });
  if (options.name) $(input).attr("name", options.name);
// input.style.width="100%";
// input.style.height="100%";
  memo.setValue(options.value);
  if (options.width) memo.setWidth(options.width);
  if (options.height) memo.setHeight(options.height);
  input.appendTo(memo);

  //Возврат результата выполненого после сборки
  return memo;
 },
//---------------------------------------------------------------------------
 TableEntry : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : null
  }, options);
  //Функции
  function addField(params)
  {
   var field = aUI.Element({ element : "td", class : params.class, html : params.data });
   field.appendTo(entry);
   return field;
  }
  //Сборка
  var entry = aUI.Element({ element : "tr", class : options.class });
  entry.addField = addField;
  //Возврат результата выполненого после сборки
  return entry;
 },
//---------------------------------------------------------------------------
 Table : function (options)
 {
  //Опции по умолчанию
  options = $.extend(
  {
   class : null
  }, options);
  //Функции
  function addEntry(params)
  {
   var entry = aUI.TableEntry(params);
   entry.appendTo(tbody);
   return entry;
  }
  //Сборка
  var table = aUI.Element({ element : "table", class : options.class });
  var tbody = aUI.Element({ element : "tbody" });
  tbody.appendTo(table);
  table.addEntry = addEntry;
  //Возврат результата выполненого после сборки
  return table;
 },
//---------------------------------------------------------------------------
 Form : function (options)
 {
  try
  {
   //Опции по умолчанию
   options = $.extend(
   {
    id : null,
    caption : "Form",
    width : 600,
    height : 400,
    border : 5,
    buttons : []
   }, options);
   //Функции
   function close() {
    $(formBase).remove();
   }
   function getContent() {
    return formContent;
   }
   function setWidth(value)
   {
    form.setWidth(value);
   }
   function setHeight(value)
   {
    form.setHeight(value);
   }
   function update()
   {
    setWidth(options.width);
    setHeight(options.height);
    var dx = options.width / 2;
    var dy = options.height / 2;
    $(form).css("position", "fixed");
    $(form).css("left", "50%");
    $(form).css("top", "50%");
    $(form).css("margin-left", "-" + dx + "px");
    $(form).css("margin-top", "-" + dy + "px");


   }
   //Сборка
   var formBase = aUI.Element({ class : "FormBase", id : options.id });
   formBase.close = close;
   formBase.getContent = getContent;
   formBase.setWidth = setWidth;
   formBase.setHeight = setHeight;

   aUI.Element({ class : "FormOverlay" }).appendTo(formBase);
   var border = aUI.Element({ class : "FormBorder" });
   border.appendTo(formBase);
   var form = aUI.Element({ class : "Form" });
   form.prependTo(formBase);
   //Заголовок
   var formHeader = aUI.Element({ class : "Caption" });
   formHeader.appendTo(form);
   var headerItem = aUI.Element({ class : "Item" });
   headerItem.appendTo(formHeader);
   aUI.Element({ class : "Name", text : options.caption }).appendTo(headerItem);
   var headerSys = aUI.Element({ class : "SysItem" });
   headerSys.appendTo(formHeader);
   aUI.Button({ class : "Btn", "caption" : "X", onclick : formBase.close }).appendTo(headerSys);
   //Содержимое
   var formContent = aUI.Element({ class : "Content" });
   formContent.appendTo(form);
//  form.content = formContent;
   //Кнопки
   var formButtons = aUI.Element({ class : "Field Buttons" });
   formButtons.appendTo(form);
   for (var i = 0; i < options.buttons.length; i++)
   {
    var param = options.buttons[i];
    if ((typeof param.onclick) === "string")
    {
     if (param.onclick === "close") param.onclick = formBase.close;
    }
    aUI.Button(param).appendTo(formButtons);
   }
   //Размер и позиция
//  setWidth(options.width);
//  setHeight(options.height);
//  var dx=options.width/2;
//  var dy=options.height/2;
//  $(form).css("position","fixed");
//  $(form).css("left","50%");
//  $(form).css("top","50%");
//  $(form).css("margin-left","-"+dx+"px");
//  $(form).css("margin-top","-"+dy+"px");
   update();

//  alert($(form).height());


   //Возврат результата выполненого после сборки
   return formBase;
  }
  catch (err) {
   throw new Error("Form(" + err.message + ")");
  }
 },
//---------------------------------------------------------------------------
 Layer : function (options)
 {
  try
  {
   //Опции по умолчанию
   options = $.extend(
   {
    id : null,
    class : "Layer",
    caption : "Layer",
    buttons : []
   }, options);
   //Функции
   function close() {
    $(formBase).remove();
   }
   function getContent() {
    return layerContent;
   }
//   function setWidth(value)
//   {
//    form.setWidth(value);
//   }
//   function setHeight(value)
//   {
//    form.setHeight(value);
//   }
   function update()
   {
//    setWidth(options.width);
//    setHeight(options.height);
//    var dx = options.width / 2;
//    var dy = options.height / 2;

//    layer.setWidth();???

//    $(layer).css("position", "fixed");
//    $(layer).css("left", "50%");
//    $(layer).css("top", "50%");
//    $(layer).css("margin-left", "-" + dx + "px");
//    $(layer).css("margin-top", "-" + dy + "px");


   }
   //Сборка
   var formBase = aUI.Element({ class : "LayerBase", id : options.id });
   formBase.close = close;
   formBase.getContent = getContent;
//   formBase.setWidth = setWidth;
//   formBase.setHeight = setHeight;

   aUI.Element({ class : "LayerOverlay" }).appendTo(formBase);
//   var border = aUI.Element({ class : "FormBorder" });
//   border.appendTo(formBase);
   var layer = aUI.Element({ class : options.class });
   layer.prependTo(formBase);
   //Заголовок
   var formHeader = aUI.Element({ class : "Caption" });
   formHeader.appendTo(layer);
   var headerItem = aUI.Element({ class : "Item" });
   headerItem.appendTo(formHeader);
   aUI.Element({ class : "Name", text : options.caption }).appendTo(headerItem);
   var headerSys = aUI.Element({ class : "SysItem" });
   headerSys.appendTo(formHeader);
   aUI.Button({ class : "Btn", "caption" : "X", onclick : formBase.close }).appendTo(headerSys);
   //Содержимое
   var layerContent = aUI.Element({ class : "Content" });
   layerContent.appendTo(layer);
//  form.content = formContent;
   //Кнопки
   var formButtons = aUI.Element({ class : "Field Buttons" });
   formButtons.appendTo(layer);
   for (var i = 0; i < options.buttons.length; i++)
   {
    var param = options.buttons[i];
    if ((typeof param.onclick) === "string")
    {
     if (param.onclick === "close") param.onclick = formBase.close;
    }
    aUI.Button(param).appendTo(formButtons);
   }
   update();

  //Возврат результата выполненого после сборки
   return formBase;
  }
  catch (err) {
   throw new Error("Form(" + err.message + ")");
  }
 },
//---------------------------------------------------------------------------
 Popup : function (options)
 {
  try
  {
   //Опции по умолчанию
   options = $.extend(
   {
    id : null,
    caption : "Form",
    width : 200,
    height : 100,
    buttons : []
   }, options);
   //Функции
   function close() { $(popupBase).remove(); }
   function getContent() { return formContent; }
   function setWidth(value) { form.setWidth(value); }
   function setHeight(value) { form.setHeight(value); }
   //Сборка
   var popupBase = aUI.Element({ class : "PopupBase", id : options.id });
   popupBase.close = close;
   popupBase.getContent = getContent;
   popupBase.setWidth = setWidth;
   popupBase.setHeight = setHeight;

   aUI.Element({ class : "PopupOverlay" }).appendTo(popupBase);
   // aUI.Element({class:"PopupBorder"}).appendTo(formBase);
   var form = aUI.Element({ class : "Popup" });
   form.prependTo(popupBase);
   //Заголовок
   var formHeader = aUI.Element({ class : "Caption" });
   formHeader.appendTo(form);
   var headerItem = aUI.Element({ class : "Item" });
   headerItem.appendTo(formHeader);
   aUI.Element({ class : "Name", text : options.caption }).appendTo(headerItem);
   var headerSys = aUI.Element({ class : "SysItem" });
   headerSys.appendTo(formHeader);
   aUI.Button({ class : "Btn", "caption" : "X", onclick : popupBase.close }).appendTo(headerSys);
   //Содержимое
   var formContent = aUI.Element({ class : "Content" });
   formContent.appendTo(form);
   //Кнопки
   var formButtons = aUI.Element({ class : "Field Buttons" });
   formButtons.appendTo(form);
   for (var i = 0; i < options.buttons.length; i++)
   {
    var param = options.buttons[i];
    if ((typeof param.onclick) === "string")
    {
     if (param.onclick === "close") param.onclick = popupBase.close;
    }
    aUI.Button(param).appendTo(formButtons);
   }
   //Размер и позиция
   setWidth(options.width);
   setHeight(options.height);
   var dx = options.width / 2;
   var dy = options.height / 2;
   $(form).css("position", "fixed");
   $(form).css("left", "50%");
   $(form).css("top", "50%");
   $(form).css("margin-left", "-" + dx + "px");
   $(form).css("margin-top", "-" + dy + "px");

//  alert($(form).height());


   //Возврат результата выполненого после сборки
   return popupBase;
  }
  catch (err) 
  {
   throw new Error("Form(" + err.message + ")");
  }
 }
//---------------------------------------------------------------------------
};

