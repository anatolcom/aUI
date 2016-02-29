define([ "aui/core", "aui/extension" ],
function(core, extension)
{
//---------------------------------------------------------------------------
    function Movable(options)
    {
//Опции
        options = core.extend(
        {
            onmove : undefined,
            onmovestart : undefined,
            onmoveend : undefined
        }, options);
        core.Element.call(this, options);
        extension.movable(this);
//Переменные
        var that = this;
//Функции

//Сборка
        this.getElement().style.position = "absolute";
//    this.getElement().style.zIndex = "100";
//    e.style.top = "0px";
//    e.style.left = "0px";
        this.onMove(options.onmove);
        this.onMoveStart(options.onmovestart);
        this.onMoveEnd(options.onmoveend);
    }
    core.proto(Movable, core.Element);
//---------------------------------------------------------------------------
    return Movable;
//---------------------------------------------------------------------------
});