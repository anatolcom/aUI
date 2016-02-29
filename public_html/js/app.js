require([ "aui/aURL", "aui/aUtils", "aui/aUI", "DragManager" ],
function(aURL, aUtils, aUI) {

    var aurl = new aURL();
    function changeSections()
    {
        if (typeof fillSectionList === "function") fillSectionList(this.value);
    }
    function changeSelected()
    {
        if (typeof selectSection === "function") selectSection(this.value);
    }
    aurl.setListener("changeSections", "sections", changeSections);
    aurl.setListener("changeSelected", "selected", changeSelected);
    aurl.init();
    function paramUp(name)
    {
        //console.log(name, aurl.get(name));
        var value = aurl.getNumber(name);
        if (value === undefined) value = 0;
        else value++;
        aurl.set(name, value);
    }
    function paramDown(name)
    {
        var value = aurl.getNumber(name);
        if (value === undefined) return;
        if (--value < 0) aurl.remove(name);
        else aurl.set(name, value);
    }
    window.paramUp = paramUp;
    window.paramDown = paramDown;



    var nav = document.querySelector("body > nav");
    var menuAbsolute = new aUI.Element({ element : "menu", class : "absolute" }).appendTo(nav);
    new aUI.Link({ text : "add", onclick : function() {
            paramUp('sections');
        } }).appendTo(menuAbsolute);
    new aUI.Link({ text : "del", onclick : function() {
            paramDown('sections');
        } }).appendTo(menuAbsolute);





    //            var body = document.getElementsByTagName("body").item(0);
    //            var body = document.querySelector("body");
    var body = document.body;
    //            var parent = document.getElementsByTagName("section").item(0);
    var parent = document.querySelector("section");

    function selectSection(index)
    {
//        slist.select(index);//????????????????????????????????????????????????????????????????????????
    }
    function changeTopSection()
    {
        aurl.set("selected", this.selected());
    }


    var slist = new aUI.SList({ }).appendTo(parent);
    var buttonItem = slist.add({ text : "Button" }).content();
    var inputItem = slist.add({ text : "Input" }).content();
    var dragItem = slist.add({ text : "Drag" }).content();
    var calendarItem = slist.add({ text : "Calendar" }).content();
    var mouseItem = slist.add({ text : "Mouse" }).content();
    var linksItem = slist.add({ text : "Links" }).content();
    slist.select(aurl.get("selected"));
    slist.onChangeSelected(changeTopSection);

    var fieldButtons = new aUI.Field({ caption : "Кнопки" }).appendTo(buttonItem);
    var btn1 = new aUI.Button({ text : "button" }).appendTo(fieldButtons.value);

    var btn2 = new aUI.Button({ text : "selectable" }).appendTo(fieldButtons.value);

    var fieldInputs = new aUI.Field({ caption : "Поля ввода" }).appendTo(inputItem);
    var edit = new aUI.Edit({ placeholder : "Edit", examples : [ "01.01.2014", "01.01.2015" ] }).appendTo(fieldInputs.value);
    edit.validator(new aUI.validator.Pattern("\\d{2}.\\d{2}.\\d{4}"));
    edit.maxLength(10);
    //edit.attr("data-title", "Редактируемое поле с примерами");

    var select = new aUI.Select({ items : [ "...", "edit", "memo", "select" ], disabled : 0, value : 0 }).appendTo(fieldInputs.value);

    var memo = new aUI.Memo({ placeholder : "Memo" }).appendTo(fieldInputs.value);
    memo.validator(new aUI.validator.Pattern("[ а-яА-ЯёЁ\n\t]{0,}"));

    btn1.onClick(btn2.toggleSelect, edit.focus);
    btn2.onClick(btn2.toggleSelect, memo.value, "!!!", memo.focus);

    function changeDate()
    {
        edit.value(aUtils.dateToStr(this.value(), "dd.MM.yyyy"));
    }
    var calendar1 = new aUI.Calendar({ addclass : "small", onclickday : changeDate }).appendTo(calendarItem);
    var calendar2 = new aUI.Calendar({ addclass : "medium", onclickday : changeDate }).appendTo(calendarItem);
    var calendar3 = new aUI.Calendar({ addclass : "large", onchange : changeDate }).appendTo(calendarItem);

    var btnPopup = new aUI.Button({ class : "button", text : "Calendar" }).appendTo(calendarItem);
    btnPopup.onClick(function(event) {
        if (btnPopup.selected())
        {
            btnPopup.unselect();
            return;
        }
        btnPopup.select();
        var popup = new aUI.Popup().appendTo(btnPopup);

        var calendarPopup = new aUI.Calendar();
        calendarPopup.value(calendar3.value());
        calendarPopup.appendTo(popup);
        calendarPopup.onClickDay(function() {
            calendar3.value(this.value());
            popup.remove();
        });
        popup.onRemove(btnPopup.unselect);
    });

    new aUI.DateSelector({ }).appendTo(calendarItem);


    var xy1 = new aUI.XY().appendTo(mouseItem);
    var xy2 = new aUI.XY().appendTo(mouseItem);
    xy2.roundX(Math.round);
    xy2.roundY(Math.round);

    var progressGroup = new aUI.Element({ class : "group" }).appendTo(mouseItem);
    var progress1 = new aUI.Progress({ width : 200 }).appendTo(progressGroup);
    //   progress1.value(30);
    var progress2 = new aUI.Progress({ height : 200, orientation : "vertical" }).appendTo(mouseItem);
    //   progress2.value(70);

    var scroll1 = new aUI.Scroll({ width : 200, onchange : progress1.value }).appendTo(progressGroup);
    scroll1.value(70);
    var slider1 = new aUI.Slider({ width : 200, onchange : progress1.value }).appendTo(progressGroup);
    slider1.value(70);

    var range1 = new aUI.Range({ max : 10, width : 200, blocked : true }).appendTo(progressGroup);
    range1.round(Math.round);
    range1.valueMax(6);
    range1.valueMin(1);

    var scale = new aUI.Scale({ height : 6, width : 200 }).appendTo(progressGroup);

    var scroll2 = new aUI.Scroll({ height : 200, orientation : "vertical", onchange : progress2.value }).appendTo(mouseItem);
    scroll2.value(70);

    var range2 = new aUI.Range({ height : 200, orientation : "vertical" }).appendTo(mouseItem);
    range2.round(0.1);
    range2.valueMax(40);
    range2.valueMin(20);

    var dockMovable = new aUI.Element({ class : "dockMovable" }).appendTo(mouseItem);

    var movable = new aUI.Movable({ class : "movable", text : "Move Me!" }).appendTo(dockMovable);
    movable.onMove(function(event, dX, dY) {
        movable.left(movable.left() + dX);
        movable.top(movable.top() + dY);
    });



    var fieldLinks = new aUI.Field({ caption : "Полезные ссылки" }).appendTo(linksItem);
    fieldLinks.addClass("links");
    var links = [
        { text : "keyboard-events", href : "http://learn.javascript.ru/keyboard-events" },
        { text : "ajax-xmlhttprequest", href : "https://learn.javascript.ru/ajax-xmlhttprequest" },
        { text : "how-to-set-css3-transition-using-javascript", href : "http://stackoverflow.com/questions/8742249/how-to-set-css3-transition-using-javascript" },
        { text : "dom_obj_event", href : "http://www.w3schools.com/jsref/dom_obj_event.asp" },
        { text : "poryadok-srabatyvaniya-sobytiy", href : "http://javascript.ru/tutorial/events/intro#poryadok-srabatyvaniya-sobytiy" },
        { text : "dobavlenie-cherez-on-imya-sobytiya", href : "http://javascript.ru/tutorial/events/comparison#dobavlenie-cherez-on-imya-sobytiya" }
    ];
    for (var index in links) new aUI.Link(links[index]).appendTo(fieldLinks.value);




    var dragDock1 = new aUI.Element({ class : "dragDock dockMovable" }).appendTo(dragItem);
    var dragDock2 = new aUI.Element({ class : "dragDock dockMovable" }).appendTo(dragItem);
    var drag1 = new aUI.Element({ class : "movable", text : "drag me" }).appendTo(dragDock1);
    aUI.extensions.dragable(drag1);








    DragManager.onDragCancel = function(dragObject) {
        dragObject.avatar.rollback();
    };

    DragManager.onDragEnd = function(dragObject, dropElem)
    {
        dragObject.elem.style.display = "none";
        dropElem.classList.add('computer-smile');
        setTimeout(function()
        {
            dropElem.classList.remove('computer-smile');
        }, 200);
    };
}
);