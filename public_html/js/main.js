/* global require */

require.config({
    paths : {
        "aUI" : "aUI",
//        "aUI" : "aUI_single",
//        "aUI" : "aUI_mini",
        "aURL" : "aURL"
    }
});
require([ "aURL", "aUI", "DragManager" ],
function(aURL, aUI) {

    console.dir(aUI);
//    var aUtils = aUI.utils; 
    var aurl = new aURL();
    var fillSectionList;
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


    var slist = new aUI.SList({ }).appendTo(parent);
    var buttonItem = slist.add({ text : "Button" }).content();
    var inputItem = slist.add({ text : "Input" }).content();
    var dragItem = slist.add({ text : "Drag" }).content();
    var calendarItem = slist.add({ text : "Calendar" }).content();
    var mouseItem = slist.add({ text : "Mouse" }).content();
    var tableItem = slist.add({ text : "Table" }).content();
    var linksItem = slist.add({ text : "Links" }).content();

    var fieldButtons = new aUI.Field({ caption : "Кнопки" }).appendTo(buttonItem);
    var btn1 = new aUI.Button({ text : "button" }).appendTo(fieldButtons.value);
    var btn2 = new aUI.Button({ text : "selectable" }).appendTo(fieldButtons.value);

    var fieldInputs = new aUI.Field({ caption : "Поля ввода" }).appendTo(inputItem);
    var edit = new aUI.Edit({ placeholder : "Edit", examples : [ "01.01.2014", "01.01.2015" ] }).appendTo(fieldInputs.value);
    edit.validator(new aUI.validators.Pattern("\\d{2}.\\d{2}.\\d{4}"));
    edit.maxLength(10);
    //edit.attr("data-title", "Редактируемое поле с примерами");

    var select = new aUI.Select({ items : [ "...", "edit", "memo", "select" ], disabled : 0, value : 0 }).appendTo(fieldInputs.value);
    select.onChange(function() {
        memo.value(select.value());
    });

    var memo = new aUI.Memo({ placeholder : "Memo" }).appendTo(fieldInputs.value);
    memo.validator(new aUI.validators.Pattern("[ а-яА-ЯёЁ\n\t]{0,}"));
    memo.required(true);

    btn1.onClick(btn2.toggleSelect, edit.focus);
    btn2.onClick(btn2.toggleSelect, memo.value, "текст", memo.focus);

    function changeDate()
    {
        edit.value(aUI.utils.dateToStr(this.value(), "dd.MM.yyyy"));
    }

    var viewSelect = new aUI.List({ class : "buttons" }).appendTo(calendarItem);

    var viewSet = new aUI.ViewSet().appendTo(calendarItem);
    var viewSmall = viewSet.add();
    var viewMedium = viewSet.add();
    var viewLarge = viewSet.add();

    function onClick()
    {
        viewSelect.selectSingle(this.index());
    }
    function onViewSelect()
    {
        if (this.selected()) viewSet.view(this.index());
    }
    viewSelect.add({ class : "button", text : "small", onclick : onClick, onchangeselected : onViewSelect });
    viewSelect.add({ class : "button", text : "medium", onclick : onClick, onchangeselected : onViewSelect });
    viewSelect.add({ class : "button", text : "large", onclick : onClick, onchangeselected : onViewSelect });
    viewSelect.selectSingle(1);


    var calendar1 = new aUI.Calendar({ addclass : "small", onclickday : changeDate }).appendTo(viewSmall);
    var calendar2 = new aUI.Calendar({ addclass : "medium", onclickday : changeDate }).appendTo(viewMedium);
    var calendar3 = new aUI.Calendar({ addclass : "large", onchange : changeDate }).appendTo(viewLarge);

    var btnPopup = new aUI.Button({ class : "button", text : "Calendar" }).appendTo(calendarItem);
    btnPopup.onClick(function() {
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
    var scroll2 = new aUI.Scroll({ class : "scroll touch", width : 200, onchange : progress1.value }).appendTo(progressGroup);
    scroll2.value(70);

    var range1 = new aUI.Range({ max : 10, width : 200, blocked : true }).appendTo(progressGroup);
    range1.round(Math.round);
    range1.valueMax(6);
    range1.valueMin(1);

    var scale = new aUI.Scale({ height : 6, width : 200 }).appendTo(progressGroup);

    var switch1 = new aUI.Switch().appendTo(progressGroup);

    var scroll3 = new aUI.Scroll({ height : 200, orientation : "vertical", onchange : progress2.value }).appendTo(mouseItem);
    scroll3.value(70);

    var range2 = new aUI.Range({ height : 200, orientation : "vertical" }).appendTo(mouseItem);
    range2.round(0.1);
    range2.valueMax(40);
    range2.valueMin(20);



    var dockMovable = new aUI.Element({ class : "dockMovable" }).appendTo(mouseItem);

    var movable = new aUI.Movable({ class : "movable", text : "Move Me!" }).appendTo(dockMovable);
    movable.onMove(function(dX, dY) {
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
        { text : "dobavlenie-cherez-on-imya-sobytiya", href : "http://javascript.ru/tutorial/events/comparison#dobavlenie-cherez-on-imya-sobytiya" },
        { text : "Web/API/Touch/target", href : "https://developer.mozilla.org/en-US/docs/Web/API/Touch/target" }
    ];
    for (var index in links) new aUI.Link(links[index]).appendTo(fieldLinks.value);




    var dock1 = new aUI.Element({ }).appendTo(dragItem);
    aUI.extensions.droppable(dock1);
    var dock2 = new aUI.Element({ }).appendTo(dragItem);
    aUI.extensions.droppable(dock2);
    var drag1 = new aUI.Element({ text : "drag 1" }).appendTo(dock1);
    aUI.extensions.draggable(drag1);
    var drag2 = new aUI.Element({ text : "drag 2" }).appendTo(dock1);
    aUI.extensions.draggable(drag2);
    var drag3 = new aUI.Element({ text : "drag 3" }).appendTo(dock1);
    aUI.extensions.draggable(drag3);




    function fillEdit(data)
    {
        var edit = new aUI.Edit().appendTo(this);
        edit.value(data);
    }
    function fillDate(data)
    {
        var dateSelector = new aUI.DateSelector().appendTo(this);
        var date = aUI.utils.strToDate(data, "yyyy-MM-dd");
        dateSelector.value(aUI.utils.dateToStr(date, dateSelector.mask()));
    }
    function fillAction(data)
    {
        var edit = new aUI.Button({ text : "action" }).appendTo(this);
    }
    function onAction()
    {
        //alert(data);
        console.log(this.data.entry[this.data.key]);
    }

    var table = new aUI.Table().appendTo(tableItem);
    var tableMapper = new aUI.Table.Mapper({ table : table });
    tableMapper.fields([
        { key : 0, head : { text : "String" }, fill : fillEdit },
        { key : 1, head : { text : "Number" }, onclick : onAction },
        { key : 2, head : { text : "Date" }, fill : fillDate },
        { key : 3, head : { text : "Action" }, fill : fillAction }
    ]);
    tableMapper.entries([
        [ "a", 1, "2016-03-01" ],
        [ "b", 2, "2016-03-02" ],
        [ "c", 3, "2016-03-03" ],
        [ "d", 4, "2016-03-04" ]
    ]);
    tableMapper.fill();


    //-------- INIT ---

    aurl.init();
    function changeTopSection()
    {
        aurl.set("selected", this.selected());
    }
    slist.select(aurl.get("selected"));
    slist.onChangeSelected(changeTopSection);

    var dragManager = new DragManager();

    dragManager.onDragCancel = function(dragObject)
    {
        dragObject.avatar.rollback();
    };

    dragManager.onDragEnd = function(dragObject, dropElem)
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