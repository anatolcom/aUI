define([ "aui/core", "./Element", "./Button"],
function(core, Element, Button)
{
//---------------------------------------------------------------------------
    /**
     * <b>Элемент спиока List.</b><br/>
     * @param {type} options параметры:<br/>
     * @returns {Item}
     * @see List
     */
    function Item(options)
    {
//Опции
        options = core.extend(
        {
            element : "li",
            class : null,
            onchangeselected : null
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
        if (options.onchangeselected) this.onChangeSelected(options.onchangeselected);
    }
    core.proto(Item, Button);
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
            element : "ul",
            id : null,
            class : null,
            itemConstructor : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var itemConstructor = Item;
//Функции
        this.itemConstructor = function(constructor)
        {
            if (constructor === undefined) return itemConstructor;
            if (typeof constructor !== "function") throw new Error("constructor not function");
            if (!constructor instanceof Item) throw new Error("constructor not proto aUI.ListItem");
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
    core.proto(List, Element);
//-------------------------------------------------------------------------------------------------------------------
    List.Item = Item;
//-------------------------------------------------------------------------------------------------------------------
    return List;
//---------------------------------------------------------------------------
});