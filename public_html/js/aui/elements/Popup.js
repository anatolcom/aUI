define([ "aui/core", "./Element" ],
function(core, Element)
{
//---------------------------------------------------------------------------
    function Popup(options)
    {
//Опции
        options = core.extend(
        {
            class : "popup",
            onremove : null
        }, options);
        Element.call(this, options);
//Переменные
        var that = this;
        var isClicked = true; //false;
        var ovner = null;
        var appendTo = this.appendTo;
        var remove = this.remove;
        var e = this.getElement();
//Функции
        function onDocumentWheelOrResize(event)
        {
            that.remove();
        }
//    function onDocumentMouseDown(event)
//    {
//        if (!isClicked) that.remove();
//        isClicked = false;
//    }
        function onDocumentClick(event)
        {
//        console.log("doc clk");
            if (!isClicked) that.remove();
            isClicked = false;
        }
        function show()
        {
            updatePosition();
//        core.addEvent(document, "mousedown", onDocumentMouseDown);
            core.addEvent(document, "click", onDocumentClick);
            core.addEvent(document, "wheel", onDocumentWheelOrResize);
            core.addEvent(document, "resize", onDocumentWheelOrResize);
            e.style.display = "";
        }
        function updatePosition()
        {
            if (!ovner) return;
            var rectOvner = ovner.getBoundingClientRect();
            var rectBody = document.body.getBoundingClientRect();
            e.style.top = (rectOvner.bottom - rectBody.top) + "px";
            e.style.left = (rectOvner.left - rectBody.left) + "px";
        }
        this.appendTo = function(parent)
        {
            ovner = core.getElement(parent);
            show();
            return that;
        };
        this.remove = function()
        {
            if (options.onremove) if (options.onremove() === false) return;
//        core.removeEvent(document, "mousedown", onDocumentMouseDown);
            core.removeEvent(document, "click", onDocumentClick);
            core.removeEvent(document, "wheel", onDocumentWheelOrResize);
            core.removeEvent(document, "resize", onDocumentWheelOrResize);
            remove();
        };
//    function onMouseDown(event)
//    {
//        isClicked = true;
//    }
        function onClick(event)
        {
//        console.log("clk");
            isClicked = true;
            event.preventDefault();
        }
        this.onRemove = function(fn)
        {
            if (fn === undefined) return options.onremove;
            if (typeof fn !== "function") throw new Error("fn for onRemove not a function");
            options.onremove = fn;
        };
//Сборка
//    e.onmousedown = onMouseDown;
        e.onclick = onClick;
        e.style.display = "none";
        e.style.position = "absolute";
        e.style.zIndex = "100";
        e.style.top = "0px";
        e.style.left = "0px";
//    var body = document.getElementsByTagName("body").item(0);
//    this.appendTo(body);
        appendTo(document.body);
    }
    core.proto(Popup, Element);
//---------------------------------------------------------------------------
    return Popup;
//---------------------------------------------------------------------------
});