define([ "aui/core", "./Element", "aui/utils", "aui/validators",
    "./Button",
    "./Edit",
    "./Popup",
    "./Calendar" ],
function(core, Element, utils, validators,
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
            validator : new validators.Pattern("((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).[0-9]{4})"),
            icon : "<svg viewbox=\"0 0 100 100\"><g><path id=\"calendar\" d=\"M85,0v10H70V0H30v10H15V0H0v100h100V0H85z M95,95H5V30h90V95z M45,50H35V40h10V50z M65,50H55V40h10V50z M85,50H75V40h10V50 z M25,65H15V55h10V65z M45,65H35V55h10V65z M65,65H55V55h10V65z M85,65H75V55h10V65z M25,80H15V70h10V80z M45,80H35V70h10V80z M65,80H55V70h10V80z\"/></g></svg>"
        }, options);
        Element.call(this, options);
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
                edit.value(utils.dateToStr(this.value(), options.mask));
                popup.remove();
            }
            var popup = new Popup().appendTo(that);
            popup.onRemove(btn.unselect);
            var calendar = new Calendar();
            calendar.value(utils.strToDate(edit.value(), options.mask));
            calendar.onClickDay(select);
            calendar.appendTo(popup);
            btn.select();
        }
        this.mask = function (value)
        {
            if (value === undefined) return options.mask;
            options.mask = value;
        };
//Сборка
        var edit = new Edit({ required : true }).appendTo(this);
        edit.validator(options.validator);
        edit.value(utils.dateToStr(new Date(), options.mask));
        var btn = new Button({ onclick : click }).appendTo(this);
        btn.html(options.icon);

        this.value = edit.value;
        this.invalid = edit.invalid;
    }
    core.proto(DateSelector, Element);
//---------------------------------------------------------------------------
    return DateSelector;
//---------------------------------------------------------------------------
});