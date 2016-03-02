define([ "aui/core", "aui/extensions" ],
function(core, extensions)
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
        core.Element.call(this, options);
        extensions.clickable(this);
        extensions.selectable(this);
//Переменные
        this.data = options.data;
//Функции
//Сборка
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Button, core.Element);

    return Button;
//---------------------------------------------------------------------------
});