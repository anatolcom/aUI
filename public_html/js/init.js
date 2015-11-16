/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function init()
{
    var aURL = new AURL();
    function changeSections()
    {
        if (typeof fillSectionList === "function") fillSectionList(this.value);
    }
    function changeSelected()
    {
        if (typeof selectSection === "function") selectSection(this.value);
    }
    aURL.setListener("changeSections", "sections", changeSections);
    aURL.setListener("changeSelected", "selected", changeSelected);
    
    function paramUp(name)
    {
        //console.log(name, aURL.get(name));
        var value = aURL.getNumber(name);
        if (value === undefined) value = 0;
        else value++;
        aURL.set(name, value);
    }
    function paramDown(name)
    {
        var value = aURL.getNumber(name);
        if (value === undefined) return;
        if (--value < 0) aURL.remove(name);
        else aURL.set(name, value);
    }
    console.log("1");


    function addSection(caption)
    {
        sectionMenu.add({ text : caption, onclick : sectionMenuClick });
        if (sectionMenu.count() === 1) sectionMenu.selectSingle(0);
        var section = sections.add({ class : "section" });
        new aUI.Element({ class : "caption", text : caption }).appendTo(section);
        return new aUI.Element({ class : "content" }).appendTo(section);
    }
    function selectSection(index)
    {
        if (sectionList.topIndex() === Number(index)) return;
        sectionList.topIndex(index);
    }
    function sectionMenuClick()
    {
        aURL.set("selected", this.index());
    }
    function changeTopSection()
    {
        sectionMenu.selectSingle(this.index());
        aURL.set("selected", this.index());
    }

    var parent = document.getElementsByTagName("section").item(0);

    var sectionMenu = new aUI.List({ class : "sectionMenu" }).appendTo(parent);//caption:"Button"

    var sectionList = new aUI.ScrollList({ class : "scrollarea", vertical : "show", listOptions : { class : "sections" } });
    sectionList.appendTo(parent);
    sectionList.onChangeTop(changeTopSection);
    var sections = sectionList.list();

    var section1 = addSection("Input");
    var section2 = addSection("Calendar");

    selectSection(aURL.get("selected"));

    console.log("2");
    
    
    var slist = new aUI.SList({ }).appendTo(parent);
    var buttonItem = slist.add({ text : "Button" });
    var inputItem = slist.add({ text : "Input" });
    var calendarItem = slist.add({ text : "Calendar" });

    var btn1 = new aUI.Button({ text : "button" }).appendTo(section1);

    var btn2 = new aUI.Button({ text : "selectable" }).appendTo(section1);
    btn2.onClick(btn2.toggleSelect);

    var edit = new aUI.Edit({ placeholder : "Edit", examples : [ "01.01.2014", "01.01.2015" ] }).appendTo(section1);
    edit.validator(new aUI.validator.Pattern("\\d{2}.\\d{2}.\\d{4}"));
    edit.maxLength(10);

    var select = new aUI.Select({ items : [ "...", "edit", "memo", "select" ], disabled : 0, value : 0 }).appendTo(section1);

    var memo = new aUI.Memo({ placeholder : "Memo" }).appendTo(section1);
    memo.validator(new aUI.validator.Pattern("[ а-яА-ЯёЁ\n\t]{0,}"));


    function changeDate()
    {
        edit.value(aUtils.dateToStr(this.value(), "dd.MM.yyyy"));
    }
    var calendar1 = new aUI.Calendar({ onchange : changeDate });
    calendar1.appendTo(section2);
    var calendar2 = new aUI.Calendar({ onchange : changeDate });
    calendar2.addClass("medium");
    calendar2.appendTo(section2);
    var calendar3 = new aUI.Calendar({ onchange : changeDate });
    calendar3.addClass("large");
    calendar3.appendTo(section2);
    console.log("3");
    
    aURL.init();
}
