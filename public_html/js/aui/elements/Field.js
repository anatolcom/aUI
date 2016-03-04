define([ "aui/core", "./Element" ],
function(core, Element)
{
//---------------------------------------------------------------------------
    function Field(options)
    {
//Опции
        options = core.extend(
        {
            class : "field",
            caption : null
        }, options);
        Element.call(this, options);
//Переменные
//    var that = this;
//Функции
//Сборка
//        this.caption = new Element({ class : "caption" }).appendTo(this);
        var caption = new Element({ class : "caption" }).appendTo(this);
        var value = new Element({ class : "value" }).appendTo(this);
        Object.defineProperty(this, "caption",
        {
            get : function()
            {
                return caption;
            }
        });
        Object.defineProperty(this, "value",
        {
            get : function()
            {
                return value;
            }
        });
        if (options.caption) caption.text(options.caption);

    }
    core.proto(Field, Element);
//---------------------------------------------------------------------------



    return Field;
//---------------------------------------------------------------------------
});