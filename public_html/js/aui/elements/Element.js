define([ "aui/core", "aui/extensions" ],
function(core, extensions)
{
//---------------------------------------------------------------------------
    /**
     * <b>Элемент DOM браузера.</b><br/>
     * По умолчанию div.<br/>
     * @param {object} options параметры:<br/>
     * - <b>element:</b> название элемента, например "div" или "span"<br/>
     * - <b>id:</b> id элемента, например для привязки стилей через "#".<br/>
     * - <b>class:</b> класс элемента, например для привязки стилей через ".".<br/>
     * - <b>text:</b> содержимое элемента в виде текста.<br/>
     * - <b>html:</b> содержимое элемента ввиде HTML данных.<br/>
     * @returns {Element}
     */
    function Element(options)
    {
//Опции
        options = core.extend(
        {
            text : null
//        html : null
        }, options);
        core.BaseElement.call(this, options);
        extensions.sizable(this);
//Переменные
        var that = this;
//События
//Функции
        var appendTo = this.appendTo;
        this.appendTo = function(parent)
        {
            appendTo(parent);
            that.resize();
            return that;
        };
        this.text = function(text)
        {
            if (text === undefined) return that.getElement().textContent;
            that.getElement().textContent = text;
        };
        this.html = function(html)
        {
            if (html === undefined) return that.getElement().innerHTML;
            that.getElement().innerHTML = html;
        };
//Сборка
        if (options.text || options.text === 0 || options.text === false) this.text(options.text);
//if (options.html || options.html === 0 || options.html === false) this.html(options.html);
        if (options.width || options.width === 0) this.width(options.width);
        if (options.height || options.height === 0) this.height(options.height);
    }
    core.proto(Element, core.BaseElement);

    return Element;
//---------------------------------------------------------------------------
});