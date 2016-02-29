define([ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    /**
     * <b>Выпадающий список.</b><br/>
     * Метод value возвращает и устанавливает текущее значение.<br/>
     * Метод focus делает компанент активным.<br/>
     * @param {object} options входные данные:<br/>
     * value: текущее значение, null если нет значения<br/>
     * items: имеет разные варианты заполнения:
     * - список названий ["Название1","Название2"]. значением будет порядковый номер названия.<br/>
     * - ключи и значения {value1:"Название1",value2:"Название2"}. не гарантируется последовательность.<br/>
     * - список ключей и значений [{value:key1,text:"Название1"},{value:key2,text:"Название2"}].<br/>
     * disabled: значение невыбираемого элемента, null если нет значения<br/>
     * @returns {Select}
     */
    Select = function Select(options)
    {
//Опции
        options = core.extend(
        {
            element : "select",
            value : null,
            items : null,
            disabled : null,
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
        /**
         * <b>Установка полей.</b><br/>
         * допустимы разные варианты заполнения полей:<br/>
         * - <b>список названий</b> ["Название1","Название2"]. значением будет порядковый номер названия.<br/>
         * - <b>ключи и значения</b> {value1:"Название1",value2:"Название2"}. не гарантируется последовательность.<br/>
         * - <b>список ключей и значений</b> [{value:key1,text:"Название1"},{value:key2,text:"Название2"}].<br/>
         * @param {type} items поля выпадающего списка.
         * @param {type} disabled значение невыбираемого элемента, null если нет значения<br/>
         * @returns {undefined}
         */
        this.items = function(items, disabled)
        {
            options.value = this.value();
            that.clear();
            options.items = items;
            if (disabled === undefined) disabled = null;
            if (disabled === null) options.disabled = null;
            else disabled = String(disabled);
            options.disabled = disabled;
            if (items === null) return;
            if (items instanceof Array)
            {
                for (var index in items)
                {
                    var item = items[index];
                    var option = new core.Element({ element : "option" });
                    if (item instanceof Object)
                    {
                        option.text(item.text);
                        option.attr("value", item.value);
                        if (item.value === disabled) option.attr("disabled", "");
                    }
                    else
                    {
                        option.text(items[index]);
                        option.attr("value", index);
                        if (index === disabled) option.attr("disabled", "");
                    }
                    option.appendTo(that);
                }
            }
            else
            {
                for (var index in items)
                {
                    var option = new core.Element({ element : "option", text : items[index] });
                    option.attr("value", index);
                    if (index === disabled) option.attr("disabled", "");
                    option.appendTo(that);
                }
            }
            this.value(options.value);
        };
        this.focus = function()
        {
            that.getElement().focus();
        };
//Сборка
        if (options.type) this.type(options.type);
        if (options.required) this.required(options.required);
        this.value(options.value);
        this.items(options.items, options.disabled);
    };
    core.proto(Select, core.Element);
//---------------------------------------------------------------------------
    return Select;
//---------------------------------------------------------------------------
});