define([ "aui/core", "aui/extension" ],
function(core, extension)
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
            placeholder : null,
            examples : null,
            required : false
        }, options);
        core.Element.call(this, options);
        extension.validable(this);
//Переменные
        var that = this;
//Функции
        this.value = function(value)
        {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
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
//if (value === undefined) return that.attr("placeholder");
            that.getElement().focus();
        };
        function fnUID(char)
        {
            var r = Math.random() * 16 | 0;
            var v = char === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
//Сборка
        if (options.type) this.type(options.type);
        if (options.required) this.required(options.required);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
        if (options.examples)
        {
            var id = "INPUT_" + "xxxxxxxxxxxxxxxx".replace(/[x]/g, fnUID);
            this.attr("list", id);
            var datalist = new core.Element({ element : "datalist", id : id }).appendTo(this);
            for (var index in options.examples)
            {
                new core.Element({ element : "option", text : options.examples[index] }).appendTo(datalist);
            }
        }
    }
    core.proto(Edit, core.Element);
//---------------------------------------------------------------------------
    return Edit;
//---------------------------------------------------------------------------
});