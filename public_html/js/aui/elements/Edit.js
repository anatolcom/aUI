define([ "aui/core", "./Element", "aui/extensions" ],
function(core, Element, extensions)
{
//---------------------------------------------------------------------------
    /**
     * <b>Строковое поле редактирования.</b><br/>
     * @param {object} options параметры:<br/>
     * - <b>element:</b> название элемента "input".<br/>
     * - <b>pattern:</b> регулярное выражение.<br/>
     * - <b>required:</b> обязательность наличия значения.<br/>
     * @returns {Edit}
     */
    function Edit(options)
    {
//Опции
        options = core.extend(
        {
            element : "input",
            type : null,
            value : null,
            placeholder : null,
            examples : null,
            required : false,
            onchange : null
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
            that.validate();
        };
        this.type = function(value)
        {
            if (value === undefined) return that.attr("type");
            that.attr("type", value);
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
        this.onChange = function(fn)
        {
            if (fn === undefined) return options.onchange;
            if (typeof fn !== "function") throw new Error("onChange is not function");
            options.onchange = fn;
        };
        function fnUID(char)
        {
            var r = Math.random() * 16 | 0;
            var v = char === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
        function setExamples(examples)
        {
            var id = "INPUT_" + "xxxxxxxxxxxxxxxx".replace(/[x]/g, fnUID);
            that.attr("list", id);
            var datalist = new Element({ element : "datalist", id : id }).appendTo(that);
            for (var index in examples)
            {
                new Element({ element : "option", text : examples[index] }).appendTo(datalist);
            }
        }
//Сборка
        if (options.type) this.type(options.type);
        if (options.value !== undefined) this.value(options.value);
        if (options.required) this.required(options.required);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
        if (options.examples) setExamples(options.examples);
        if (options.onchange) this.onChange(options.onchange);
        core.addEvent(this.getElement(), "keyup", function()
        {
            if (options.onchange) options.onchange.call(that);
        });
    }
    core.proto(Edit, Element);
//---------------------------------------------------------------------------
    return Edit;
//---------------------------------------------------------------------------
});