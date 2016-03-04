define([ "aui/core", "./Element", "./List", "./ScrollList", "./SItem" ],
function(core, Element, List, ScrollList, SItem)
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
        Element.call(this, options);
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
    core.proto(SList, Element);
//---------------------------------------------------------------------------
   return SList;
//---------------------------------------------------------------------------
});