define([ "aui/core", "aui/utils", "aui/validators", "aui/extensions",
    "aui/elements/Element",
    //standard
    "aui/elements/Link",
    "aui/elements/Button",
    "aui/elements/Check",
    "aui/elements/Edit",
    "aui/elements/Select",
    "aui/elements/Memo",
    //list
    "aui/elements/List",
    //area
    "aui/elements/Field",
    "aui/elements/Popup",
    "aui/elements/ScrollArea",
    "aui/elements/ScrollList",
    "aui/elements/SList",
    //date
    "aui/elements/Calendar",
    "aui/elements/DateSelector",
    //indicator
    "aui/elements/Progress",
    "aui/elements/Scale",
    //mouse
    "aui/elements/Scroll",
    "aui/elements/Slider",
    "aui/elements/Range",
    //experemental
    "aui/elements/Movable",
    "aui/elements/XY"
],
function(core, utils, validators, extensions,
Element,
//standard
Link, Button, Check, Edit, Select, Memo,
//list
List,
//area
Field, Popup, ScrollArea, ScrollList, SList,
//date
Calendar, DateSelector,
//indicator
Progress, Scale,
//mouse
Scroll, Slider, Range,
//experemental
Movable, XY
)
{
    var aUI = { };
//------------------------------------------------------------------------------------------------------------------- 
    aUI.extend = core.extend;
    aUI.proto = core.proto;
    aUI.construct = core.construct;
    aUI.getElement = core.getElement;
//-------------------------------------------------------------------------------------------------------------------
    aUI.utils = utils;
//-------------------------------------------------------------------------------------------------------------------
    aUI.validators = validators;
//-------------------------------------------------------------------------------------------------------------------
    aUI.extensions = extensions;
//-------------------------------------------------------------------------------------------------------------------
    aUI.Element = Element;
    //standard
    aUI.Link = Link;
    aUI.Button = Button;
    aUI.Check = Check;
    aUI.Edit = Edit;
    aUI.Select = Select;
    aUI.Memo = Memo;
    //list
    aUI.List = List;
    //area
    aUI.Field = Field;
    aUI.Popup = Popup;
    aUI.ScrollArea = ScrollArea;
    aUI.ScrollList = ScrollList;
    aUI.SList = SList;
    //date
    aUI.Calendar = Calendar;
    aUI.DateSelector = DateSelector;
    //indicator
    aUI.Progress = Progress;
    aUI.Scale = Scale;
    //mouse
    aUI.Scroll = Scroll;
    aUI.Slider = Slider;
    aUI.Range = Range;
    //experemental
    aUI.Movable = Movable;
    aUI.XY = XY;
//-------------------------------------------------------------------------------------------------------------------
    return aUI;
//-------------------------------------------------------------------------------------------------------------------
});