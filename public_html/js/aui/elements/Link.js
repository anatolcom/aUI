define([ "aui/core", "aui/extension" ],
function(core, extension)
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
        core.Element.call(this, options);
        extension.clickable(this);
//Переменные
//Функции
//Сборка
        if (options.href) this.attr("href", options.href);
        if (options.onclick) this.onClick(options.onclick);
    }
    core.proto(Link, core.Element);

    return Link;
//-------------------------------------------------------------------------------------------------------------------
});