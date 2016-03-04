define([ "aui/core", "./Button" ],
function(core, Button)
{
//---------------------------------------------------------------------------
    var fn = { };
    /**
     * Количество дней в месяце.<br/>
     * @param {Number} year год.
     * @param {Number} month индекс месяца [0-11]. то, что возвращает Date.getMonth().
     * @returns {Number}
     */
    fn.countDayInMonth = function(year, month)
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
    fn.trimDay = function(year, month, day)
    {
        if (day < 1) return 1;
        while (day > fn.countDayInMonth(year, month)) day--;
        return day;
    };
//---------------------------------------------------------------------------
    /**
     * Смещение дня.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    fn.shiftDay = function(date, shift)
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
    fn.shiftMonth = function(date, shift)
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
        return new Date(year, month, fn.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    /**
     * Смещение года.<br/>
     * @param {Date} date дата
     * @param {Number} shift величина смещения. Целое число.
     * @returns {Date}
     */
    fn.shiftYear = function(date, shift)
    {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear() + shift;
        return new Date(year, month, fn.trimDay(year, month, day));
    };
//---------------------------------------------------------------------------
    fn.getShortNameDayOfWeekRu = function(index)
    {
        var array = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
        return array[index];
    };
    fn.getShortNameDayOfWeek = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    fn.getFullNameDayOfWeekRu = function(index)
    {
        var array = [ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
        return array[index];
    };
    fn.getShortNameMonth = function(index)
    {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    };
    fn.getNumberMonth = function(index)
    {
        var array = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
        return array[index];
    };
    fn.getShortNameMonth = function(index)
    {
        var array = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
        return array[index];
    };
    fn.getShortNameMonthRu = function(index)
    {
        var array = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
        return array[index];
    };
    fn.getFullNameMonthRu = function(index)
    {
        var array = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
        return array[index];
    };
//---------------------------------------------------------------------------
    /**
     * <b>Календарь.</b><br/>
     * @param {object} options параметры:<br/>
     * - <b>class:</b> по умолчанию имеет значение "calendar".<br/>
     * - <b>onchange:</b> функция, вызываемая в момент выбора даты.<br/>
     * - <b>date:</b> по умолчанию имеет значение текущей даты.<br/>
     * @returns {Calendar}
     */
    function Calendar(options)
    {
//Опции по умолчанию
        options = core.extend(
        {
            class : "calendar",
            onclickday : null,
            onclickmonth : null,
            onclickyear : null,
            onchange : null,
            date : new Date()
        }, options);
        core.Element.call(this, options);
//Переменные
        var that = this;
        var mode = "days";
//Функции
        function update()
        {
            if (mode === "days") showDays(options.date);
            if (mode === "months") showMonths(options.date);
            if (mode === "years") showYears(options.date);
        }
        this.value = function(date)
        {
            if (date === undefined) return options.date;
            if (!date instanceof Date) throw new Error("value is not instance of Date");
            if (options.date === date) return;
            options.date = date;
            update();
            if (options.onchange) options.onchange.call(that);
        };
        function clickMonthsMode()
        {
            mode = "months";
            update();
        }
        function clickYearsMode()
        {
            mode = "years";
            update();
        }
        function clickPrev()
        {
            that.value(this.data);
        }
        function clickNext()
        {
            that.value(this.data);
        }
        function clickDay()
        {
            that.value(this.data);
//        
            if (options.onclickday) options.onclickday.call(that);
        }
        function clickMonth()
        {
            mode = "days";
            that.value(this.data);
        }
        function clickYear()
        {
            mode = "months";
            that.value(this.data);
        }
        this.onClickDay = function(fn)
        {
            options.onclickday = fn;
        };
        this.onClickMonth = function(fn)
        {
            options.onclickmonth = fn;
        };
        this.onClickYear = function(fn)
        {
            options.onclickyear = fn;
        };
        this.onChange = function(fn)
        {
            options.onchange = fn;
        };
        function showDays(date)
        {
            that.clear();
            var dayTableData = that.getDayTableData(date);
            new Button({ class : "prev", text : "<", data : dayTableData.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level days", text : dayTableData.caption, onclick : clickMonthsMode }).appendTo(that);
            new Button({ class : "prev", text : ">", data : dayTableData.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "days" });
            var th = new core.Element({ element : "tr" });
            for (var d = 0; d < 7; d++)
            {
                var item = dayTableData.head[d];
                var td = new core.Element({ element : "th", class : item.class, text : item.text });
                td.appendTo(th);
            }
            th.appendTo(table);
            for (var w = 0; w < 6; w++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var d = 0; d < 7; d++)
                {
                    var item = dayTableData.array[(w * 7) + d];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickDay);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showMonths(date)
        {
            that.clear();
            var data = that.getMonthTableData(date);
            new Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level months", text : data.caption, onclick : clickYearsMode }).appendTo(that);
            new Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "months" });
            for (var h = 0; h < 3; h++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var w = 0; w < 4; w++)
                {
                    var item = data.array[(h * 4) + w];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickMonth);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showYears(date)
        {
            that.clear();
            var data = that.getYearTableData(date);
            new Button({ class : "prev", text : "<", data : data.prev, onclick : clickPrev }).appendTo(that);
            new Button({ class : "level years", text : data.caption }).appendTo(that);
            new Button({ class : "prev", text : ">", data : data.next, onclick : clickNext }).appendTo(that);
            var table = new core.Element({ element : "table", class : "months" });
            for (var h = 0; h < 3; h++)
            {
                var tr = new core.Element({ element : "tr" });
                for (var w = 0; w < 4; w++)
                {
                    var item = data.array[(h * 4) + w];
                    var td = new Button({ element : "td", class : item.class, text : item.text, data : item.date });
                    if (item.state) td.addClass(item.state);
                    if (item.current) td.addClass("current");
                    if (item.selected) td.addClass("selected");
                    td.onClick(clickYear);
                    td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
//Сборка
        if (!options.date instanceof Date) throw new Error("value is not instance of Date");
        update();
    }
    core.proto(Calendar, core.Element);
//---------------------------------------------------------------------------
    Calendar.prototype.getDayTableData = function(date)
    {
        function getFirsInMonthDayOfWeek(year, month)
        {
            return (new Date(year, month, 1)).getDay();
        }

        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.caption = fn.getFullNameMonthRu(data.month) + " " + data.year;
        data.prev = fn.shiftMonth(data.date, -1);
        data.next = fn.shiftMonth(data.date, +1);
        var countDayInPrevMonth = fn.countDayInMonth(data.prev.getFullYear(), data.prev.getMonth());
        var countDayInMonth = fn.countDayInMonth(data.year, data.month);
        var firstInMonthDayOfWeek = getFirsInMonthDayOfWeek(data.year, data.month);
        var prevCount = firstInMonthDayOfWeek - 1;
        if (prevCount < 0) prevCount = 6;
        var prevDIndex = countDayInPrevMonth - prevCount;
        var nextCount = 42 - prevCount - countDayInMonth;
        data.head = [ ];
        for (var q = 0; q < 7; q++)
        {
            var item = { }
            var dayOfWeekCounter = q + 1;
            if (q === 6) dayOfWeekCounter = 0;
            item.text = fn.getShortNameDayOfWeekRu(dayOfWeekCounter);
            item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter);
            data.head.push(item);
        }

        data.array = [ ];
        for (var q = 0; q < prevCount; q++) data.array.push({ date : new Date(data.prev.getFullYear(), data.prev.getMonth(), q + prevDIndex + 1), state : "prev" });
        for (var q = 0; q < countDayInMonth; q++) data.array.push({ date : new Date(data.year, data.month, q + 1) });
        for (var q = 0; q < nextCount; q++) data.array.push({ date : new Date(data.next.getFullYear(), data.next.getMonth(), q + 1), state : "next" });
        var now = new Date();
        var dayOfWeekCounter = 1;
        for (var q = 0; q < data.array.length; q++)
        {
            var item = data.array[q];
            item.text = item.date.getDate();
            item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter);
            if ((item.date.getDate() === now.getDate()) && (item.date.getMonth() === now.getMonth()) && (item.date.getFullYear() === now.getFullYear())) item.current = true;
            if ((item.date.getDate() === data.day) && (item.date.getMonth() === data.month) && (item.date.getFullYear() === data.year)) item.selected = true;
            dayOfWeekCounter++;
            if (dayOfWeekCounter === 7) dayOfWeekCounter = 0;
        }
        return data;
    };
//---------------------------------------------------------------------------
    Calendar.prototype.getMonthTableData = function(date)
    {
        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.caption = data.year;
        data.prev = fn.shiftYear(data.date, -1);
        data.next = fn.shiftYear(data.date, +1);
        data.array = [ ];
        var now = new Date();
        var monthCounter = 0;
        for (var q = 0; q < 12; q++)
        {
            var item = { };
            item.date = new Date(data.year, monthCounter, fn.trimDay(data.year, q, data.day));
            item.text = fn.getShortNameMonthRu(monthCounter);
            item.class = fn.getShortNameMonth(monthCounter);
            if ((monthCounter === now.getMonth()) && (data.year === now.getFullYear())) item.current = true;
            if ((monthCounter === data.month)) item.selected = true;
            data.array.push(item);
            monthCounter++;
        }
        return data;
    };
//---------------------------------------------------------------------------
    Calendar.prototype.getYearTableData = function(date)
    {
        var data = { date : date };
        data.day = date.getDate();
        data.month = date.getMonth();
        data.year = date.getFullYear();
        data.startDec = data.year - (data.year % 10);
        data.endDec = data.startDec + 9;
        data.caption = data.startDec + " - " + data.endDec;
        data.prev = fn.shiftYear(data.date, -10);
        data.next = fn.shiftYear(data.date, +10);
        data.array = [ ];
        var now = new Date();
        var yearCounter = data.startDec - 1;
        for (var q = 0; q < 12; q++)
        {
            var item = { };
            item.date = new Date(yearCounter, data.month, fn.trimDay(data.year, q, data.day));
            item.text = yearCounter;
            item.class = yearCounter;
            if ((yearCounter === now.getFullYear())) item.current = true;
            if ((yearCounter === data.year)) item.selected = true;
            if (q === 0) item.state = "prev";
            if (q === 11) item.state = "next";
            data.array.push(item);
            yearCounter++;
        }
        return data;
    };
//---------------------------------------------------------------------------
    return Calendar;
//---------------------------------------------------------------------------
});