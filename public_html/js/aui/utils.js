define([ ],
function() {
//---------------------------------------------------------------------------
    var utils = { };
//------------------------------------------------------------------------------------------------------------------- 
    utils.functionOrNull = function(value) {
        if (value === null) return null;
        if (typeof value !== "function") throw new Error("not a function");
        return value;
    };
//---------------------------------------------------------------------------
//    utils.Range = function Range(min, max)
//    {
//        this.min = min;
//        this.max = max;
//    };
//------------------------------------------------------------------------------------------------------------------- 
    function NumInRange(value, min, max)
    {
        var that = this;
        var data = { value : 0, min : min, max : max };
        var onchange = null;
        this.value = function(value)
        {
            if (value === undefined) return data.value;
            var temp = utils.trimByRange(value, data.min, data.max);
            if (data.value === temp) return;
            data.value = temp;
            if (onchange) onchange.call(that, data.value);
        };
        this.min = function(min)
        {
            if (min === undefined) return data.min;
            data.min = min;
            data.value = utils.trimByRange(data.value, data.min, data.max);
        };
        this.max = function(max)
        {
            if (max === undefined) return data.max;
            data.max = max;
            data.value = utils.trimByRange(data.value, data.min, data.max);
        };
        this.onChange = function(fn)
        {
            if (fn === undefined) return onchange;
            if (typeof fn !== "function") throw new Error("fn for onChange not a function");
            onchange = fn;
        };
        data.value = utils.trimByRange(value, min, max);
    }
//-------------------------------------------------------------------------------------------------------------------
    utils.NumInRange = NumInRange;
//-------------------------------------------------------------------------------------------------------------------
    /**
     * Подрезка значения value по диапазону от min до max включительно.<br/>
     * @param {Number} value значение
     * @param {Number} min минимум
     * @param {Number} max махимум
     * @returns {Number}
     */
    utils.trimByRange = function(value, min, max)
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
    utils.inRange = function(value, min, max)
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
    utils.inRect = function(x, y, rect)
    {
        if (!utils.inRange(x, rect.left, rect.right)) return false;
        if (!utils.inRange(y, rect.top, rect.bottom)) return false;
        return true;
    };
//------------------------------------------------------------------------------------------------------------------- 
    utils.convertRangedValue = function(a, minA, maxA, minB, maxB)
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
    utils.numberToStrLen = function(number, length)
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
    utils.dateToStr = function(date, format)
    {
        if (!format) return "";
        function replace(str, mask, value, len)
        {
            return str.replace(new RegExp(mask), utils.numberToStrLen(value, len));
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
    utils.strToDate = function(value, format)
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
    utils.saveBlobAsFile = function(blob, filename)
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
    utils.toUriParams = function(params)
    {
        if (!params) return "";
        if (typeof params === "string") return params;
        return  Object.keys(params).map(function(key)
        {
            var value = params[key];
            if (typeof value === "object") value = JSON.stringify(value);
            return encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }).join('&');
    };
//---------------------------------------------------------------------------
    function responseType(dataType) {
        if (dataType === "json") return "text";
        return dataType;
    }
//---------------------------------------------------------------------------
    function responseData(dataType, response) {
        if (dataType === "json") {
            try {
                return JSON.parse(response);
            } catch (err) {
                return response;
            }
        }
        return response;
    }
//---------------------------------------------------------------------------
    /**
     * Вызов WEB метода в синхронном режиме
     * @param {string} method метод (например GET, POST)
     * @param {string} url адрес
     * @param {string | object} param параметры в формате вебстроки "name1=value1&name2=value2" или в виде объекта
     * @param {string} dataType тип возвращаемых данных (например json, xml)
     * @returns {string}
     */
    utils.sync = function(method, url, param, dataType)
    {
        try
        {
            var p = utils.toUriParams(param);
            var body = null;
            if (method === "POST") body = p;
            else if (p !== "") url += "?" + p;

            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (method === "POST") xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (dataType) xhr.responseType = responseType(dataType);

            xhr.send(body);

            try
            {
                if (xhr.status !== 200) throw new Error("response status " + xhr.status);
                return responseData(dataType, xhr.response);
            }
            catch (err)
            {
                var errText = err.message + ". : sync " + method + " " + url + " return error: \"" + xhr.statusText + "\"";
                throw new Error(errText);
            }
        }
        catch (err)
        {
            throw new Error("sync " + method + " " + url + " (" + err.message + ")");
        }
    };
//---------------------------------------------------------------------------
    /**
     * Вызов WEB метода в асинхронном режиме
     * @param {string} method метод (например GET, POST)
     * @param {string} url адрес
     * @param {string | object} param параметры в формате вебстроки "name1=value1&name2=value2" или в виде объекта
     * @param {string} dataType тип возвращаемых данных (например json, xml)
     * @param {function} onload функция обратного вызова в случае успешного выполнения
     * @param {function} onerror функция обратного вызова в случае ошибки
     * @returns {string}
     */
    utils.async = function(method, url, param, dataType, onload, onerror)
    {
        try
        {
            var p = utils.toUriParams(param);
            var body = null;
            if (method === "POST") body = p;
            else if (p !== "") url += "?" + p;

            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (method === "POST") xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (dataType) xhr.responseType = responseType(dataType);
            xhr.onload = function(event)
            {
                try
                {
                    if (this.status !== 200) throw new Error("response status " + this.status);
                }
                catch (err)
                {
                    var errText = err.message + ". : async \"" + url + "\" return error: \"" + this.statusText + "\"";
                    var errorMessage = this.getResponseHeader("Error-Message");
                    if (errorMessage) errText += ", because: " + errorMessage;
                    if (typeof onerror === "function") onerror(errText);
                    throw new Error(errText);
                }
                if (typeof onload === "function") onload(responseData(dataType, xhr.response));
            };
            xhr.send(body);
        }
        catch (err)
        {
            throw new Error("async " + url + " (" + err.message + ")");
        }
    };
//---------------------------------------------------------------------------
    utils.download = function(url, params, onload)
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
        var p = utils.toUriParams(params);
        if (p !== "") url += "?" + p;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function(event)
        {
            try
            {
                var contentDisposition = this.getResponseHeader("Content-Disposition");
                utils.saveBlobAsFile(this.response, extractFileName(contentDisposition, alterFileName));
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
    //https://developer.mozilla.org/ru/docs/Web/API/File/Using_files_from_web_applications
    // function createThrobber(img) {
    //     this.update = function (value) {
    //         console.log(value);
    //     }
    //     return this;
    // }
//---------------------------------------------------------------------------
    utils.upload = function (url, img, file) {
        //this.ctrl = createThrobber(img);
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                //var percentage = Math.round((e.loaded * 100) / e.total);
                //that.ctrl.update(percentage);
            }
        }, false);

        xhr.upload.addEventListener("load", function (e) {
            //that.ctrl.update(100);
            //var canvas = that.ctrl.ctx.canvas;
            //canvas.parentNode.removeChild(canvas);
        }, false);
        xhr.open("POST", url);

        xhr.overrideMimeType(file.type + "; charset=x-user-defined-binary");

        var reader = new FileReader();
        reader.onload = function (evt) {
            xhr.send(evt.target.result);
        };
        reader.readAsBinaryString(file);
    };
//---------------------------------------------------------------------------
    /**
     * Uploading файлов в режиме multipart/form-data
     *
     * пример создания formData:
     * var formData = new FormData();
     * for (var index = 0; index < files.length; index++) {
     *      var file = files[index];
     *      formData.append(file.name, file);
     *  }
     * @param url
     * @param img
     * @param files
     */
    utils.uploadMultipart = function (url, img, formData) {
        //this.ctrl = createThrobber(img);
        var xhr = new XMLHttpRequest();

        var that = this;
        // xhr.upload.addEventListener("progress", function (e) {
        //     if (e.lengthComputable) {
        //         //var percentage = Math.round((e.loaded * 100) / e.total);
        //         //that.ctrl.update(percentage);
        //     }
        // }, false);

        // xhr.upload.addEventListener("load", function (e) {
        //     //that.ctrl.update(100);
        //     //var canvas = that.ctrl.ctx.canvas;
        //     //canvas.parentNode.removeChild(canvas);
        // }, false);

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) console.log(this.responseText);
                else console.error(this.responseText);
            }
        };

        xhr.open("POST", url, true);
        //xhr.overrideMimeType("multipart/form-data; charset=x-user-defined-binary");
        xhr.send(formData);
    };
//---------------------------------------------------------------------------
//    utils.splitArray = function(array, size) {
//        var s = [ ];
//        var tail = array;
//        while (tail.length > 0) {
//            s.push(tail.slice(0, size));
//            tail = tail.slice(size);
//        }
//        return s;
//    };
//---------------------------------------------------------------------------
//    utils.isEmpty = function(object) {
//
//        // null and undefined are "empty"
//        if (object === undefined) return true;
//        if (object === null) return true;
//
//        // Assume if it has a length property with a non-zero value
//        // that that property is correct.
//        if (object.length > 0) return false;
//        if (object.length === 0) return true;
//
//        // Otherwise, does it have any properties of its own?
//        // Note that this doesn't handle
//        // toString and valueOf enumeration bugs in IE < 9
//        for (var key in object) {
//            if (Object.prototype.hasOwnProperty.call(object, key)) return false;
//        }
//
//        return true;
//    };
//---------------------------------------------------------------------------
    function Task()
    {
        var that = this;
        this.context = null;

        var run = null;
        var args = [ ];
        var result = null;

        Object.defineProperty(this, "run",
        {
            configurable : false,
            get : function()
            {
                return run;
            },
            set : function(fn)
            {
                run = utils.functionOrNull(fn);
            }
        });
        Object.defineProperty(this, "args",
        {
            configurable : false,
            get : function()
            {
                return args;
            },
            set : function(value)
            {
                args = [ ];
                if (value instanceof Array) args = value;
                else for (var index in value) args.push(value[index]);
            }
        });
        Object.defineProperty(this, "result",
        {
            configurable : false,
            get : function()
            {
                return result;
            }
        });
        this.execute = function()
        {
            if (!run) throw new Error("run is not a function");
            try
            {
                return result = run.apply(that.contecst, args);
            }
            catch (err)
            {
                console.error(err);
                throw err;
            }
        };
    }
//---------------------------------------------------------------------------
    function Executor()
    {
        var that = this;
        var tasks = [ ];
        var onSuccess = null;
        var index = 0;
        var current = null;

        this.addTask = function(run, args, context)
        {
            var task = new Task();
            task.run = run;
            if (args instanceof Array) task.args = args;
            else for (var index in args) task.args.push(args[index]);
            task.context = context;
            tasks.push(task);
            return task;
        };

        Object.defineProperty(this, "onSuccess", {
            configurable : false,
            get : function()
            {
                return onSuccess;
            },
            set : function(fn)
            {
                onSuccess = utils.functionOrNull(fn);
            }
        });

        this.isDone = function()
        {
            return index === null;
        };

        function done()
        {
            if (that.isDone()) return;
            index = null;
            current = null;
            if (onSuccess) onSuccess();
        }

        Object.defineProperty(this, "current",
        {
            configurable : false,
            get : function()
            {
                return current;
            }
        });

        this.next = function()
        {
            if (that.isDone()) return;
            current = tasks[index++];
            if (current) current.execute();
            else done();
        };
    }
//---------------------------------------------------------------------------
    utils.task = { };
//---------------------------------------------------------------------------
    utils.task.Task = Task;
    utils.task.Executor = Executor;
//---------------------------------------------------------------------------
    return utils;
//---------------------------------------------------------------------------
});