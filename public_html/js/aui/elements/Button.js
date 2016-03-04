define([ "aui/core", "./Element", "aui/extensions" ],
function(core, Element, extensions)
{
//---------------------------------------------------------------------------
    /*
     * <b>Кнопка.<b><br/>
     * @param {object} options параметры:<br/>
     * @returns {Button}
     */
    function Button(options)
    {
//Опции
        options = core.extend(
        {
            element : "div",
            class : "button",
            onclick : null,
            data : null
        }, options);
        Element.call(this, options);
        extensions.clickable(this);
        extensions.selectable(this);
//Переменные
        this.data = options.data;
//Функции
//Сборка
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Button, Element);

    return Button;
//---------------------------------------------------------------------------
});