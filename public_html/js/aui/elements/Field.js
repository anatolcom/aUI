define([ "aui/core" ],
function(core)
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
        core.Element.call(this, options);
//Переменные
//    var that = this;
//Функции
//Сборка
//        this.caption = new core.Element({ class : "caption" }).appendTo(this);
        var caption = new core.Element({ class : "caption" }).appendTo(this);
        var value = new core.Element({ class : "value" }).appendTo(this);
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
    core.proto(Field, core.Element);
//---------------------------------------------------------------------------



    return Field;
//---------------------------------------------------------------------------
});