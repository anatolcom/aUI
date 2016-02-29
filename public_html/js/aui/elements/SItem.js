define([ "aui/core", "aui/elements/ListItem" ],
function(core, ListItem)
{
//---------------------------------------------------------------------------
    function SItem(options)
    {
//Опции
        options = core.extend(
        {
        }, options);
        ListItem.call(this, options);
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
        var caption = new core.Element({ class : "caption" }).appendTo(this);
        var content = new core.Element({ class : "content" }).appendTo(this);
    };
    core.proto(SItem, ListItem);
//---------------------------------------------------------------------------
    return SItem;
//---------------------------------------------------------------------------
});