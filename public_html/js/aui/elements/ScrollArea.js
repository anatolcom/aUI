define([ "aui/core", "./Element" ],
function(core, Element)
{
//---------------------------------------------------------------------------
    /**
     * <b>Область прокрутки.</b><br/>
     * Методы horizontalScrollBar и verticalScrollBar управляют видимостью полос прокрутки.<br/>
     * вырианты:<br/>
     * - auto : показывать при необходимости.<br/>
     * - show : показывать всегда,<br/>
     * - hide : скрывать всегда,<br/>
     * События onScroll и onResize.<br/>
     * @param {object} options настройки:<br/>
     * - <b>height:</b> {number} высота<br/>
     * - <b>width:</b> {number} ширина<br/>
     * - <b>horizontal:</b> {string} горизонтальная полоса прокрутки. варианты: "auto", "show", "hide"<br/>
     * - <b>vertical:</b> {string} вертикальная полоса прокрутки. варианты: "auto", "show", "hide"<br/>
     * @returns {ScrollArea}
     */
    function ScrollArea(options)
    {
//Опции по умолчанию
        options = core.extend(
        {
            height : null,
            width : null,
            horizontal : "auto",
            vertical : "auto"
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
//Функции
        function scrollType(type)
        {
            switch (type)
            {
                case "auto":
                    return type;
                case "scroll":
                    return type;
                case "hidden":
                    return type;
                case "show":
                    return "scroll";
                case "hide":
                    return "hidden";
                default:
                    throw new Error("Unknow type: \"" + type + "\"");
            }
        }
        this.onScroll = function(fn)
        {
            if (fn === undefined) return that.getElement().onscroll;
            if (typeof fn !== "function" && fn !== null) throw new Error("fn for onScroll not a function");
            that.getElement().onscroll = fn;
        };
        this.horizontalScrollBar = function(type)
        {
            if (type === undefined) return that.getElement().style.overflowX;
            that.getElement().style.overflowX = scrollType(type);
        };
        this.verticalScrollBar = function(type)
        {
            if (type === undefined) that.getElement().style.overflowY;
            that.getElement().style.overflowY = scrollType(type);
        };
//Сборка
        this.getElement().style.overflow = "auto";
        this.horizontalScrollBar(options.horizontal);
        this.verticalScrollBar(options.vertical);
        this.height(options.height);
        this.width(options.width);
    }
    core.proto(ScrollArea, Element);
//---------------------------------------------------------------------------
    return ScrollArea;
//---------------------------------------------------------------------------
});