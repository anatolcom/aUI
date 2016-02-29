define([ "aui/aUI", "aui/aUtils" ],
function(aUI, aUtils)
{
//-------------------------------------------------------------------------------------------------------------------
    var validator = { };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * <b>Паттерн.</b><br/>
     * @param {string} value регулярное выражение<br/>
     * @returns {Pattern}
     */
    validator.Pattern = function Pattern(value)
    {
//Переменные
        var pattern = null;
        var expression = null;
//Функции
        this.pattern = function(value)
        {
            if (value === undefined) return pattern;
            pattern = value;
            if (!pattern) expression = null;
            else expression = new RegExp(pattern, "");
        };
        this.validate = function(value)
        {
            if (expression === null) return true;
            var match = value.match(expression);
            if (!match) return false;
            return match[0] === value;
        };
//Сборка
        this.pattern(value);
    };
//-------------------------------------------------------------------------------------------------------------------
    return validator;
//-------------------------------------------------------------------------------------------------------------------
});