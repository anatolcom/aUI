define([ "aui/core", "aui/aUtils", "aui/validator",
    "aui/elements/Button",
    "aui/elements/Edit",
    "aui/elements/Popup",
    "aui/elements/Calendar" ],
function(core, aUtils, validator,
Button,
Edit,
Popup,
Calendar)
{
//---------------------------------------------------------------------------
    function DateSelector(options)
    {
//Опции
        options = core.extend(
        {
            class : "dateSelector",
            mask : "dd.MM.yyyy",
            validator : new validator.Pattern("((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).[0-9]{4})")
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
//Функции
        function click()
        {
            var btn = this;
            if (btn.selected())
            {
                btn.unselect();
                return;
            }
            function select()
            {
                edit.value(aUtils.dateToStr(this.value(), options.mask));
                popup.remove();
            }
            var popup = new Popup().appendTo(that);
            popup.onRemove(btn.unselect);
            var calendar = new Calendar();
            calendar.value(aUtils.strToDate(edit.value(), options.mask));
            calendar.onClickDay(select);
            calendar.appendTo(popup);
            btn.select();
        }
//Сборка
        var edit = new Edit({ required : true }).appendTo(this);
        edit.validator(options.validator);
        edit.value(aUtils.dateToStr(new Date(), options.mask));
        var btn = new Button({ text : "...", onclick : click }).appendTo(this);
//    var btn = new aUI.Button({ onclick : click }).appendTo(this);

        this.value = edit.value;
        this.invalid = edit.invalid;
    }
    core.proto(DateSelector, core.Element);
//---------------------------------------------------------------------------
    return DateSelector;
//---------------------------------------------------------------------------
});