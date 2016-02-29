define([ "aui/core", "aui/elements/Button" ],
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