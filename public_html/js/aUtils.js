/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var aUtils = new (function()
{
//------------------------------------------------------------------------------------------------------------------- 
//if (typeof Element.prototype.addEventListener === 'undefined') 
//{
//    Element.prototype.addEventListener = function(e, callback) 
//    {
//        e = 'on' + e;
//        return this.attachEvent(e, callback);
//    };
//}
//-------------------------------------------------------------------------------------------------------------------
    /**
     * Добавление слушателя на событие eventName у объекта object и устанавливает функцию обратного вызова on.<br/>
     * @param {object} object
     * @param {string} eventName имя события, например click, mousedown и тд. (без on)
     * @param {function} on функция обратного вызова
     * @returns {undefined}
     */
    this.addEvent = function(object, eventName, on)
    {
//        if (obj.attachEvent) 
//        {
//            obj['e' + type + fn] = fn;
//            obj[type + fn] = function() 
//            {
//                obj['e' + type + fn](window.event);
//            }
//            obj.attachEvent('on' + type, obj[type + fn]);
//            return;
//        } 
        object.addEventListener(eventName, on, false);
    };
//------------------------------------------------------------------------------------------------------------------- 
    /**
     * Удаляет слушателя на событие eventName у объекта object и с функцией обратного вызова on.<br/>
     * @param {object} object
     * @param {string} eventName имя события, например click, mousedown и тд. (без on)
     * @param {function} on функция обратного вызова
     * @returns {undefined}
     */
    this.removeEvent = function(object, eventName, on)
    {
//        if (obj.detachEvent) 
//        {
//            obj.detachEvent('on' + type, obj[type + fn]);
//            obj[type + fn] = null;
//            return;
//        } 
        object.removeEventListener(eventName, on, false);
    };
//------------------------------------------------------------------------------------------------------------------- 
//    this.Range = function Range(min, max)
//    {
//        this.min = min;
//        this.max = max;
//    };
//------------------------------------------------------------------------------------------------------------------- 
    this.NumInRange = function NumInRange(value, min, max)
    {
        var that = this;
        var data = { value : 0, min : min, max : max };
        var onchange = null;
        this.value = function(value)
        {
            if (value === undefined) return data.value;
            var temp = aUtils.trimByRange(value, data.min, data.max);
            if (data.value === temp) return;
            data.value = temp;
            if (onchange) onchange.call(that, data.value);
        };
        this.min = function(min)
        {
            if (min === undefined) return data.min;
            data.min = min;
            data.value = aUtils.trimByRange(data.value, data.min, data.max);
        };
        this.max = function(max)
        {
            if (max === undefined) return data.max;
            data.max = max;
            data.value = aUtils.trimByRange(data.value, data.min, data.max);
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            onchange = fn;
        };
        data.value = aUtils.trimByRange(value, min, max);
    };
//-------------------------------------------------------------------------------------------------------------------
    /**
     * Подрезка значения value по диапазону от min до max включительно.<br/>
     * @param {Number} value значение
     * @param {Number} min минимум
     * @param {Number} max махимум
     * @returns {Number}
     */
    this.trimByRange = function(value, min, max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    };
//------------------------------------------------------------------------------------------------------------------- 
    /**
     * Находится ли значение value в диапазоне между min и max включительно.<br/>
     * @param {Number} value значение
     * @param {Number} min минимум
     * @param {Number} max махимум
     * @returns {Boolean}
     */
    this.inRange = function(value, min, max)
    {
        if (value < min) return false;
        if (value > max) return false;
        return true;
//        return (min <= value) && (value <= max);
    };
//-------------------------------------------------------------------------------------------------------------------
    /*    this.Rect = function Rect()
     {
     this.left = 0;
     this.right = 0;
     this.top = 0;
     this.bottom = 0;
     this.width = function()
     {
     return right - left;              
     };
     this.height = function()
     {
     return bottom - top;              
     };
     };*/
//-------------------------------------------------------------------------------------------------------------------
    /**
     * Находится ли точка x,y в пределах области rect включительно.<br/>
     * @param {Number} x
     * @param {Number} y
     * @param {Rect} rect прямоугольная область
     * @returns {Boolean}
     */
    this.inRect = function(x, y, rect)
    {
        if (!aUtils.inRange(x, rect.left, rect.right)) return false;
        if (!aUtils.inRange(y, rect.top, rect.bottom)) return false;
        return true;
    };
//------------------------------------------------------------------------------------------------------------------- 
    this.convertRangedValue = function(a, minA, maxA, minB, maxB)
    {
        var lenA = (maxA - minA);
        var lenB = (maxB - minB);
//        var lenA = (maxA - minA) + 1;
//        var lenB = (maxB - minB) + 1;
        var b = minB + (((a - minA) * lenB) / lenA);
//        console.log(a, minA, maxA, minB, maxB, b);
        return b;
    };
//------------------------------------------------------------------------------------------------------------------- 
    /** 
     * Преобразование числа number в строку с минимальной длиной length, при необходимости дополняет строку символом 0.<br/>
     * Если число не вмещается в строку длиной length, то формируется строка необходимой длинны.<br/>
     * @param {Number} number число, переводимое в строку.
     * @param {Number} length минимальная длина получаемой строки.
     * @returns {String} строка
     */
    this.numberToStrLen = function(number, length)
    {
        var value = String(number);
        while (value.length < length) value = "0" + value;
        return value;
    };
//------------------------------------------------------------------------------------------------------------------- 
    /**
     * Преобразование даты date в строку в соответствии с форматом format.<br/>
     * @param {Date} date дата
     * @param {String} format формат:<br/>
     * <b>yyyy</b> - год,<br/>
     * <b>MM</b> - месяц,<br/>
     * <b>dd</b> - ден,<br/>
     * <b>HH</b> - часы,<br/>
     * <b>mm</b> - минуты,<br/>
     * <b>ss</b> - секунды,<br/>
     * <b>SSS</b> - миллисекунды.<br/>
     * @example 
     * yyyy-MM-dd'T'HH:mm:ss.SSS<br/>
     * dd.MM.yyyy'г.'<br/>
     * @returns {String}
     */
    this.dateToStr = function(date, format)
    {
        if (!format) return "";
        function replace(str, mask, value, len)
        {
            return str.replace(new RegExp(mask), aUtils.numberToStrLen(value, len));
        }
        function fill(value, date)
        {
            value = replace(value, "yyyy", date.getFullYear(), 4);
            value = replace(value, "MM", date.getMonth() + 1, 2);
            value = replace(value, "dd", date.getDate(), 2);
            value = replace(value, "HH", date.getHours(), 2);
            value = replace(value, "mm", date.getMinutes(), 2);
            value = replace(value, "ss", date.getSeconds(), 2);
            value = replace(value, "SSS", date.getMilliseconds(), 3);
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
    /**
     * Преобразование строки value в дату в соответствии с форматом format.<br/>
     * @param {String} value строка. например 
     * @param {String} format формат:<br/>
     * <b>yyyy</b> - год,<br/>
     * <b>MM</b> - месяц,<br/>
     * <b>dd</b> - ден,<br/>
     * <b>HH</b> - часы,<br/>
     * <b>mm</b> - минуты,<br/>
     * <b>ss</b> - секунды,<br/>
     * <b>SSS</b> - миллисекунды.<br/>
     * @example 
     * yyyy-MM-dd'T'HH:mm:ss.SSS<br/>
     * dd.MM.yyyy'г.'<br/>
     * @returns {Date}
     */
    this.strToDate = function(value, format)
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
            date.milliseconds = fill(value, trimFormat, "SSS", 3);
            return new Date(date.year, date.month, date.day, date.hours, date.minutes, date.seconds, date.milliseconds);
        }
        catch (err)
        {
            throw new Error("value \"" + value + "\" does not match format \"" + format + "\" because: " + err.message);
        }
    };
//---------------------------------------------------------------------------
    /**
     * Количество дней в месяце.<br/>
     * @param {Number} year год.
     * @param {Number} month индекс месяца [0-11]. то, что возвращает Date.getMonth().
     * @returns {Number}
     */
    this.countDayInMonth = function(year, month)
    {
        return (new Date(year, month + 1, 0)).getDate();
    };
//---------------------------------------------------------------------------
    /**
     * Возвращается день ближайший к указанному day в пределах месяца month относящегося к году year.
     * то есть если значение деня больше чем может быть в казанном месяце, 
     * то день уменьшается до максимально возможного.
     * @param {Number} year year год.
     * @param {Number} month индекс месяца [0-11]. то, что возвращает Date.getMonth().
     * @param {Number} day день. то, что возвращает Date.getDate().
     * @returns {Number}
     */
    this.trimDay = function(year, month, day)
    {
        if (day < 1) return 1;
        while (day > aUtils.countDayInMonth(year, month)) day--;
        return day;
    };
//---------------------------------------------------------------------------
    /**
     * Смещение дня.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    this.shiftDay = function(date, shift)
    {
        var day = date.getDate() + shift;
        var month = date.getMonth();
        var year = date.getFullYear();
        return new Date(year, month, day);
    };
//---------------------------------------------------------------------------
    /**
     * Смещение месяца.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    this.shiftMonth = function(date, shift)
    {
        var day = date.getDate();
        var month = date.getMonth() + shift;
        var year = date.getFullYear();
        while (month < 0)
        {
            month += 12;
            year--;
        }
        while (month > 11)
        {
            month -= 12;
            year++;
        }
        return new Date(year, month, aUtils.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    /**
     * Смещение года.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    this.shiftYear = function(date, shift)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() + shift;
        return new Date(year, month, aUtils.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    this.getShortNameDayOfWeekRu = function(index)
    {
        var array = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
        return array[index];
    };
    this.getShortNameDayOfWeek = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    this.getFullNameDayOfWeekRu = function(index)
    {
        var array = [ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
        return array[index];
    };
    this.getShortNameMonth = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    this.getNumberMonth = function(index)
    {
        var array = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
        return array[index];
    };
    this.getShortNameMonth = function(index)
    {
        var array = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
        return array[index];
    };
    this.getShortNameMonthRu = function(index)
    {
        var array = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
        return array[index];
    };
    this.getFullNameMonthRu = function(index)
    {
        var array = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
        return array[index];
    };
//---------------------------------------------------------------------------
    this.saveBlobAsFile = function(blob, filename)
    {
        // для IE
        if (window.navigator.msSaveBlob)
        {
            window.navigator.msSaveBlob(blob, filename);
            return;
        }
        //для Нормальных браузеров
        var url = window.URL.createObjectURL(blob);
        var errorText = null;
        var a = document.createElement("a");
        if (typeof a.download === "string")
        {
            try
            {
                a.href = url;
                a.download = filename;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
            }
            catch (err)
            {
                errorText = "Возникли проблемы при скачивании...";
            }
        }
        else
        {
            console.error("download name not set");
            window.location.href = url;
        }
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        if (errorText) throw new Error(errorText);
    };
//---------------------------------------------------------------------------
    this.toUriParams = function(params)
    {
        if (!params) return "";
        return  Object.keys(params).map(function(key)
        {
            var value = params[key];
            if (typeof value === "object") value = JSON.stringify(value);
            return encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }).join('&');
    };
//---------------------------------------------------------------------------
    this.download = function(url, params, onload)//, onSuccess, onFailure
    {
        function extractFileName(value, alter)
        {
            if (value === null) return alter;
            var expression = new RegExp("filename[^;=\\n]*=(['\"]?(.*)['\"]|[^;\\n]*)", "");
            var match = value.match(expression);
            if (!match) return alter;
            if (match[2] !== undefined) return decodeURIComponent(match[2]);
            if (match[1] !== undefined) return decodeURIComponent(match[1]);
            return alter;
        }
        var alterFileName = "download.dat";
        var p = aUtils.toUriParams(params);
        if (p !== "") url += "?" + p;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function(event)
        {
            try
            {
                var contentDisposition = this.getResponseHeader("Content-Disposition");
                aUtils.saveBlobAsFile(this.response, extractFileName(contentDisposition, alterFileName));
                if (typeof onload === "function") onload();
            }
            catch (err)
            {
                if (typeof onload === "function") onload(err.message);
            }
        };
        xhr.send();
    };
//---------------------------------------------------------------------------

})();
