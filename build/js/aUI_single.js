define("aui/core", [], function() {
    var core = {};
    return core.extend = function(source, target) {
        var value = {};
        for (var index in source) value[index] = source[index];
        for (var index in target) value[index] = target[index];
        return value;
    }, core.proto = function(heir, base) {
        heir.prototype = Object.create(base.prototype), heir.prototype.constructor = heir;
    }, core.construct = function(constructor, args) {
        var array = [ null ];
        if (args instanceof Array) array = args; else for (var index in arguments) array.push(args[index]);
        return new (Function.prototype.bind.apply(constructor, array));
    }, core.getElement = function(element) {
        if (element === undefined) throw new Error("undefined is not element");
        if (element === null) throw new Error("null is not element");
        if (typeof element != "object") throw new Error("no object is not element");
        if (element instanceof HTMLElement
) return element;
        if (element instanceof core.Element) return element.getElement();
        if (element[0] instanceof HTMLElement) return element[0];
        throw console.log("getElement", element), new Error("is not HTMLElement");
    }, core.rectPadding = function(target) {
        var element = core.getElement(target), computedStyle = window.getComputedStyle(element), rect = {};
        return rect.left = parseInt(computedStyle.paddingLeft, 10), isNaN(rect.left) && (rect.left = 0), rect.right = element.clientWidth - parseInt(computedStyle.paddingRight, 10), isNaN(rect.right) && (rect.right = target.width), rect.top = parseInt(computedStyle.paddingTop, 10), isNaN(rect.top) && (rect.top = target.height), rect.bottom = element.clientHeight - parseInt(computedStyle.paddingBottom, 10), isNaN(rect.bottom) && (rect.bottom = 0), rect;
    }, core.addEvent = function(object, eventName, on) {
        object.addEventListener(eventName, on, !1);
    }, core.removeEvent = function(object
, eventName, on) {
        object.removeEventListener(eventName, on, !1);
    }, core.Element = function Element(options) {
        options = core.extend({
            element: "div",
            id: null,
            "class": null,
            addclass: null,
            text: null
        }, options);
        var that = this, onresize = null;
        this.getElement = function() {
            return element;
        }, this.appendTo = function(parent) {
            parent = core.getElement(parent);
            if (typeof parent.appendChild != "function") throw new Error("parent not contain appendChild function");
            return parent.appendChild(that.getElement()), that.resize(), that;
        }, this.clear = function() {
            var element = that.getElement();
            while (element.childNodes[0] !== undefined) element.removeChild(element.childNodes[0]);
        }, this.remove = function() {
            var element = that.getElement(), parent = element.parentElement;
            
parent && parent.removeChild(element);
        }, this.id = function(id) {
            if (id === undefined) return that.getElement().id;
            that.getElement().id = id;
        }, this.class = function(name) {
            if (name === undefined) return that.getElement().className;
            that.getElement().className = name;
        }, this.addClass = function(name) {
            that.getElement().classList.add(name);
        }, this.removeClass = function(name) {
            that.getElement().classList.remove(name);
        }, this.hasClass = function(name) {
            return that.getElement().classList.contains(name);
        }, this.toggleClass = function(name) {
            that.getElement().classList.toggle(name);
        }, this.text = function(text) {
            if (text === undefined) return that.getElement().textContent;
            that.getElement().textContent = text;
        }, this.attr = function(name, value) {
            if (value === undefined) return that
.getElement().getAttribute(name);
            that.getElement().setAttribute(name, value);
        }, this.hidden = function(hidden) {
            if (hidden === undefined) return that.getElement().style.display === "none";
            hidden ? that.getElement().style.display = "none" : that.getElement().style.display = "";
        }, this.toggleHidden = function() {
            that.hidden(!that.hidden());
        }, this.left = function(value) {
            if (value === undefined) {
                var computedStyle = window.getComputedStyle(that.getElement()), marginLeft = parseInt(computedStyle.marginLeft, 10);
                return that.getElement().offsetLeft - marginLeft;
            }
            value === null && (value = ""), typeof value == "number" && (value += "px"), that.getElement().style.left = value;
        }, this.right = function(value) {
            if (value === undefined) {
                var computedStyle = window.getComputedStyle(that.getElement()), marginRight = 
parseInt(computedStyle.marginRight, 10);
                return that.getElement().offsetRight - marginRight;
            }
            value === null && (value = ""), typeof value == "number" && (value += "px"), that.getElement().style.right = value;
        }, this.top = function(value) {
            if (value === undefined) {
                var computedStyle = window.getComputedStyle(that.getElement()), marginTop = parseInt(computedStyle.marginTop, 10);
                return that.getElement().offsetTop - marginTop;
            }
            value === null && (value = ""), typeof value == "number" && (value += "px"), that.getElement().style.top = value;
        }, this.bottom = function(value) {
            if (value === undefined) {
                var computedStyle = window.getComputedStyle(that.getElement()), marginBottom = parseInt(computedStyle.marginBottom, 10);
                return that.getElement().offsetBottom - marginBottom;
            }
            value === null && (value = ""
), typeof value == "number" && (value += "px"), that.getElement().style.bottom = value;
        }, this.width = function(value) {
            if (value === undefined) return element.offsetWidth;
            value === null && (value = ""), typeof value == "number" && (value += "px"), element.style.width = value, onresize && onresize.call(that);
        }, this.height = function(value) {
            if (value === undefined) return element.offsetHeight;
            value === null && (value = ""), typeof value == "number" && (value += "px"), element.style.height = value, onresize && onresize.call(that);
        }, this.clientWidth = function(value) {
            if (value === undefined) return element.clientWidth;
        }, this.clientHeight = function(value) {
            if (value === undefined) return element.clientHeight;
        }, this.onResize = function(fn) {
            if (fn === undefined) return onresize;
            if (typeof fn != "function") throw new Error("fn for onResize not a function"
);
            onresize = fn;
        }, this.resize = function() {
            onresize && onresize.call(that);
        };
        var element = document.createElement(options.element);
        element.aui = this, options.id && this.id(options.id), options.class && this.class(options.class), options.addclass && this.addClass(options.addclass), (options.text || options.text === 0 || options.text === !1) && this.text(options.text), (options.width || options.width === 0) && this.width(options.width), (options.height || options.height === 0) && this.height(options.height), core.addEvent(element, "resize", this.resize);
    }, core;
}), define("aui/utils", [], function() {
    var aUtils = {};
    function NumInRange(value, min, max) {
        var that = this, data = {
            value: 0,
            min: min,
            max: max
        }, onchange = null;
        this.value = function(value) {
            if (value === undefined) return data.value;
            var temp = aUtils.trimByRange
(value, data.min, data.max);
            if (data.value === temp) return;
            data.value = temp, onchange && onchange.call(that, data.value);
        }, this.min = function(min) {
            if (min === undefined) return data.min;
            data.min = min, data.value = aUtils.trimByRange(data.value, data.min, data.max);
        }, this.max = function(max) {
            if (max === undefined) return data.max;
            data.max = max, data.value = aUtils.trimByRange(data.value, data.min, data.max);
        }, this.onChange = function(fn) {
            if (fn === undefined) return onchange;
            if (typeof fn != "function") throw new Error("fn for onChange not a function");
            onchange = fn;
        }, data.value = aUtils.trimByRange(value, min, max);
    }
    return aUtils.NumInRange = NumInRange, aUtils.trimByRange = function(value, min, max) {
        return value < min ? min : value > max ? max : value;
    }, aUtils.inRange = function(value, min, max) {
        
return value < min ? !1 : value > max ? !1 : !0;
    }, aUtils.inRect = function(x, y, rect) {
        return aUtils.inRange(x, rect.left, rect.right) ? aUtils.inRange(y, rect.top, rect.bottom) ? !0 : !1 : !1;
    }, aUtils.convertRangedValue = function(a, minA, maxA, minB, maxB) {
        var lenA = maxA - minA, lenB = maxB - minB, b = minB + (a - minA) * lenB / lenA;
        return b;
    }, aUtils.numberToStrLen = function(number, length) {
        var value = String(number);
        while (value.length < length) value = "0" + value;
        return value;
    }, aUtils.dateToStr = function(date, format) {
        if (!format) return "";
        function replace(str, mask, value, len) {
            return str.replace(new RegExp(mask), aUtils.numberToStrLen(value, len));
        }
        function fill(value, date) {
            return value = replace(value, "yyyy", date.getFullYear(), 4), value = replace(value, "MM", date.getMonth() + 1, 2), value = replace(value, "dd", date.getDate()
, 2), value = replace(value, "HH", date.getHours(), 2), value = replace(value, "mm", date.getMinutes(), 2), value = replace(value, "ss", date.getSeconds(), 2), value = replace(value, "SSS", date.getMilliseconds(), 3), value;
        }
        try {
            var array = format.split("'"), value = "";
            for (var q = 0; q < array.length; q++) q % 2 === 0 ? value += fill(array[q], date) : value += array[q];
            return value;
        } catch (err) {
            throw new Error("formatDate(" + err.message + ")");
        }
    }, aUtils.strToDate = function(value, format) {
        function fill(value, trimFormat, mask, len) {
            var m = trimFormat.match(new RegExp(mask));
            if (m === null) return 0;
            var s = value.substr(m.index, len);
            if (!s) throw new Error('"' + mask + '" not found');
            var n = Number(s);
            if (isNaN(n)) throw new Error('"' + mask + '" : "' + s + '" is not a number');
            return n;
        
}
        function spaces(length) {
            var value = "";
            while (value.length < length) value = " " + value;
            return value;
        }
        try {
            var array = format.split("'"), trimFormat = "";
            for (var q = 0; q < array.length; q++) q % 2 === 0 ? trimFormat += array[q] : trimFormat += spaces(array[q].length);
            var date = {
                year: 0,
                month: 0,
                day: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            };
            return date.year = fill(value, trimFormat, "yyyy", 4), date.month = fill(value, trimFormat, "MM", 2) - 1, date.day = fill(value, trimFormat, "dd", 2), date.hours = fill(value, trimFormat, "HH", 2), date.minutes = fill(value, trimFormat, "mm", 2), date.seconds = fill(value, trimFormat, "ss", 2), date.milliseconds = fill(value, trimFormat, "SSS", 3), new Date(date.year, date.month, date.day, date
.hours, date.minutes, date.seconds, date.milliseconds);
        } catch (err) {
            throw new Error('value "' + value + '" does not match format "' + format + '" because: ' + err.message);
        }
    }, aUtils.saveBlobAsFile = function(blob, filename) {
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
            return;
        }
        var url = window.URL.createObjectURL(blob), errorText = null, a = document.createElement("a");
        if (typeof a.download == "string") try {
            a.href = url, a.download = filename, a.style.display = "none", document.body.appendChild(a), a.click();
        } catch (err) {
            errorText = "Возникли проблемы при скачивании...";
        } else console.error("download name not set"), window.location.href = url;
        document.body.removeChild(a), window.URL.revokeObjectURL(url);
        if (errorText) throw new Error(errorText);
    }, aUtils.toUriParams = function(params) {
        
return params ? Object.keys(params).map(function(key) {
            var value = params[key];
            return typeof value == "object" && (value = JSON.stringify(value)), encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }).join("&") : "";
    }, aUtils.download = function(url, params, onload) {
        function extractFileName(value, alter) {
            if (value === null) return alter;
            var expression = new RegExp("filename[^;=\\n]*=(['\"]?(.*)['\"]|[^;\\n]*)", ""), match = value.match(expression);
            return match ? match[2] !== undefined ? decodeURIComponent(match[2]) : match[1] !== undefined ? decodeURIComponent(match[1]) : alter : alter;
        }
        var alterFileName = "download.dat", p = aUtils.toUriParams(params);
        p !== "" && (url += "?" + p);
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, !0), xhr.responseType = "blob", xhr.onload = function(event) {
            try {
                var contentDisposition = 
this.getResponseHeader("Content-Disposition");
                aUtils.saveBlobAsFile(this.response, extractFileName(contentDisposition, alterFileName)), typeof onload == "function" && onload();
            } catch (err) {
                typeof onload == "function" && onload(err.message);
            }
        }, xhr.send();
    }, aUtils.download = function(url, params, onload) {
        function extractFileName(value, alter) {
            if (value === null) return alter;
            var expression = new RegExp("filename[^;=\\n]*=(['\"]?(.*)['\"]|[^;\\n]*)", ""), match = value.match(expression);
            return match ? match[2] !== undefined ? decodeURIComponent(match[2]) : match[1] !== undefined ? decodeURIComponent(match[1]) : alter : alter;
        }
        var alterFileName = "download.dat", p = aUtils.toUriParams(params);
        p !== "" && (url += "?" + p);
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, !0), xhr.responseType = "blob", xhr.onload = function(
event) {
            try {
                var contentDisposition = this.getResponseHeader("Content-Disposition");
                aUtils.saveBlobAsFile(this.response, extractFileName(contentDisposition, alterFileName)), typeof onload == "function" && onload();
            } catch (err) {
                typeof onload == "function" && onload(err.message);
            }
        }, xhr.send();
    }, aUtils;
}), define("aui/validators/Pattern", [], function() {
    function Pattern(value) {
        var pattern = null, expression = null;
        this.pattern = function(value) {
            if (value === undefined) return pattern;
            pattern = value, pattern ? expression = new RegExp(pattern, "") : expression = null;
        }, this.validate = function(value) {
            if (expression === null) return !0;
            var match = value.match(expression);
            return match ? match[0] === value : !1;
        }, this.pattern(value);
    }
    return Pattern;
}), define("aui/validators"
, [ "aui/validators/Pattern" ], function(Pattern) {
    var validators = {};
    return validators.Pattern = Pattern, validators;
}), define("aui/extensions", [ "aui/core" ], function(core) {
    var extensions = {};
    return extensions.selectable = function(owner) {
        var className = "selected";
        owner.selectedClass = function(name) {
            if (name === undefined) return className;
            className = name;
        }, owner.select = function() {
            owner.addClass(owner.selectedClass());
        }, owner.unselect = function() {
            owner.removeClass(owner.selectedClass());
        }, owner.selected = function() {
            return owner.hasClass(owner.selectedClass());
        }, owner.toggleSelect = function() {
            owner.toggleClass(owner.selectedClass());
        };
    }, extensions.resizable = function(owner) {
        var onresize = null, element = core.getElement(owner);
        owner.width = function(value) {
            if (value === 
undefined) return element.offsetWidth;
            value === null && (value = ""), typeof value == "number" && (value += "px"), element.style.width = value, onresize && onresize.call(owner);
        }, owner.height = function(value) {
            if (value === undefined) return element.offsetHeight;
            value === null && (value = ""), typeof value == "number" && (value += "px"), element.style.height = value, onresize && onresize.call(owner);
        }, owner.clientWidth = function(value) {
            if (value === undefined) return element.clientWidth;
        }, owner.clientHeight = function(value) {
            if (value === undefined) return element.clientHeight;
        }, owner.onResize = function(fn) {
            if (fn === undefined) return onresize;
            if (typeof fn != "function") throw new Error("fn for onResize not a function");
            onresize = fn;
        }, owner.resize = function() {
            onresize && onresize.call(owner, event);
        }, core
.addEvent(element, "resize", owner.resize);
    }, extensions.clickable = function(owner) {
        var fnList = [], onclick = null;
        owner.onClick = function(fn) {
            if (arguments.length === 0) return onclick;
            if (arguments.length === 1 && arguments[0] === null) {
                onclick = null;
                return;
            }
            if (arguments.length === 1 && typeof arguments[0] == "function") {
                onclick = arguments[0];
                return;
            }
            if (typeof arguments[0] != "function") throw new Error('type of onclick arguments[0] "' + typeof arguments[0] + '" is not a function');
            for (var index in arguments) typeof arguments[index] == "function" ? fnList.push({
                fn: arguments[index],
                args: []
            }) : fnList[fnList.length - 1].args.push(arguments[index]);
            onclick = function() {
                for (var index in fnList) fnList[index].fn.apply(owner
, fnList[index].args);
            };
        }, owner.click = function() {
            onclick && onclick.apply(owner, arguments);
        }, owner.getElement().onclick = owner.click;
    }, extensions.validable = function(owner) {
        var required = !1, validator = null;
        function onvalidate() {
            validate(owner.value(), required) ? owner.removeClass("invalid") : owner.addClass("invalid");
        }
        function validate(value, required) {
            return value.length === 0 ? !required : validator ? validator.validate(value) : !0;
        }
        owner.required = function(value) {
            if (value === undefined) return required;
            required = value;
        }, owner.validator = function(value) {
            if (value === undefined) return validator;
            validator = value;
        }, owner.invalid = function() {
            return onvalidate(), owner.hasClass("invalid");
        };
        var element = core.getElement(owner);
        
element.onfocus = onvalidate, element.onkeyup = onvalidate;
    }, extensions.movable = function(owner) {
        var element = core.getElement(owner), onmovestart = null, onmoveend = null, onmove = null, keepedClientX = 0, keepedClientY = 0, lockX = !1, lockY = !1, isRefreshOffsetOnMove = !0;
        function onMouseDown(event) {
            core.addEvent(document, "mousemove", onMouseMove), core.addEvent(document, "mouseup", onMouseUp), keepedClientX = event.clientX, keepedClientY = event.clientY, onmovestart && onmovestart.call(owner, event), event.preventDefault ? event.preventDefault() : event.returnValue = !1;
        }
        function onMouseUp(event) {
            core.removeEvent(document, "mousemove", onMouseMove), core.removeEvent(document, "mouseup", onMouseUp), onmoveend && onmoveend.call(owner, event), event.preventDefault ? event.preventDefault() : event.returnValue = !1;
        }
        function onMouseMove(event) {
            var dX = 0;
            lockX || (dX = event
.clientX - keepedClientX);
            var dY = 0;
            lockY || (dY = event.clientY - keepedClientY), isRefreshOffsetOnMove && (keepedClientX = event.clientX, keepedClientY = event.clientY), onmove && onmove.call(owner, event, dX, dY);
        }
        function onDragStart() {
            return !1;
        }
        owner.onMoveStart = function(fn) {
            if (fn === undefined) return onmovestart;
            if (fn !== null && typeof fn != "function") throw new Error("fn for onMoveStart not a function");
            onmovestart = fn;
        }, owner.onMove = function(fn) {
            if (fn === undefined) return onmove;
            if (fn !== null && typeof fn != "function") throw new Error("fn for onMove not a function");
            onmove = fn;
        }, owner.onMoveEnd = function(fn) {
            if (fn === undefined) return onmoveend;
            if (fn !== null && typeof fn != "function") throw new Error("fn for onMoveEnd not a function");
            onmoveend = 
fn;
        }, owner.refreshOffsetOnMove = function(value) {
            if (value === undefined) return isRefreshOffsetOnMove;
            isRefreshOffsetOnMove = !!value;
        }, element.ondragstart = onDragStart, element.onmousedown = onMouseDown;
    }, extensions.dragable = function(owner) {}, extensions;
}), define("aui/elements/Link", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    function Link(options) {
        options = core.extend({
            element: "a",
            href: "javascript:",
            onclick: null
        }, options), core.Element.call(this, options), extensions.clickable(this), options.href && this.attr("href", options.href), options.onclick && this.onClick(options.onclick);
    }
    return core.proto(Link, core.Element), Link;
}), define("aui/elements/Button", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    function Button(options) {
        options = core.extend({
            element: "div",
            "class": "button"
,
            onclick: null,
            data: null
        }, options), core.Element.call(this, options), extensions.clickable(this), extensions.selectable(this), this.data = options.data, options.onclick && this.onClick(options.onclick);
    }
    return core.proto(Button, core.Element), Button;
}), define("aui/elements/Check", [ "aui/core" ], function(core) {
    function Check(options) {
        options = core.extend({
            "class": "check",
            value: null
        }, options), core.Element.call(this, options);
    }
    return core.proto(Check, core.Element), Check;
}), define("aui/elements/Edit", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    function Edit(options) {
        options = core.extend({
            element: "input",
            type: null,
            placeholder: null,
            examples: null,
            required: !1
        }, options), core.Element.call(this, options), extensions.validable(this);
        var that = this;
        
this.value = function(value) {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        }, this.type = function(value) {
            if (value === undefined) return that.attr("type");
            that.attr("type", value);
        }, this.placeholder = function(value) {
            if (value === undefined) return that.attr("placeholder");
            that.attr("placeholder", value);
        }, this.maxLength = function(value) {
            value === undefined && that.getElement().maxLength, that.getElement().maxLength = value;
        }, this.focus = function() {
            that.getElement().focus();
        };
        function fnUID(char) {
            var r = Math.random() * 16 | 0, v = char === "x" ? r : r & 3 | 8;
            return v.toString(16);
        }
        options.type && this.type(options.type), options.required && this.required(options.required), options.placeholder && this.placeholder(options.placeholder), 
options.maxLength && this.maxLength(options.maxLength);
        if (options.examples) {
            var id = "INPUT_" + "xxxxxxxxxxxxxxxx".replace(/[x]/g, fnUID);
            this.attr("list", id);
            var datalist = (new core.Element({
                element: "datalist",
                id: id
            })).appendTo(this);
            for (var index in options.examples) (new core.Element({
                element: "option",
                text: options.examples[index]
            })).appendTo(datalist);
        }
    }
    return core.proto(Edit, core.Element), Edit;
}), define("aui/elements/Select", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    return Select = function Select(options) {
        options = core.extend({
            element: "select",
            value: null,
            items: null,
            disabled: null,
            required: !1
        }, options), core.Element.call(this, options), extensions.validable(this);
        var that = this
;
        this.value = function(value) {
            if (value === undefined) return that.getElement().value;
            that.getElement().value = value;
        }, this.items = function(items, disabled) {
            options.value = this.value(), that.clear(), options.items = items, disabled === undefined && (disabled = null), disabled === null ? options.disabled = null : disabled = String(disabled), options.disabled = disabled;
            if (items === null) return;
            if (items instanceof Array) for (var index in items) {
                var item = items[index], option = new core.Element({
                    element: "option"
                });
                item instanceof Object ? (option.text(item.text), option.attr("value", item.value), item.value === disabled && option.attr("disabled", "")) : (option.text(items[index]), option.attr("value", index), index === disabled && option.attr("disabled", "")), option.appendTo(that);
            } else for (var index in items
) {
                var option = new core.Element({
                    element: "option",
                    text: items[index]
                });
                option.attr("value", index), index === disabled && option.attr("disabled", ""), option.appendTo(that);
            }
            this.value(options.value);
        }, this.focus = function() {
            that.getElement().focus();
        }, options.type && this.type(options.type), options.required && this.required(options.required), this.value(options.value), this.items(options.items, options.disabled);
    }, core.proto(Select, core.Element), Select;
}), define("aui/elements/Memo", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    function Memo(options) {
        options = core.extend({
            element: "textarea",
            required: !1
        }, options), core.Element.call(this, options), extensions.validable(this);
        var that = this;
        this.value = function(value) {
            if (
value === undefined) return that.getElement().value;
            that.getElement().value = value;
        }, this.placeholder = function(value) {
            if (value === undefined) return that.attr("placeholder");
            that.attr("placeholder", value);
        }, this.maxLength = function(value) {
            value === undefined && that.getElement().maxLength, that.getElement().maxLength = value;
        }, this.focus = function() {
            that.getElement().focus();
        }, options.required && this.required(options.required), options.placeholder && this.placeholder(options.placeholder), options.maxLength && this.maxLength(options.maxLength);
    }
    return core.proto(Memo, core.Element), Memo;
}), define("aui/elements/ListItem", [ "aui/core", "aui/elements/Button" ], function(core, Button) {
    function ListItem(options) {
        options = core.extend({
            element: "li",
            "class": null
        }, options), Button.call(this, options);
        var that = 
this;
        this.index = function() {
            var element = that.getElement(), parent = element.parentElement;
            if (!parent) return undefined;
            for (var index = 0; index < parent.childNodes.length; index++) if (parent.childNodes[index] === element) return index;
            return undefined;
        };
    }
    return core.proto(ListItem, Button), ListItem;
}), define("aui/elements/List", [ "aui/core", "aui/elements/ListItem" ], function(core, ListItem) {
    function List(options) {
        options = core.extend({
            element: "ul",
            id: null,
            "class": null,
            itemConstructor: null
        }, options), core.Element.call(this, options);
        var that = this, itemConstructor = ListItem;
        this.itemConstructor = function(constructor) {
            if (constructor === undefined) return itemConstructor;
            if (typeof constructor != "function") throw new Error("constructor not function");
            if (!
constructor instanceof ListItem) throw new Error("constructor not proto aUI.ListItem");
            itemConstructor = constructor;
        }, this.add = function() {
            var item = core.construct(that.itemConstructor(), arguments);
            return item.appendTo(that), item;
        }, this.remove = function(index) {
            that.item(index).remove();
        }, this.count = function() {
            return that.getElement().childElementCount;
        }, this.item = function(index) {
            var element = that.getElement().childNodes[index];
            return element === undefined ? undefined : element.aui;
        }, this.items = function() {
            var nodes = that.getElement().childNodes, items = [];
            for (var index = 0; index < nodes.length; index++) items.push(nodes[index].aui);
            return items;
        }, this.selected = function() {
            var nodes = that.getElement().childNodes, items = [];
            for (var q = 0; q < nodes.length
; q++) {
                var item = nodes[q].aui;
                if (!item.selected()) continue;
                items.push(item);
            }
            return items;
        }, this.unselected = function() {
            var nodes = that.getElement().childNodes, items = [];
            for (var q = 0; q < nodes.length; q++) {
                var item = nodes[q].aui;
                if (item.selected()) continue;
                items.push(item);
            }
            return items;
        }, this.selectSingle = function(index) {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) {
                var item = nodes[q].aui;
                index === q ? item.select() : item.unselect();
            }
        }, this.selectAll = function() {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.select();
        }, this.unselectAll = function() {
            var nodes = 
that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.unselect();
        }, this.toggleSelectAll = function() {
            var nodes = that.getElement().childNodes;
            for (var q = 0; q < nodes.length; q++) nodes[q].aui.toggleSelect();
        }, options.itemConstructor && this.itemConstructor(options.itemConstructor);
    }
    return core.proto(List, core.Element), List;
}), define("aui/elements/Field", [ "aui/core" ], function(core) {
    function Field(options) {
        options = core.extend({
            "class": "field",
            caption: null
        }, options), core.Element.call(this, options);
        var caption = (new core.Element({
            "class": "caption"
        })).appendTo(this), value = (new core.Element({
            "class": "value"
        })).appendTo(this);
        Object.defineProperty(this, "caption", {
            get: function() {
                return caption;
            }
        }), Object.defineProperty
(this, "value", {
            get: function() {
                return value;
            }
        }), options.caption && caption.text(options.caption);
    }
    return core.proto(Field, core.Element), Field;
}), define("aui/elements/Popup", [ "aui/core" ], function(core) {
    function Popup(options) {
        options = core.extend({
            "class": "popup",
            onremove: null
        }, options), core.Element.call(this, options);
        var that = this, isClicked = !0, ovner = null, appendTo = this.appendTo, remove = this.remove, e = this.getElement();
        function onDocumentWheelOrResize(event) {
            that.remove();
        }
        function onDocumentClick(event) {
            isClicked || that.remove(), isClicked = !1;
        }
        function show() {
            updatePosition(), core.addEvent(document, "click", onDocumentClick), core.addEvent(document, "wheel", onDocumentWheelOrResize), core.addEvent(document, "resize", onDocumentWheelOrResize), e.style
.display = "";
        }
        function updatePosition() {
            if (!ovner) return;
            var rectOvner = ovner.getBoundingClientRect(), rectBody = document.body.getBoundingClientRect();
            e.style.top = rectOvner.bottom - rectBody.top + "px", e.style.left = rectOvner.left - rectBody.left + "px";
        }
        this.appendTo = function(parent) {
            return ovner = core.getElement(parent), show(), that;
        }, this.remove = function() {
            if (options.onremove && options.onremove() === !1) return;
            core.removeEvent(document, "click", onDocumentClick), core.removeEvent(document, "wheel", onDocumentWheelOrResize), core.removeEvent(document, "resize", onDocumentWheelOrResize), remove();
        };
        function onClick(event) {
            isClicked = !0, event.preventDefault();
        }
        this.onRemove = function(fn) {
            if (fn === undefined) return options.onremove;
            if (typeof fn != "function") throw new 
Error("fn for onRemove not a function");
            options.onremove = fn;
        }, e.onclick = onClick, e.style.display = "none", e.style.position = "absolute", e.style.zIndex = "100", e.style.top = "0px", e.style.left = "0px", appendTo(document.body);
    }
    return core.proto(Popup, core.Element), Popup;
}), define("aui/elements/ScrollArea", [ "aui/core" ], function(core) {
    function ScrollArea(options) {
        options = core.extend({
            height: null,
            width: null,
            horizontal: "auto",
            vertical: "auto"
        }, options), core.Element.call(this, options);
        var that = this;
        this.onScroll = function(fn) {
            that.getElement().onscroll = fn;
        }, this.horizontalScrollBar = function(type) {
            var x = that.getElement().style.overflowX;
            switch (type) {
              case "auto":
                x = "auto";
                break;
              case "scroll":
                x = "scroll"
;
                break;
              case "hidden":
                x = "hidden";
                break;
              case "show":
                x = "scroll";
                break;
              case "hide":
                x = "hidden";
                break;
              default:
                throw new Error("Unknow horizontal type " + type);
            }
            that.getElement().style.overflowX = x;
        }, this.verticalScrollBar = function(type) {
            var y = that.getElement().style.overflowY;
            switch (type) {
              case "auto":
                y = "auto";
                break;
              case "scroll":
                y = "scroll";
                break;
              case "hidden":
                y = "hidden";
                break;
              case "show":
                y = "scroll";
                break;
              case "hide":
                y = "hidden";
                break;
              default:
                throw new 
Error("Unknow vertical type " + type);
            }
            that.getElement().style.overflowY = y;
        }, this.getElement().style.overflow = "auto", this.horizontalScrollBar(options.horizontal), this.verticalScrollBar(options.vertical), this.height(options.height), this.width(options.width);
    }
    return core.proto(ScrollArea, core.Element), ScrollArea;
}), define("aui/elements/ScrollList", [ "aui/core", "aui/elements/List", "aui/elements/ScrollArea" ], function(core, List, ScrollArea) {
    function ScrollList(options) {
        options = core.extend({
            listOptions: {}
        }, options), ScrollArea.call(this, options);
        var that = this, changeTop = null, currentTopIndex = null, onScroll = null;
        this.list = function() {
            return list;
        };
        function scroll() {
            var topIndex = that.topIndex();
            currentTopIndex !== topIndex && (currentTopIndex = topIndex, changeTop && changeTop.call(list.item(currentTopIndex
))), onScroll && onScroll();
        }
        this.onChangeTop = function(fn) {
            if (typeof fn != "function") throw new Error("fn is not a function");
            changeTop = fn;
        }, this.topIndex = function(value) {
            var list = that.list(), nodes = list.getElement().childNodes, count = list.count();
            if (value === undefined) {
                var offsetTop = that.getElement().scrollTop + list.getElement().offsetTop, topIndex = 0;
                for (var index = 0; index < count; index++) {
                    if (offsetTop < nodes[index].offsetTop) break;
                    topIndex = index;
                }
                return topIndex;
            }
            if (isNaN(value)) throw new Error("value is not a number");
            if (value < 0 || count <= value) throw new Error("value " + value + " out of range 0 - " + (count - 1));
            that.getElement().scrollTop = nodes[value].offsetTop - list.getElement().offsetTop;
        
};
        var list = (new List(options.listOptions)).appendTo(this);
        this.onScroll(scroll), this.onScroll = function(fn) {
            onScroll = fn;
        };
    }
    return core.proto(ScrollList, ScrollArea), ScrollList;
}), define("aui/elements/SItem", [ "aui/core", "aui/elements/ListItem" ], function(core, ListItem) {
    function SItem(options) {
        options = core.extend({}, options), ListItem.call(this, options);
        var that = this;
        this.caption = function() {
            return caption;
        }, this.content = function() {
            return content;
        };
        var caption = (new core.Element({
            "class": "caption"
        })).appendTo(this), content = (new core.Element({
            "class": "content"
        })).appendTo(this);
    }
    return core.proto(SItem, ListItem), SItem;
}), define("aui/elements/SList", [ "aui/core", "aui/elements/List", "aui/elements/ScrollList", "aui/elements/SItem" ], function(core, List, ScrollList, 
SItem) {
    function SList(options) {
        options = core.extend({
            "class": "slist",
            onchangeselected: null
        }, options), core.Element.call(this, options);
        var that = this;
        this.add = function(params) {
            menu.add({
                text: params.text,
                onclick: menuClick
            }), menu.count() === 1 && menu.selectSingle(0);
            var item = list.add();
            return item.caption().text(params.text), item;
        }, this.select = function(index) {
            if (scrollList.topIndex() === Number(index)) return;
            scrollList.topIndex(index);
        }, this.onChangeSelected = function(fn) {
            if (fn === undefined) return options.onchangeselected;
            if (typeof fn != "function") throw new Error("fn for onChangeSelected not a function");
            options.onchangeselected = fn;
        };
        function menuClick() {
            that.select(this.index());
        }
        
function changeTop() {
            var index = this.index();
            menu.selectSingle(index), options.onchangeselected && options.onchangeselected.call(that, index);
        }
        this.selected = function() {
            return scrollList.topIndex();
        };
        var menu = (new List({
            "class": "menu"
        })).appendTo(this), scrollList = (new ScrollList({
            "class": "scrollarea",
            listOptions: {
                itemConstructor: SItem
            }
        })).appendTo(this);
        scrollList.onChangeTop(changeTop);
        var list = scrollList.list();
    }
    return core.proto(SList, core.Element), SList;
}), define("aui/elements/Calendar", [ "aui/core", "aui/elements/Button" ], function(core, Button) {
    var fn = {};
    fn.countDayInMonth = function(year, month) {
        return (new Date(year, month + 1, 0)).getDate();
    }, fn.trimDay = function(year, month, day) {
        if (day < 1) return 1;
        while (day > fn.countDayInMonth
(year, month)) day--;
        return day;
    }, fn.shiftDay = function(date, shift) {
        var day = date.getDate() + shift, month = date.getMonth(), year = date.getFullYear();
        return new Date(year, month, day);
    }, fn.shiftMonth = function(date, shift) {
        var day = date.getDate(), month = date.getMonth() + shift, year = date.getFullYear();
        while (month < 0) month += 12, year--;
        while (month > 11) month -= 12, year++;
        return new Date(year, month, fn.trimDay(year, month, day));
    }, fn.shiftYear = function(date, shift) {
        var day = date.getDate(), month = date.getMonth(), year = date.getFullYear() + shift;
        return new Date(year, month, fn.trimDay(year, month, day));
    }, fn.getShortNameDayOfWeekRu = function(index) {
        var array = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб" ];
        return array[index];
    }, fn.getShortNameDayOfWeek = function(index) {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ]
;
        return array[index];
    }, fn.getFullNameDayOfWeekRu = function(index) {
        var array = [ "воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота" ];
        return array[index];
    }, fn.getShortNameMonth = function(index) {
        var array = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
        return array[index];
    }, fn.getNumberMonth = function(index) {
        var array = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
        return array[index];
    }, fn.getShortNameMonth = function(index) {
        var array = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
        return array[index];
    }, fn.getShortNameMonthRu = function(index) {
        var array = [ "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" ];
        return array[index];
    }, fn.getFullNameMonthRu = function(index) {
        var array = [ "Январь", "Февраль", "Март"
, "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
        return array[index];
    };
    function Calendar(options) {
        options = core.extend({
            "class": "calendar",
            onclickday: null,
            onclickmonth: null,
            onclickyear: null,
            onchange: null,
            date: new Date
        }, options), core.Element.call(this, options);
        var that = this, mode = "days";
        function update() {
            mode === "days" && showDays(options.date), mode === "months" && showMonths(options.date), mode === "years" && showYears(options.date);
        }
        this.value = function(date) {
            if (date === undefined) return options.date;
            if (!date instanceof Date) throw new Error("value is not instance of Date");
            if (options.date === date) return;
            options.date = date, update(), options.onchange && options.onchange.call(that);
        };
        function clickMonthsMode
() {
            mode = "months", update();
        }
        function clickYearsMode() {
            mode = "years", update();
        }
        function clickPrev() {
            that.value(this.data);
        }
        function clickNext() {
            that.value(this.data);
        }
        function clickDay() {
            that.value(this.data), options.onclickday && options.onclickday.call(that);
        }
        function clickMonth() {
            mode = "days", that.value(this.data);
        }
        function clickYear() {
            mode = "months", that.value(this.data);
        }
        this.onClickDay = function(fn) {
            options.onclickday = fn;
        }, this.onClickMonth = function(fn) {
            options.onclickmonth = fn;
        }, this.onClickYear = function(fn) {
            options.onclickyear = fn;
        }, this.onChange = function(fn) {
            options.onchange = fn;
        };
        function showDays(date) {
            that.clear();
            
var dayTableData = that.getDayTableData(date);
            (new Button({
                "class": "prev",
                text: "<",
                data: dayTableData.prev,
                onclick: clickPrev
            })).appendTo(that), (new Button({
                "class": "level days",
                text: dayTableData.caption,
                onclick: clickMonthsMode
            })).appendTo(that), (new Button({
                "class": "prev",
                text: ">",
                data: dayTableData.next,
                onclick: clickNext
            })).appendTo(that);
            var table = new core.Element({
                element: "table",
                "class": "days"
            }), th = new core.Element({
                element: "tr"
            });
            for (var d = 0; d < 7; d++) {
                var item = dayTableData.head[d], td = new core.Element({
                    element: "th",
                    "class": item.class,
                    text
: item.text
                });
                td.appendTo(th);
            }
            th.appendTo(table);
            for (var w = 0; w < 6; w++) {
                var tr = new core.Element({
                    element: "tr"
                });
                for (var d = 0; d < 7; d++) {
                    var item = dayTableData.array[w * 7 + d], td = new Button({
                        element: "td",
                        "class": item.class,
                        text: item.text,
                        data: item.date
                    });
                    item.state && td.addClass(item.state), item.current && td.addClass("current"), item.selected && td.addClass("selected"), td.onClick(clickDay), td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showMonths(date) {
            that.clear();
            var data = that.getMonthTableData(date);
            (new Button({
                "class"
: "prev",
                text: "<",
                data: data.prev,
                onclick: clickPrev
            })).appendTo(that), (new Button({
                "class": "level months",
                text: data.caption,
                onclick: clickYearsMode
            })).appendTo(that), (new Button({
                "class": "prev",
                text: ">",
                data: data.next,
                onclick: clickNext
            })).appendTo(that);
            var table = new core.Element({
                element: "table",
                "class": "months"
            });
            for (var h = 0; h < 3; h++) {
                var tr = new core.Element({
                    element: "tr"
                });
                for (var w = 0; w < 4; w++) {
                    var item = data.array[h * 4 + w], td = new Button({
                        element: "td",
                        "class": item.class,
                        text: item.text,
                        
data: item.date
                    });
                    item.state && td.addClass(item.state), item.current && td.addClass("current"), item.selected && td.addClass("selected"), td.onClick(clickMonth), td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        function showYears(date) {
            that.clear();
            var data = that.getYearTableData(date);
            (new Button({
                "class": "prev",
                text: "<",
                data: data.prev,
                onclick: clickPrev
            })).appendTo(that), (new Button({
                "class": "level years",
                text: data.caption
            })).appendTo(that), (new Button({
                "class": "prev",
                text: ">",
                data: data.next,
                onclick: clickNext
            })).appendTo(that);
            var table = new core.Element({
                element: "table"
,
                "class": "months"
            });
            for (var h = 0; h < 3; h++) {
                var tr = new core.Element({
                    element: "tr"
                });
                for (var w = 0; w < 4; w++) {
                    var item = data.array[h * 4 + w], td = new Button({
                        element: "td",
                        "class": item.class,
                        text: item.text,
                        data: item.date
                    });
                    item.state && td.addClass(item.state), item.current && td.addClass("current"), item.selected && td.addClass("selected"), td.onClick(clickYear), td.appendTo(tr);
                }
                tr.appendTo(table);
            }
            table.appendTo(that);
        }
        if (!options.date instanceof Date) throw new Error("value is not instance of Date");
        update();
    }
    return core.proto(Calendar, core.Element), Calendar.prototype.getDayTableData = function(
date) {
        function getFirsInMonthDayOfWeek(year, month) {
            return (new Date(year, month, 1)).getDay();
        }
        var data = {
            date: date
        };
        data.day = date.getDate(), data.month = date.getMonth(), data.year = date.getFullYear(), data.caption = fn.getFullNameMonthRu(data.month) + " " + data.year, data.prev = fn.shiftMonth(data.date, -1), data.next = fn.shiftMonth(data.date, 1);
        var countDayInPrevMonth = fn.countDayInMonth(data.prev.getFullYear(), data.prev.getMonth()), countDayInMonth = fn.countDayInMonth(data.year, data.month), firstInMonthDayOfWeek = getFirsInMonthDayOfWeek(data.year, data.month), prevCount = firstInMonthDayOfWeek - 1;
        prevCount < 0 && (prevCount = 6);
        var prevDIndex = countDayInPrevMonth - prevCount, nextCount = 42 - prevCount - countDayInMonth;
        data.head = [];
        for (var q = 0; q < 7; q++) {
            var item = {}, dayOfWeekCounter = q + 1;
            q === 6 && (dayOfWeekCounter = 0
), item.text = fn.getShortNameDayOfWeekRu(dayOfWeekCounter), item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter), data.head.push(item);
        }
        data.array = [];
        for (var q = 0; q < prevCount; q++) data.array.push({
            date: new Date(data.prev.getFullYear(), data.prev.getMonth(), q + prevDIndex + 1),
            state: "prev"
        });
        for (var q = 0; q < countDayInMonth; q++) data.array.push({
            date: new Date(data.year, data.month, q + 1)
        });
        for (var q = 0; q < nextCount; q++) data.array.push({
            date: new Date(data.next.getFullYear(), data.next.getMonth(), q + 1),
            state: "next"
        });
        var now = new Date, dayOfWeekCounter = 1;
        for (var q = 0; q < data.array.length; q++) {
            var item = data.array[q];
            item.text = item.date.getDate(), item.class = fn.getShortNameDayOfWeek(dayOfWeekCounter), item.date.getDate() === now.getDate() && item.date.getMonth() === now
.getMonth() && item.date.getFullYear() === now.getFullYear() && (item.current = !0), item.date.getDate() === data.day && item.date.getMonth() === data.month && item.date.getFullYear() === data.year && (item.selected = !0), dayOfWeekCounter++, dayOfWeekCounter === 7 && (dayOfWeekCounter = 0);
        }
        return data;
    }, Calendar.prototype.getMonthTableData = function(date) {
        var data = {
            date: date
        };
        data.day = date.getDate(), data.month = date.getMonth(), data.year = date.getFullYear(), data.caption = data.year, data.prev = fn.shiftYear(data.date, -1), data.next = fn.shiftYear(data.date, 1), data.array = [];
        var now = new Date, monthCounter = 0;
        for (var q = 0; q < 12; q++) {
            var item = {};
            item.date = new Date(data.year, monthCounter, fn.trimDay(data.year, q, data.day)), item.text = fn.getShortNameMonthRu(monthCounter), item.class = fn.getShortNameMonth(monthCounter), monthCounter === now.getMonth() && 
data.year === now.getFullYear() && (item.current = !0), monthCounter === data.month && (item.selected = !0), data.array.push(item), monthCounter++;
        }
        return data;
    }, Calendar.prototype.getYearTableData = function(date) {
        var data = {
            date: date
        };
        data.day = date.getDate(), data.month = date.getMonth(), data.year = date.getFullYear(), data.startDec = data.year - data.year % 10, data.endDec = data.startDec + 9, data.caption = data.startDec + " - " + data.endDec, data.prev = fn.shiftYear(data.date, -10), data.next = fn.shiftYear(data.date, 10), data.array = [];
        var now = new Date, yearCounter = data.startDec - 1;
        for (var q = 0; q < 12; q++) {
            var item = {};
            item.date = new Date(yearCounter, data.month, fn.trimDay(data.year, q, data.day)), item.text = yearCounter, item.class = yearCounter, yearCounter === now.getFullYear() && (item.current = !0), yearCounter === data.year && (item.selected = !0
), q === 0 && (item.state = "prev"), q === 11 && (item.state = "next"), data.array.push(item), yearCounter++;
        }
        return data;
    }, Calendar;
}), define("aui/elements/DateSelector", [ "aui/core", "aui/utils", "aui/validators", "aui/elements/Button", "aui/elements/Edit", "aui/elements/Popup", "aui/elements/Calendar" ], function(core, utils, validators, Button, Edit, Popup, Calendar) {
    function DateSelector(options) {
        options = core.extend({
            "class": "dateSelector",
            mask: "dd.MM.yyyy",
            validator: new validators.Pattern("((0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).[0-9]{4})")
        }, options), core.Element.call(this, options);
        var that = this;
        function click() {
            var btn = this;
            if (btn.selected()) {
                btn.unselect();
                return;
            }
            function select() {
                edit.value(utils.dateToStr(this.value(), options.mask)), popup.remove();
            
}
            var popup = (new Popup).appendTo(that);
            popup.onRemove(btn.unselect);
            var calendar = new Calendar;
            calendar.value(utils.strToDate(edit.value(), options.mask)), calendar.onClickDay(select), calendar.appendTo(popup), btn.select();
        }
        var edit = (new Edit({
            required: !0
        })).appendTo(this);
        edit.validator(options.validator), edit.value(utils.dateToStr(new Date, options.mask));
        var btn = (new Button({
            text: "...",
            onclick: click
        })).appendTo(this);
        this.value = edit.value, this.invalid = edit.invalid;
    }
    return core.proto(DateSelector, core.Element), DateSelector;
}), define("aui/elements/Progress", [ "aui/core", "aui/utils" ], function(core, utils) {
    function Progress(options) {
        options = core.extend({
            "class": "progress",
            orientation: "horizontal",
            value: 0,
            min: 0,
            max: 99
,
            round: null
        }, options), core.Element.call(this, options);
        var that = this, isHorizontal = !0;
        function update() {
            var min = 0, max = 0;
            isHorizontal ? max = e.clientWidth : max = e.clientHeight;
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            isHorizontal ? p.style.width = value + "px" : p.style.height = value + "px";
        }
        this.value = function(value) {
            if (value === undefined) return options.value;
            options.value = utils.trimByRange(value, options.min, options.max), update();
        }, this.round = function(fn) {
            if (fn === undefined) return options.round;
            if (typeof fn != "function") throw new Error("fn for round not a function");
            options.round = fn;
        }, isHorizontal = options.orientation !== "vertical";
        var progress = (new core.Element({
            "class": "value"
        
})).appendTo(this);
        isHorizontal ? this.addClass("horisontal") : this.addClass("vertical");
        var e = this.getElement(), p = progress.getElement();
        e.style.position = "relative", p.style.position = "absolute", p.style.width = "100%", p.style.height = "100%", p.style.left = "0px", p.style.bottom = "0px", update();
    }
    return core.proto(Progress, core.Element), Progress;
}), define("aui/elements/Scale", [ "aui/core" ], function(core) {
    function Scale(options) {
        options = core.extend({
            "class": "scale",
            begin: 0,
            end: 10,
            count: 10,
            each: 5
        }, options), core.Element.call(this, options);
        var that = this, count = options.count, each = options.each, labels = [];
        function updateLabels() {
            for (var index in labels) labels[index].remove();
            labels = [];
            for (var q = 0; q <= count; q++) {
                if (q % each !== 0) continue;
                
var label = (new core.Element({
                    "class": "val",
                    text: q
                })).appendTo(that);
                label.getElement().style.position = "absolute", labels.push(label);
            }
        }
        function update() {
            draw(count, each);
        }
        function draw(count, each) {
            var computedStyle = window.getComputedStyle(that.getElement()), rect = core.rectPadding(that), indent = {};
            indent.left = 0, indent.right = 0, indent.top = 0, indent.bottom = 0;
            var ce = canvas.getElement();
            ce.width = rect.right - rect.left, ce.height = rect.bottom - rect.top;
            var ctx = ce.getContext("2d");
            ctx.clearRect(0, 0, ce.width, ce.height), ctx.strokeStyle = computedStyle.color;
            var h2 = Math.ceil(ce.height / 2), d = (ce.width - indent.left - indent.right - 1) / count, b = ce.height, index = 0;
            for (var q = 0; q <= count; q++) {
                
var h = h2, l = Math.ceil(d * q + indent.left);
                if (q % each === 0) {
                    h = 0;
                    var text = String(q), label = labels[index], wt = label.width();
                    label.top(b), label.left(rect.left + Math.ceil(l - wt / 2)), index++;
                }
                ctx.moveTo(l + .5, h + .5), ctx.lineTo(l + .5, b - .5), ctx.stroke();
            }
        }
        this.getElement().style.position = "relative";
        var canvas = (new core.Element({
            element: "canvas"
        })).appendTo(this);
        this.onResize(update), this.getElement().onclick = update, updateLabels();
    }
    return core.proto(Scale, core.Element), Scale;
}), define("aui/elements/Scroll", [ "aui/core", "aui/utils" ], function(core, utils) {
    function Scroll(options) {
        options = core.extend({
            "class": "scroll",
            orientation: "horizontal",
            value: 0,
            min: 0,
            max: 99,
            
round: null,
            onchange: null
        }, options), core.Element.call(this, options);
        var that = this, isHorizontal = !0, size = 50, progressRect, dragRect, dragOffset = 0, update, onMouseMove;
        function updateHorizontal() {
            var min = 0, max = e.clientWidth - size;
            d.style.width = size + "px";
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            value = Math.round(value), d.style.left = value + "px", typeof options.onchange == "function" && options.onchange.call(that, options.value);
        }
        function updateVertical() {
            var min = 0, max = e.clientHeight - size;
            d.style.height = size + "px";
            var value = utils.convertRangedValue(options.value, options.min, options.max, min, max);
            value = Math.round(value), d.style.top = value + "px", typeof options.onchange == "function" && options.onchange.call(that, options.value);
        }
        
function onMouseDown(event) {
            core.addEvent(document, "mousemove", onMouseMove), core.addEvent(document, "mouseup", onMouseUp), progressRect = e.getBoundingClientRect(), dragRect = d.getBoundingClientRect();
            if (isHorizontal) {
                var dragLeftBorderWidth = Math.floor((progressRect.width - e.clientWidth) / 2);
                dragOffset = event.clientX - dragRect.left + dragLeftBorderWidth;
            } else {
                var dragTopBorderHeight = Math.floor((progressRect.height - e.clientHeight) / 2);
                dragOffset = event.clientY - dragRect.top + dragTopBorderHeight;
            }
            onMouseMove(event), that.addClass("move"), event.preventDefault ? event.preventDefault() : event.returnValue = !1;
        }
        function onMouseUp(event) {
            core.removeEvent(document, "mousemove", onMouseMove), core.removeEvent(document, "mouseup", onMouseUp), that.removeClass("move"), event.preventDefault ? event.preventDefault
() : event.returnValue = !1;
        }
        function onMoveHorisontal(event) {
            var min = 0, max = e.clientWidth - size, pos = event.clientX - progressRect.left - dragOffset;
            pos = utils.trimByRange(pos, min, max), that.value(utils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onMoveVertical(event) {
            var min = 0, max = e.clientHeight - size, pos = event.clientY - progressRect.top - dragOffset;
            pos = utils.trimByRange(pos, min, max), that.value(utils.convertRangedValue(pos, min, max, options.min, options.max));
        }
        function onDragStart() {
            return !1;
        }
        this.value = function(value) {
            if (value === undefined) return options.value;
            options.round && (value = options.round(value)), value = utils.trimByRange(value, options.min, options.max);
            if (options.value === value) return;
            options.value = value, update();
        
}, this.round = function(fn) {
            if (fn === undefined) return options.round;
            if (fn === null) {
                options.round = null;
                return;
            }
            if (typeof fn != "function") throw new Error("set round not a function");
            options.round = fn;
        }, isHorizontal = options.orientation !== "vertical";
        var drag = (new core.Element({
            "class": "drag"
        })).appendTo(this);
        isHorizontal ? (this.addClass("horisontal"), update = updateHorizontal, onMouseMove = onMoveHorisontal) : (this.addClass("vertical"), update = updateVertical, onMouseMove = onMoveVertical);
        var e = this.getElement(), d = drag.getElement();
        e.style.position = "relative", d.style.position = "absolute", d.style.width = "100%", d.style.height = "100%", d.ondragstart = onDragStart, d.onmousedown = onMouseDown, this.round(options.round), this.value(options.value), update();
    }
    return core.proto(Scroll, 
core.Element), Scroll;
}), define("aui/elements/Slider", [ "aui/core", "aui/utils", "aui/extensions" ], function(core, utils, extensions) {
    function Slider(options) {
        options = core.extend({
            "class": "scroll",
            orientation: "horizontal",
            value: 0,
            min: 0,
            max: 99,
            round: null,
            onchange: null
        }, options), core.Element.call(this, options);
        var that = this, value = new utils.NumInRange(options.value, options.min, options.max), pos = new utils.NumInRange(0, 0, 0);
        value.onChange(changeValue), pos.onChange(changePos);
        var lastPos = null;
        function onResize(event) {
            isHorizontal ? pos.max(that.clientWidth() - drag.width()) : pos.max(that.clientHeight() - drag.height());
        }
        function onMoveStart(event) {
            isHorizontal ? lastPos = drag.left() : lastPos = drag.top(), that.addClass("move");
        }
        function onMoveEnd(event
) {
            that.removeClass("move");
        }
        function onMove(event, dX, dY) {
            var p = lastPos;
            isHorizontal ? p += dX : p += dY, that.value(utils.convertRangedValue(p, pos.min(), pos.max(), value.min(), value.max()));
        }
        function changeValue(val) {
            pos.value(utils.convertRangedValue(value.value(), value.min(), value.max(), pos.min(), pos.max())), options.onchange && options.onchange.call(that, val);
        }
        function changePos(val) {
            isHorizontal ? drag.left(val) : drag.top(val);
        }
        this.value = function(val) {
            value.value(Math.ceil(val));
        }, this.onChange = function(fn) {
            if (fn === undefined) return options.onchange;
            if (typeof fn != "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        }, this.getElement().style.position = "relative", this.onResize(onResize);
        var drag = (new core.Element
({
            "class": "drag"
        })).appendTo(this);
        extensions.movable(drag), drag.getElement().style.position = "absolute", drag.refreshOffsetOnMove(!1), drag.onMove(onMove), drag.onMoveStart(onMoveStart), drag.onMoveEnd(onMoveEnd), drag.onResize(onResize);
        var isHorizontal = options.orientation !== "vertical";
        isHorizontal ? (this.addClass("horisontal"), drag.width("30px"), drag.height("100%")) : (this.addClass("vertical"), drag.width("100%"), drag.height("30px"));
    }
    return core.proto(Slider, core.Element), Slider;
}), define("aui/elements/Range", [ "aui/core", "aui/utils", "aui/extensions" ], function(core, utils, extensions) {
    function Range(options) {
        options = core.extend({
            orientation: "horizontal",
            valueMin: 0,
            valueMax: 0,
            min: 0,
            max: 99,
            blocked: !1,
            "class": "range",
            round: null,
            onchange: null
        }, options), core
.Element.call(this, options);
        var that = this, valueMin = new utils.NumInRange(options.valueMin, options.min, options.max), valueMax = new utils.NumInRange(options.valueMax, options.min, options.max);
        valueMin.onChange(changeValueMin), valueMax.onChange(changeValueMax);
        var posMin = new utils.NumInRange(0, 0, 0), posMax = new utils.NumInRange(0, 0, 0);
        posMin.onChange(changePosMin), posMax.onChange(changePosMax);
        var lastPos = null, roundDigits = 0, fractionDigits = null;
        function onResize(event) {
            var rect = core.rectPadding(that);
            isHorizontal ? (posMin.min(rect.left), posMin.max(rect.right - dragMin.width()), posMax.min(rect.left), posMax.max(rect.right - dragMax.width())) : (posMin.min(rect.top), posMin.max(rect.bottom - dragMin.height()), posMax.min(rect.top), posMax.max(rect.bottom - dragMax.height()));
        }
        function onMoveStart(event) {
            isHorizontal ? lastPos = this.left() : lastPos = 
this.top(), that.addClass("move"), this.addClass("move");
        }
        function onMoveEnd(event) {
            that.removeClass("move"), this.removeClass("move");
        }
        function onMoveMin(event, dX, dY) {
            var p = lastPos;
            isHorizontal ? p += dX : p += dY, that.valueMin(utils.convertRangedValue(p, posMin.min(), posMin.max(), valueMin.min(), valueMin.max()));
        }
        function onMoveMax(event, dX, dY) {
            var p = lastPos;
            isHorizontal ? p += dX : p += dY, that.valueMax(utils.convertRangedValue(p, posMax.min(), posMax.max(), valueMax.min(), valueMax.max()));
        }
        function changeValueMin(val) {
            options.blocked ? valueMax.value() < valueMin.value() && valueMin.value(valueMax.value()) : valueMin.value() > valueMax.value() && valueMax.value(valueMin.value()), posMin.value(utils.convertRangedValue(valueMin.value(), valueMin.min(), valueMin.max(), posMin.min(), posMin.max())), fractionDigits === null ? 
dragMinValue.text(valueMin.value()) : dragMinValue.text(valueMin.value().toFixed(fractionDigits)), options.onchange && options.onchange.call(that);
        }
        function changeValueMax(val) {
            options.blocked ? valueMin.value() > valueMax.value() && valueMax.value(valueMin.value()) : valueMax.value() < valueMin.value() && valueMin.value(valueMax.value()), posMax.value(utils.convertRangedValue(valueMax.value(), valueMax.min(), valueMax.max(), posMax.min(), posMax.max())), fractionDigits === null ? dragMaxValue.text(valueMax.value()) : dragMaxValue.text(valueMax.value().toFixed(fractionDigits)), options.onchange && options.onchange.call(that);
        }
        function changePosMin(val) {
            isHorizontal ? dragMin.left(val) : dragMin.top(val), updateLine();
        }
        function changePosMax(val) {
            isHorizontal ? dragMax.left(val) : dragMax.top(val), updateLine();
        }
        function updateLine() {
            isHorizontal ? (line.left(posMin
.min() + posMin.value()), line.width(posMax.value() - posMin.value())) : (line.top(posMin.min() + posMin.value()), line.height(posMax.value() - posMin.value()));
        }
        this.valueMin = function(val) {
            options.round && (val = options.round(val)), valueMin.value(val);
        }, this.valueMax = function(val) {
            options.round && (val = options.round(val)), valueMax.value(val);
        }, this.round = function(fn) {
            if (fn === undefined) return options.round;
            if (fn === null) {
                options.round = null;
                return;
            }
            if (typeof fn == "number") {
                fn === 0 ? roundDigits = 0 : roundDigits = 1 / fn, fractionDigits = Math.round(roundDigits / 10), options.round = roundValue;
                return;
            }
            if (typeof fn != "function") throw new Error("fn for onChange not a function");
            options.round = fn;
        }, this.onChange = function(fn) {
            
if (fn === undefined) return options.onchange;
            if (typeof fn != "function") throw new Error("fn for onChange not a function");
            options.onchange = fn;
        }, roundValue = function(value) {
            return roundDigits === 0 ? Math.round(value) : Math.round(value * roundDigits) / roundDigits;
        }, this.getElement().style.position = "relative", this.onResize(onResize);
        var line = (new core.Element({
            "class": "line"
        })).appendTo(this);
        line.getElement().style.position = "absolute";
        var dragMin = (new core.Element({
            "class": "drag min"
        })).appendTo(this);
        extensions.movable(dragMin), dragMin.getElement().style.position = "absolute", dragMin.refreshOffsetOnMove(!1), dragMin.onMove(onMoveMin), dragMin.onMoveStart(onMoveStart), dragMin.onMoveEnd(onMoveEnd), dragMin.onResize(onResize);
        var dragMinValue = (new core.Element({
            "class": "value"
        })).appendTo(dragMin)
, dragMax = (new core.Element({
            "class": "drag max"
        })).appendTo(this);
        extensions.movable(dragMax), dragMax.getElement().style.position = "absolute", dragMax.refreshOffsetOnMove(!1), dragMax.onMove(onMoveMax), dragMax.onMoveStart(onMoveStart), dragMax.onMoveEnd(onMoveEnd), dragMax.onResize(onResize);
        var dragMaxValue = (new core.Element({
            "class": "value"
        })).appendTo(dragMax), isHorizontal = options.orientation !== "vertical";
        isHorizontal ? this.addClass("horisontal") : this.addClass("vertical"), updateLine();
    }
    return core.proto(Range, core.Element), Range;
}), define("aui/elements/Movable", [ "aui/core", "aui/extensions" ], function(core, extensions) {
    function Movable(options) {
        options = core.extend({
            onmove: undefined,
            onmovestart: undefined,
            onmoveend: undefined
        }, options), core.Element.call(this, options), extensions.movable(this);
        var that = 
this;
        this.getElement().style.position = "absolute", this.onMove(options.onmove), this.onMoveStart(options.onmovestart), this.onMoveEnd(options.onmoveend);
    }
    return core.proto(Movable, core.Element), Movable;
}), define("aui/elements/XY", [ "aui/core", "aui/utils" ], function(core, utils) {
    function XY(options) {
        options = core.extend({
            "class": "xy",
            x: 0,
            y: 0,
            minX: -5,
            maxX: 5,
            minY: -5,
            maxY: 5,
            roundX: null,
            roundY: null
        }, options), core.Element.call(this, options);
        var that = this, position = {};
        position.left = options.x, position.top = options.y;
        function posToValue(pos, min, max, len, round) {
            if (len === 0) return 0;
            var value = min + pos * (max - min + 1) / len;
            return typeof round != "function" ? value : round(value);
        }
        function valueToPos(value, min, max, 
len) {
            var pos = Math.round((value - min) * len / (max - min + 1));
            return utils.trimByRange(pos, 0, len - 1);
        }
        function moveTo(left, top) {
            top = utils.trimByRange(top, 0, e.clientHeight - 1), left = utils.trimByRange(left, 0, e.clientWidth - 1), options.x = posToValue(left, options.minX, options.maxX, e.clientWidth, options.roundX), options.y = posToValue(top, options.minY, options.maxY, e.clientHeight, options.roundY), position.left = valueToPos(options.x, options.minX, options.maxX, e.clientWidth), position.top = valueToPos(options.y, options.minY, options.maxY, e.clientHeight), update();
        }
        function onMouseDown(event) {
            core.addEvent(document, "mousemove", onMouseMove), core.addEvent(document, "mouseup", onMouseUp), onMouseMove(event);
        }
        function onMouseUp(event) {
            core.removeEvent(document, "mousemove", onMouseMove), core.removeEvent(document, "mouseup", onMouseUp);
        
}
        function onMouseMove(event) {
            var rect = e.getBoundingClientRect(), borderWidth = Math.floor((rect.width - e.clientHeight) / 2), borderHeight = Math.floor((rect.height - e.clientHeight) / 2), left = event.clientX - rect.left - borderWidth, top = event.clientY - rect.top - borderHeight;
            moveTo(left, top);
        }
        function onDragStart() {
            return !1;
        }
        function update() {
            pX.style.width = position.left + "px", pY.style.height = position.top + "px";
            var rect = m.getBoundingClientRect(), dl = Math.floor(rect.width / 2), dt = Math.floor(rect.height / 2);
            m.style.left = position.left - dl + "px", m.style.top = position.top - dt + "px";
        }
        this.x = function(value) {
            if (value === undefined) return options.x;
            options.x = utils.trimByRange(value, options.minX, options.maxX);
        }, this.y = function(value) {
            if (value === undefined) return options
.y;
            options.y = utils.trimByRange(value, options.minY, options.maxY);
        }, this.roundX = function(fn) {
            if (fn === undefined) return options.roundX;
            if (typeof fn != "function") throw new Error("fn for roundX not a function");
            options.roundX = fn;
        }, this.roundY = function(fn) {
            if (fn === undefined) return options.roundY;
            if (typeof fn != "function") throw new Error("fn for roundY not a function");
            options.roundY = fn;
        };
        var area = (new core.Element({
            "class": "area"
        })).appendTo(this), progressX = (new core.Element({
            "class": "x"
        })).appendTo(area), progressY = (new core.Element({
            "class": "y"
        })).appendTo(area), move = (new core.Element({
            "class": "move",
            width: 15,
            height: 15
        })).appendTo(area), e = area.getElement(), pX = progressX.getElement(), pY = progressY.getElement
(), m = move.getElement();
        e.style.position = "relative", pX.style.position = "absolute", pX.style.height = "100%", pY.style.position = "absolute", pY.style.width = "100%", m.style.position = "absolute", m.ondragstart = onDragStart, e.ondragstart = onDragStart, e.addEventListener("mousedown", onMouseDown), update(), m.style.left = "-7px", m.style.top = "-7px";
    }
    return core.proto(XY, core.Element), XY;
}), define("aUI", [ "aui/core", "aui/utils", "aui/validators", "aui/extensions", "aui/elements/Link", "aui/elements/Button", "aui/elements/Check", "aui/elements/Edit", "aui/elements/Select", "aui/elements/Memo", "aui/elements/List", "aui/elements/ListItem", "aui/elements/Field", "aui/elements/Popup", "aui/elements/ScrollArea", "aui/elements/ScrollList", "aui/elements/SItem", "aui/elements/SList", "aui/elements/Calendar", "aui/elements/DateSelector", "aui/elements/Progress", "aui/elements/Scale", "aui/elements/Scroll", "aui/elements/Slider", "aui/elements/Range", "aui/elements/Movable"
, "aui/elements/XY" ], function(core, utils, validators, extensions, Link, Button, Check, Edit, Select, Memo, List, ListItem, Field, Popup, ScrollArea, ScrollList, SItem, SList, Calendar, DateSelector, Progress, Scale, Scroll, Slider, Range, Movable, XY) {
    var aUI = {};
    return aUI.extend = core.extend, aUI.proto = core.proto, aUI.construct = core.construct, aUI.getElement = core.getElement, aUI.Element = core.Element, aUI.utils = utils, aUI.validators = validators, aUI.extensions = extensions, aUI.Link = Link, aUI.Button = Button, aUI.Check = Check, aUI.Edit = Edit, aUI.Select = Select, aUI.Memo = Memo, aUI.List = List, aUI.ListItem = ListItem, aUI.Field = Field, aUI.Popup = Popup, aUI.ScrollArea = ScrollArea, aUI.ScrollList = ScrollList, aUI.SItem = SItem, aUI.SList = SList, aUI.Calendar = Calendar, aUI.DateSelector = DateSelector, aUI.Progress = Progress, aUI.Scale = Scale, aUI.Scroll = Scroll, aUI.Slider = Slider, aUI.Range = Range, aUI.Movable = Movable, aUI.XY = XY, aUI;
})
;;