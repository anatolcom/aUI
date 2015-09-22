var AURL = function()
{
    //Опции по умолчанию
    //Данные
    var that = this;
    var urlData = { };
    var listner = { };
    var delimiter = "&";
    var assign = "=";
    var part = "hash";
    //Функции
    this.setListner = function(name, fn)
    {
        if (fn) listner[name] = fn;
        else delete listner[name];
    };
    /**
     * добавление параметра с именем "card" и значением data (так-же вызывается метод подмены урла)
     * aURL.set("card", data);
     * @param {type} key имя параметра
     * @param {type} value значение параметра
     * @returns {undefined}
     */
    this.set = function(key, value)
    {
        if (!key && key !== 0 && key !== false) throw new Error("key : " + key + " not format");
        urlData[key] = value;
        updateUrl();
    };
    this.get = function(key)
    {
        if (key === undefined) return null;
        return urlData[key];
    };
    this.remove = function(key)
    {
        if (urlData[key] === undefined) return;
        delete urlData[key];
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
            if(value !== undefined && value !== null) aurl += assign + object[key];
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
        var url = new URL(window.location.href);
        url[part] = encodeURI(encode(urlData));
        history.pushState("", "", url);
        callListeners();
    }
    function readUrl()
    {
        var url = new URL(window.location.href);
        urlData = decode(decodeURI(url[part].substr(1)));
        callListeners();
    }
    function callListeners()
    {
        for (var name in listner) listner[name].call(that);
    }
    /**
     * инициализация включает считывание текущего урла и его разбор<br/>
     * необходимо сделать привязку к событию изменения состояния истории<br/>
     * window.addEventListener("popstate", aURL.init, false);<br/>
     * или<br/>
     * $(window).bind("popstate", aURL.init);<br/>
     * @returns {undefined}
     */
    this.init = function()
    {
        readUrl();
        window.addEventListener("popstate", readUrl, false);
    };
    //Сборка
};




/*
 //использование в методе онлоад
 
 //создаём экземпляр
 aURL = new AURL();
 //инициализация включает считывание текущего урла и его разбор
 aURL.init();
 //привязка к событию изменения состояния истории
 //$(window).bind("popstate", aURL.init);
 window.addEventListener("popstate", aURL.init, false);
 
 
 //добавление параметра с именем "card" и значением data (так-же вызывается метод подмены урла)
 aURL.set("card", data);
 
 //считывание параметра с именем "card"
 var card = aURL.get("card");
 
 //регистрирация метода show под именем "body" вызываемого при изменеии урла
 aURL.setListner("body", show);
 //удаление ранее зарегистрированного метода под именем "body" вызываемого при изменеии урла
 aURL.setListner("body", null);
 */
 