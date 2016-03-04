define([ "aui/core", "./Element", "aui/extensions" ],
function(core, Element, extensions)
{
//---------------------------------------------------------------------------
    function Link(options)
    {
//Опции
        options = core.extend(
        {
            element : "a",
            href : "javascript:",
            onclick : null
        }, options);
        Element.call(this, options);
        extensions.clickable(this);
//Переменные
//Функции
//Сборка
        if (options.href) this.attr("href", options.href);
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Link, Element);

    return Link;
//-------------------------------------------------------------------------------------------------------------------
});