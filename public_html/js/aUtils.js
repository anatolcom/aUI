/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var aUtils = { };
//------------------------------------------------------------------------------------------------------------------- 
aUtils.dateToStr = function(date, format)
{
    if (!format) return "";
    function toLStr(number, length)
    {
        var value = String(number);
        while (value.length < length) value = "0" + value;
        return value;
    }
    function replace(mask, value, len)
    {
        return value.replace(new RegExp(mask), toLStr(value, len));
    }
    function fill(value, date)
    {
        value = replace("yyyy", date.getFullYear(), 4);
        value = replace("MM", date.getMonth() + 1, 2);
        value = replace("dd", date.getDate(), 2);
        value = replace("HH", date.getHours(), 2);
        value = replace("mm", date.getMinutes(), 2);
        value = replace("ss", date.getSeconds(), 2);
        value = replace("SSS", date.getMilliseconds(), 3);
        return value;
    }
    try
    {
        var array = format.split("'");
        var value = "";
        for (var q = 0; q < array.length; q++)
        {
            if (q % 2 === 0) value += fill(array[q], date);
            else value += array[q];
        }
        return value;
    }
    catch (err)
    {
        throw new Error("formatDate(" + err.message + ")");
    }
};
//---------------------------------------------------------------------------
aUtils.strToDate = function(value, format)
{
    function fill(value, trimFormat, mask, len)
    {
        var m = trimFormat.match(new RegExp(mask));
        if (m === null) return 0;
        var s = value.substr(m.index, len);
        if (!s) throw new Error("\"" + mask + "\" not found");
        var n = Number(s);
        if (isNaN(n)) throw new Error("\"" + mask + "\" : \"" + s + "\" is not a number");
        return n;
    }
    function spaces(length)
    {
        var value = "";
        while (value.length < length) value = " " + value;
        return value;
    }
    try
    {
        var array = format.split("'");
        var trimFormat = "";
        for (var q = 0; q < array.length; q++)
        {
            if (q % 2 === 0) trimFormat += array[q];
            else trimFormat += spaces(array[q].length);
        }

        var date = { year : 0, month : 0, day : 0, hours : 0, minutes : 0, seconds : 0, milliseconds : 0 };
        date.year = fill(value, trimFormat, "yyyy", 4);
        date.month = fill(value, trimFormat, "MM", 2) - 1;
        date.day = fill(value, trimFormat, "dd", 2);
        date.hours = fill(value, trimFormat, "HH", 2);
        date.minutes = fill(value, trimFormat, "mm", 2);
        date.seconds = fill(value, trimFormat, "ss", 2);
        //date.milliseconds = fill(value, trimFormat, "SSS", 3);
        return new Date(date.year, date.month, date.day, date.hours, date.minutes, date.seconds, date.milliseconds);
    }
    catch (err)
    {
        throw new Error("value \"" + value + "\" does not match format \"" + format + "\" because: " + err.message);
    }
};
//---------------------------------------------------------------------------
