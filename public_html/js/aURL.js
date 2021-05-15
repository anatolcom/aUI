define(
function() {
    var aURL = function()
    {
        //Опции по умолчанию
        //Данные
        //var that = this;
        var data = { };
        var listeners = [ ];
        var delimiter = "&";
        var assign = "=";
//    var part = "pathname";
//    var part = "search";
        var part = "hash";
        //Функции
        /**
         * добавление слушателя
         * @param {string | number} name уникальное имя слушателя
         * @param {string | number} key ключ 
         * @param {function} fn функция
         * @returns {undefined}
         */
        this.setListener = function(name, key, fn)
        {
            //console.dir(fn);
            if (!checkKey(name)) throw new Error("name : " + name + " not format");
            for (var index in listeners) if (listeners[index].name === name) throw new Error("name : " + name + " not unique");
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            if (!checkFn(fn)) throw new Error("fn is not a function");
            listeners.push({
                name : name, key : key, fn : fn
            });
        };
        /**
         * удаление слушателя
         * @param {string | number} name уникальное имя слушателя
         * @returns {undefined}
         */
        this.removeListener = function(name)
        {
            for (var index in listeners)
            {
                if (listeners[index].name !== name) continue;
                listeners.splice(index, 1);
            }
        };
        function callListeners(key)
        {
            for (var index in listeners)
            {
                var listener = listeners[index];
                if (listener.key === key) listener.fn.call({
                        key : key, value : data[key]
                    });
            }
        }
        function checkKey(key)
        {
            if (typeof key === "string" && key !== "") return true;
            if (typeof key === "number") return true;
            return false;
        }
        function checkValue(value)
        {
            if (value === undefined) return true;
            if (value === null) return true;
            if (typeof value === "string") return true;
            if (typeof value === "number") return true;
            if (typeof value === "boolean") return true;
            return false;
        }
        function checkFn(fn)
        {
            if (typeof fn === "function") return true;
            return false;
        }
        /**
         * добавление параметра с именем key и значением value.
         * если значение обновилось, то изменяется URL и вызываются слушатели<br/>
         * @param {string | number} key имя параметра
         * @param {string | number | boolean | null} value значение параметра
         * @returns {undefined}
         */
        this.set = function(key, value)
        {
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            if (!checkValue(value)) throw new Error("value : " + value + " not format");
            if (data[key] === String(value)) return;
            data[key] = String(value);
            callListeners(key);
            updateUrl();
        };
        /**
         * возвращает значение с именем key.<br/>
         * если key не найден, то при required = true вызывает ошибку, 
         * а при required = false вызывает undefined<br/>
         * @param {string | number} key имя параметра
         * @param {boolean} required обязательность
         * @returns { string } значение
         */
        this.get = function(key, required)
        {
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            if (!(key in data))
            {
                if (!required) return undefined;
                throw new Error("key : " + key + " not found");
            }
            return data[key];
        };
        /**
         * возвращает значение с именем key приведённое к типу number<br/>
         * если key не найден, то при required = true вызывает ошибку, 
         * а при required = false вызывает undefined<br/>
         * @param {string | number} key имя параметра
         * @param {boolean} required обязательность
         * @returns {number} значение
         */
        this.getNumber = function(key, required)
        {
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            if (!(key in data))
            {
                if (!required) return undefined;
                throw new Error("key : " + key + " not found");
            }
            var value = data[key];
            if (isNaN(value)) throw new Error("value : " + value + " is not a number");
            return parseInt(value);
        };
        /**
         * возвращает значение с именем key приведённое к типу number<br/>
         * если key не найден, то при required = true вызывает ошибку, 
         * а при required = false вызывает undefined<br/>
         * @param {string | number} key имя параметра
         * @param {boolean} required обязательность
         * @returns {boolean} значение
         */
        this.getBoolean = function(key, required)
        {
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            if (!(key in data))
            {
                if (!required) return undefined;
                throw new Error("key : " + key + " not found");
            }
            var value = data[key];
            if (value === "true") return true;
            if (value === "false") return false;
            throw new Error("value : " + value + " is not a boolean");
        };
        this.remove = function(key)
        {
            if (!checkKey(key)) throw new Error("key : " + key + " not format");
            delete data[key];
            callListeners(key);
            updateUrl();
        };
        function encode(object)
        {
            var aurl = "";
            for (var key in object)
            {
                var value = object[key];
                if (aurl !== "") aurl += delimiter;
                aurl += key;
                if (value !== undefined && value !== null) aurl += assign + object[key];
            }
            return aurl;
        }
        function decode(aurl)
        {
            var object = { };
            var array = aurl.split(delimiter);
            for (var index in array)
            {
                var obj = array[index].split(assign);
                if (!obj[0]) continue;
                object[obj[0]] = obj[1];
            }
            return object;
        }
        function updateUrl()
        {
            var url = parseUrl(window.location.href);
            url[part] = encodeURI(encode(data));
            history.pushState("", "", compileHref(url));
        }
        function readUrl()
        {
            var url = parseUrl(window.location.href);
            //console.log(url);
            var newData = decode(decodeURI(url[part]));
            for (var key in newData)
            {
                if (data[key] === newData[key]) continue;
                data[key] = newData[key];
                callListeners(key);
            }
            for (var key in data)
            {
                if (key in newData) continue;
                delete data[key];
                callListeners(key);
            }
        }
        function parseUrl(href)
        {
            var url =
            {
                hash : "", host : "", hostname : "", origin : "", pathname : [ ], port : "", protocol : "", search : ""
            };
            var arr;
            arr = href.split("#", 2);
            if (arr[1]) url.hash = arr[1];
            arr = arr[0].split("?");
            if (arr[1]) url.search = arr[1];
            arr = arr[0].split("//");
            if (arr[1]) url.protocol = arr[0];
            arr = arr[1].split("/");
            url.host = arr[0];
            for (var q = 1; q < arr.length; q++) url.pathname.push(arr[q]);
            return url;
        }
        function compileHref(url)
        {
            var href = "";
            if (url.protocol) href += url.protocol + "//";
            href += url.host;
            for (var index in url.pathname) href += "/" + url.pathname[index];
            if (url.search) href += "?" + url.search;
            if (url.hash) href += "#" + url.hash;
            return href;
        }

        /**
         * инициализация включает считывание текущего урла и его разбор<br/>
         * добавляет привязку к событию изменения состояния истории<br/>
         * @returns {undefined}
         */
        this.init = function()
        {
            readUrl();
            window.addEventListener("popstate", readUrl, false);
            //$(window).bind("popstate", aURL.init);
        };
        //Сборка
    };




    /*
     
     //создаём экземпляр
     aURL = new aURL();
     
     //регистрирация метода changeCount под именем "changeCount" для ключа "count" вызываемого при изменеии урла
     aURL.setListener("changeCount", "count" , changeCount);
     
     //инициализация включает считывание текущего урла и его разбор
     aURL.init();
     
     
     //добавление параметра с именем "count" и значением count (так-же вызывается метод подмены урла)
     aURL.set("count", count);
     
     //считывание параметра с именем "count"
     var card = aURL.get("count");
     
     */

    return aURL;
});


