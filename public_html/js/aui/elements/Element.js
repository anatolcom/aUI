define([ "aui/core" ],
function(core)
{
//---------------------------------------------------------------------------
    function Element(options)
    {
//Опции
        options = core.extend(
        {
            class : "check",
            value : null
        }, options);
        core.Base.call(this, options);
//Функции
        //  function getValue() { return $(input).is(":checked"); }
        //  function setValue(value)
        //  {
        //   if (getValue() === value) return this;
        //   if (value) $(input).attr("checked", "checked");
        //   else $(input).removeAttr("checked");
        //   return this;
        //  }
        //  function setFocus() { $(input).focus(); }
//События
        //  function setKeyPress(fn) { $(input).keypress(fn); }
        //  function setChange(fn) { $(input).change(fn); }
//Сборка
        //  var check = core.Element({ class : options.class, id : options.id });
        //  check.getValue = getValue;
        //  check.setValue = setValue;
        //  check.setFocus = setFocus;
        //  check.setKeyPress = setKeyPress;
        //  check.setChange = setChange;
        //  var input = core.Element({ element : "input" });
        //  $(input).attr("type", "checkbox");
        //// input.style.width="100%";
        //// input.style.height="100%";
        //  check.setValue(options.value);
        //  input.appendTo(check);
        //  //Возврат результата выполненого после сборки
        //  return check;
    }
    core.proto(Element, core.Base);
//---------------------------------------------------------------------------
    return Element;
//---------------------------------------------------------------------------
});