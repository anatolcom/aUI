var DragManager = function() {

    /**
     * составной объект для хранения информации о переносе:
     * {
     *   elem - элемент, на котором была зажата мышь
     *   avatar - аватар
     *   downX/downY - координаты, на которых был mousedown
     *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
     * }
     */
    var dragObject = { };

    var that = this;

    var limitForDrag = 30;

    function onMouseDown(event)
    {
        if (event.which !== 1) return;
        if (!event.target.closest) return;//???????????????????
        var elem = event.target.closest('.testDraggable');
        if (!elem) return;
        dragObject.elem = elem;
        // запомним, что элемент нажат на текущих координатах pageX/pageY
        dragObject.downX = event.pageX;
        dragObject.downY = event.pageY;
        return false;
    }

    function onMouseMove(event)
    {
        if (!dragObject.elem) return; // элемент не зажат
        if (!dragObject.avatar) // если перенос не начат...
        {
            var moveX = event.pageX - dragObject.downX;
            var moveY = event.pageY - dragObject.downY;
            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(moveX) < limitForDrag && Math.abs(moveY) < limitForDrag) return;

            // начинаем перенос
            dragObject.avatar = createAvatar(event); // создать аватар
            if (!dragObject.avatar) // отмена переноса, нельзя "захватить" за эту часть элемента
            {
                dragObject = { };
                return;
            }
            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;

            startDrag(event); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        dragObject.avatar.style.left = event.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = event.pageY - dragObject.shiftY + 'px';

        return false;
    }

    function onMouseUp(event)
    {
        if (dragObject.avatar) finishDrag(event); // если перенос идет
        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        dragObject = { };
    }
    
    function startDrag(event)
    {
        var avatar = dragObject.avatar;
        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }
    function finishDrag(event)
    {
        var droppableElement = findDroppable(event);
        if (!droppableElement) that.onDragCancel(dragObject);
        else that.onDragEnd(dragObject, droppableElement);
    }

    function createAvatar(event)
    {
        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
        var avatar = dragObject.elem;
        var keep =
        {
            parent : avatar.parentNode,
            nextSibling : avatar.nextSibling,
            position : avatar.position || '',
            left : avatar.left || '',
            top : avatar.top || '',
            zIndex : avatar.zIndex || ''
        };
        // функция для отмены переноса
        avatar.rollback = function()
        {
            keep.parent.insertBefore(avatar, keep.nextSibling);
            avatar.style.position = keep.position;
            avatar.style.left = keep.left;
            avatar.style.top = keep.top;
            avatar.style.zIndex = keep.zIndex;
        };
        return avatar;
    }

    function findDroppable(event)
    {
        // спрячем переносимый элемент
//        console.log("dragObject", dragObject);
//        console.log("dragObject event", event);
//        event.target.hidden = true;
        dragObject.avatar.hidden = true;
        // получить самый вложенный элемент под курсором мыши
        console.log("X", event.clientX, "Y", event.clientY);
        var topElement = document.elementFromPoint(event.clientX, event.clientY);
        console.log("topElement", topElement);
        // показать переносимый элемент обратно
        dragObject.avatar.hidden = false;
//        event.target.hidden = false;
        if (topElement === null) return null; // такое возможно, если курсор мыши "вылетел" за границу окна
        var droppableElement = topElement.closest(".testDroppable");
        console.log("droppableElement", droppableElement);
        return droppableElement;
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;
//    aUtils.addEvent(document, "mousemove", onMouseMove);
//    aUtils.addEvent(document, "mouseup", onMouseUp);
//    aUtils.addEvent(document, "mousedown", onMouseDown);

    this.onDragEnd = function(dragObject, dropElem) {
    };
    this.onDragCancel = function(dragObject) {
    };

};


function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top : box.top + pageYOffset,
        left : box.left + pageXOffset
    };

}