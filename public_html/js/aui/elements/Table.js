define([ "aui/core", "./Element", "aui/extensions" ],
function(core, Element, extensions)
{
//---------------------------------------------------------------------------
    function Cell(options)
    {
        //Опции
        options = core.extend(
        {
            element : "td"
        }, options);
        Element.call(this, options);
        //Переменные
        var that = this;
        //Функции
        //Сборка
    }
    core.proto(Cell, Element);
//---------------------------------------------------------------------------
    function Row(options)
    {
        //Опции
        options = core.extend(
        {
            element : "tr"
        }, options);
        Element.call(this, options);
        //Переменные
        var that = this;
        //Функции
        this.addCell = function()
        {
            return new Cell().appendTo(that);
        };
//        this.addData = function()
//        {
//            return new Cell({ element : "td" }).appendTo(that);
//        };
//        this.addHead = function()
//        {
//            return new Cell({ element : "th" }).appendTo(that);
//        };
        //Сборка
    }
    core.proto(Row, Element);
//---------------------------------------------------------------------------
    function Block(options)
    {
        //Опции
        options = core.extend(
        {
            element : "tbody"
        }, options);
        Element.call(this, options);
        //Переменные
        var that = this;
        //Функции
        this.addRow = function(opt)
        {
            return new Row(opt).appendTo(that);
        };
        //Сборка
    }
    core.proto(Block, Element);
//---------------------------------------------------------------------------
    function Table(options)
    {
        //Опции
        options = core.extend(
        {
            element : "table",
            class : "table",
            fields : [ ],
            entries : [ ]
        }, options);
        Element.call(this, options);
        //Переменные
        var that = this;
        //Функции
        function find(element)
        {
            var nodes = that.getElement().childNodes;
            for (var index = 0; index < nodes.length; index++)
            {
                var node = nodes[index];
                if (node.localName !== element) continue;
                if (!node.aui instanceof Element) throw new Error("node.aui is not a Element");
                return node.aui;
            }
            return null;
        }
        function thead()
        {
            var block = find("thead");
            if (block === null) block = new Block({ element : "thead" }).appendTo(that);
            return block;
        }
        function tbody()
        {
            var block = find("tbody");
            if (block === null) block = new Block({ element : "tbody" }).appendTo(that);
            return block;
        }
        function tfoot()
        {
            var block = find("tfoot");
            if (block === null) block = new Block({ element : "tfoot" }).appendTo(that);
            return block;
        }
        //Сборка
        /**
         * Предназначен для хранения одной или нескольких строк, которые представлены вверху таблицы.
         */
        Object.defineProperty(this, "thead", { configurable : false, get : thead });
        /**
         * Предназначен для хранения одной или нескольких строк таблицы.
         */
        Object.defineProperty(this, "tbody", { configurable : false, get : tbody });
        /**
         * Предназначен для хранения одной или нескольких строк, которые представлены внизу таблицы.
         */
        Object.defineProperty(this, "tfoot", { configurable : false, get : tfoot });
    }
    core.proto(Table, Element);
//---------------------------------------------------------------------------
        function Maper(options)
    {
        options = core.extend(
        {
            table : null,
            fields : [ ],
            entries : [ ],
            onheadclick : null
        }, options);
        //Переменные
        var that = this;
        //Функции
        this.table = function(value)
        {
            if (value === undefined) return options.table;
            if (value !== null && !value instanceof Table) throw new Error("table in not Table");
            options.table = value;
        };
        this.fields = function(value)
        {
            if (value === undefined) return options.fields;
            if (!value instanceof Array) throw new Error("fields in not Array");
            options.fields = value;
        };
        this.entries = function(value)
        {
            if (value === undefined) return options.entries;
            if (!value instanceof Array) throw new Error("entries in not Array");
            options.entries = value;
        };
        function getKey(field, index)
        {
            var key = index;
            if (typeof field.key === "string") key = field.key;
            if (typeof field.key === "number") key = field.key;
            return key;
        }
        function fillRow(row, fields, entry)
        {
            if (!row instanceof Row) throw new Error("row is not a Row");
            for (var index in fields)
            {
                var field = fields[index];
                var key = getKey(field, index);
                var data = entry[key];
                var cell = row.addCell();
                cell.data = { entry : entry, key : key };
                if (typeof field.onclick === "function")
                {
                    extensions.clickable(cell);
                    cell.onClick(field.onclick);
                }
                if (typeof field.fill === "function") field.fill.call(cell, data, entry, key);
                else cell.text(data);
            }
        }
        function fillBlock(block, fields, entries)
        {
            if (!block instanceof Block) throw new Error("block is not a Block");
            for (var index in entries)
            {
                var row = block.addRow();
                fillRow(row, fields, entries[index]);
            }
        }
        function fillHead(data, entry, key)
        {
            this.text(data.text);
            this.data = { key: data.key };
        }
        function getHead()
        {
            var head = { fields : [ ], entries : [ ] };
            var captions = [];
            for (var index in options.fields)
            {
                var field = options.fields[index];
                var headField = { fill : fillHead };
                if (typeof options.onheadclick === "function") headField.onclick = options.onheadclick;
                head.fields.push(headField);
                captions.push({ text : field.text, key : getKey(field, index)});
            }
            head.entries.push(captions);
            return head;
        }
        function getBody()
        {
            var body = { };
            body.fields = options.fields;
            body.entries = options.entries;
            return body;
        }
        function getTable()
        {
            if (options.table === null) throw new Error("table not set");
            return options.table;
        }
        this.clear = function()
        {
            getTable().clear();
        };
        this.fill = function()
        {
            var table = getTable();
            var head = getHead();
            var body = getBody();
            table.clear();
            fillBlock(table.thead, head.fields, head.entries);
            fillBlock(table.tbody, body.fields, body.entries);
        };
        //Сборка
        if (options.table) this.table(options.table);
        if (options.fields) this.fields(options.fields);
        if (options.entries) this.entries(options.entries);
        if (options.table !== null) this.fill();
    }
//---------------------------------------------------------------------------
    Row.Cell = Cell;
    Table.Row = Row;
    Table.Maper = Maper;
    return Table;
});