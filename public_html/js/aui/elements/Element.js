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
        var element = this.getElement();
//События
        var onresize = null;
//Функции
        this.text = function(text)
        {
            if (text === undefined) return that.getElement().textContent;
            that.getElement().textContent = text;
        };
//    this.html = function(html)
//    {
//        if (html === undefined) return that.getElement().innerHtml;
//        that.getElement().innerHtml = html;
//    };
/*        this.left = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginLeft = parseInt(computedStyle.marginLeft, 10);
                return that.getElement().offsetLeft - marginLeft;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.left = value;
        };
        this.right = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginRight = parseInt(computedStyle.marginRight, 10);
                return that.getElement().offsetRight - marginRight;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.right = value;
        };
        this.top = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginTop = parseInt(computedStyle.marginTop, 10);
                return that.getElement().offsetTop - marginTop;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.top = value;
        };
        this.bottom = function(value)
        {
            if (value === undefined)
            {
                var computedStyle = window.getComputedStyle(that.getElement());
                var marginBottom = parseInt(computedStyle.marginBottom, 10);
                return that.getElement().offsetBottom - marginBottom;
            }
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            that.getElement().style.bottom = value;
        };
        this.width = function(value)
        {
            if (value === undefined) return element.offsetWidth;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.width = value;
            if (onresize) onresize.call(that);
        };
        this.height = function(value)
        {
            if (value === undefined) return element.offsetHeight;
            if (value === null) value = "";
            if (typeof value === "number") value += "px";
            element.style.height = value;
            if (onresize) onresize.call(that);
        };
        this.clientWidth = function(value)
        {
            if (value === undefined) return element.clientWidth;
        };
        this.clientHeight = function(value)
        {
            if (value === undefined) return element.clientHeight;
        };
        this.onResize = function(fn)
        {
            if (fn === undefined) return onresize;
            if (typeof fn !== "function") throw new Error("fn for onResize not a function");
            onresize = fn;
        };
        this.resize = function()
        {
            if (onresize) onresize.call(that);
        };*/
//Сборка
        if (options.text || options.text === 0 || options.text === false) this.text(options.text);
//if (options.html || options.html === 0 || options.html === false) this.html(options.html);
//aUI.extensions.resizable(this);
        if (options.width || options.width === 0) this.width(options.width);
        if (options.height || options.height === 0) this.height(options.height);
//        core.addEvent(element, "resize", this.resize);
    }
    core.proto(Element, core.BaseElement);

    return Element;
//---------------------------------------------------------------------------
});