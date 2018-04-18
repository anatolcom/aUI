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
        Object.defineProperty(this, 'appendTo', { value : this.owerrideAppendTo.bind(this, this.appendTo) });
        Object.defineProperty(this, 'text', { value : this.text.bind(this) });
        Object.defineProperty(this, 'html', { value : this.html.bind(this) });
//Сборка
        if (options.text || options.text === 0 || options.text === false) this.text(options.text);
//if (options.html || options.html === 0 || options.html === false) this.html(options.html);
        if (options.width || options.width === 0) this.width(options.width);
        if (options.height || options.height === 0) this.height(options.height);
    }
    core.proto(Element, core.BaseElement);

    Element.prototype.owerrideAppendTo = function(appendTo, parent)
    {
        appendTo(parent);
        this.resize();
        return this;
    };
    Element.prototype.text = function(text)
    {
        if (text === undefined) return this.getElement().textContent;
        this.getElement().textContent = text;
    };
    Element.prototype.html = function(html)
    {
        if (html === undefined) return this.getElement().innerHTML;
        this.getElement().innerHTML = html;
    };

    return Element;
//---------------------------------------------------------------------------
});