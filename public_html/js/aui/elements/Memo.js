define([ "aui/core", "./Element", "aui/extensions" ],
function(core, Element, extensions)
{
//---------------------------------------------------------------------------
    function Memo(options)
    {
//Опции
        options = core.extend(
        {
            element : "textarea",
            required : false
        }, options);
        Element.call(this, options);
        extensions.validable(this);
//Переменные
        var that = this;
//Функции
        this.value = function(value)
        {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        };
        this.placeholder = function(value)
        {
            if (value === undefined) return that.attr("placeholder");
            that.attr("placeholder", value);
        };
        this.maxLength = function(value)
        {
            if (value === undefined) that.getElement().maxLength;
            that.getElement().maxLength = value;
        };
        this.focus = function()
        {
            that.getElement().focus();
        };
//Сборка
        if (options.required) this.required(options.required);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
    }
    core.proto(Memo, Element);
    /*Memo : function (options)
     {
     //Опции по умолчанию
     options = $.extend(
     {
     class : "Memo",
     }, options);
     //Функции
     function setFocus() { $(input).focus(); }
     //События
     function setKeyPress(fn) { $(input).keypress(fn); }
     //Сборка
     var memo = Element({ class : options.class, id : options.id });
     memo.setKeyPress = setKeyPress;
     memo.setFocus = setFocus;
     var input = Element({ element : "textarea" });
     if (options.name) $(input).attr("name", options.name);
     memo.setValue(options.value);
     input.appendTo(memo);
     
     //Возврат результата выполненого после сборки
     return memo;
     },*/
//---------------------------------------------------------------------------
    return Memo;
//---------------------------------------------------------------------------
});