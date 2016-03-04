define([ "aui/core", "./Element" ],
function(core, Element)
{
//---------------------------------------------------------------------------
    function Scale(options)
    {
//Опции
        options = core.extend(
        {
            class : "scale",
            begin : 0,
            end : 10,
            count : 10,
            each : 5
        }, options);
//    options.element = "canvas";
        Element.call(this, options);
//Переменные
        var that = this;
        var count = options.count; //options.end - options.begin;
        var each = options.each;
        var labels = [ ];
//Функции

        function updateLabels()
        {
            for (var index in labels) labels[index].remove();
            labels = [ ];
            for (var q = 0; q <= count; q++)
            {
                if (q % each !== 0) continue;
                var label = new Element({ class : "val", text : q }).appendTo(that);
                label.getElement().style.position = "absolute";
                labels.push(label);
            }
        }
        function update()
        {
            draw(count, each);
        }
        function draw(count, each)
        {
            var computedStyle = window.getComputedStyle(that.getElement());
//        console.log("computedStyle", computedStyle);
            var rect = core.rectPadding(that);
//        console.log("rect", rect);
            var indent = { };
            indent.left = 0;
            indent.right = 0;
            indent.top = 0;
            indent.bottom = 0;
            var ce = canvas.getElement();
            ce.width = rect.right - rect.left;
            ce.height = rect.bottom - rect.top;
            var ctx = ce.getContext("2d");
            ctx.clearRect(0, 0, ce.width, ce.height); //Очистка области
            ctx.strokeStyle = computedStyle.color;
            var h2 = Math.ceil(ce.height / 2);
            var d = ((ce.width - indent.left - indent.right) - 1) / count;
            var b = ce.height;
            var index = 0;
            for (var q = 0; q <= count; q++)
            {
                var h = h2;
                var l = Math.ceil((d * q) + indent.left);
                if (q % each === 0)
                {
                    h = 0;
                    var text = String(q);
                    var label = labels[index];
                    var wt = label.width();
                    label.top(b);
                    label.left(rect.left + Math.ceil(l - (wt / 2)));
//                var wt = ctx.measureText(text).width;
//                ctx.fillText(text, Math.ceil(l - (wt / 2)), b);
                    index++;
                }
                ctx.moveTo(l + 0.5, h + 0.5);
                ctx.lineTo(l + 0.5, b - 0.5);
                ctx.stroke();
            }

//        ctx.moveTo(rect.left + 0.5, rect.top + 0.5);
//        ctx.lineTo(rect.left + 0.5, rect.bottom - 0.5);

//        ctx.moveTo(0 + 0.5, 0 + 0.5);
//        ctx.lineTo(0 + 0.5, element.height - 0.5);
//        ctx.stroke();

//        ctx.moveTo(rect.right - 0.5, rect.top + 0.5);
//        ctx.lineTo(rect.right - 0.5, rect.bottom - 0.5);

//        ctx.moveTo(element.width - 0.5, 0 + 0.5);
//        ctx.lineTo(element.width - 0.5, element.height - 0.5);
//        ctx.stroke();
        }
//Сборка
        this.getElement().style.position = "relative";
//    this.getElement().style.zIndex = "200";
//    var element = this.getElement();

        var canvas = new Element({ element : "canvas" }).appendTo(this);
        this.onResize(update);
        this.getElement().onclick = update;
        updateLabels();
    }
    core.proto(Scale, Element);
//---------------------------------------------------------------------------
    return Scale;
//---------------------------------------------------------------------------
});