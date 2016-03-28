define(["aui/core", "./Element"],
function(core, Element)
{
//---------------------------------------------------------------------------
    /**
     * <b>Элемент спиока ViewSet.</b><br/>
     * @param {type} options параметры:<br/>
     * @returns {View}
     * @see List
     */
    function View(options)
    {
//Опции
        options = core.extend(
        {
            element : "div",
            class : null,
            onchangeselected : null
        }, options);
        Element.call(this, options);
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
        if (options.onchangeselected) this.onChangeSelected(options.onchangeselected);
    }
    core.proto(View, Element);
//-------------------------------------------------------------------------------------------------------------------
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
            element : "div",
            id : null,
            class : "viewSet",
            viewConstructor : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var viewConstructor = View;
//Функции
        this.viewConstructor = function(constructor)
        {
            if (constructor === undefined) return viewConstructor;
            if (typeof constructor !== "function") throw new Error("constructor not function");
            if (!constructor instanceof View) throw new Error("constructor not proto aUI.ListItem");
            viewConstructor = constructor;
        };
        this.add = function()
        {
            var item = core.construct(that.viewConstructor(), arguments);
            item.hidden(that.count() > 0);
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
        this.view = function(index)
        {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++)
            {
                var item = nodes[q].aui;
                item.hidden(index !== q);
            }
        };
//Сборка
        if (options.viewConstructor) this.viewConstructor(options.viewConstructor);
    };
    core.proto(List, Element);
//-------------------------------------------------------------------------------------------------------------------
    List.Item = View;
//-------------------------------------------------------------------------------------------------------------------
    return List;
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
});

