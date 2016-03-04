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
        this.onScroll = function(fn)
        {
            that.getElement().onscroll = fn;
        };
//    this.onResize = function(fn)
//    {
//        that.getElement().onresize = fn;
//    };
        this.horizontalScrollBar = function(type)
        {
            var x = that.getElement().style.overflowX;
            switch (type)
            {
                case "auto":
                    x = "auto";
                    break;
                case "scroll":
                    x = "scroll";
                    break;
                case "hidden":
                    x = "hidden";
                    break;
                case "show":
                    x = "scroll";
                    break;
                case "hide":
                    x = "hidden";
                    break;
                default:
                    throw new Error("Unknow horizontal type " + type);
            }
            that.getElement().style.overflowX = x;
        };
        this.verticalScrollBar = function(type)
        {
            var y = that.getElement().style.overflowY;
            switch (type)
            {
                case "auto":
                    y = "auto";
                    break;
                case "scroll":
                    y = "scroll";
                    break;
                case "hidden":
                    y = "hidden";
                    break;
                case "show":
                    y = "scroll";
                    break;
                case "hide":
                    y = "hidden";
                    break;
                default:
                    throw new Error("Unknow vertical type " + type);
            }
            that.getElement().style.overflowY = y;
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