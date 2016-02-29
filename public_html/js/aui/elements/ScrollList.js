define([ "aui/core", "aui/elements/List", "aui/elements/ScrollArea" ],
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