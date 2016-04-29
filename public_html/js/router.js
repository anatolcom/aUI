define("Router", [ "aUI" ],
function(aUI)
{
//---------------------------------------------------------------------------
    function Router()
    {
        var routs;
        var current = { };
        current.rout = [ ];
        current.node;
        var onRoutOpen;
        var onRoutClose;
        var onNodeOpen;
        var onNodeClose;

        function getNode(routs, name)
        {
            if (typeof routs !== "object") return null;
            if (name in routs) return routs[name];
            return null;
        }
        function getRoutFeatures(rout, name)
        {
            var a = [ ];
            for (var index in rout) a.push(rout[index].node[name]);
            return a;
        }
        function getPath(rout)
        {
            var a = [ ];
            for (var index in rout) a.push(rout[index].name);
            return a.join("/");
        }
        function getDeferenceTail(base, target)
        {
            var a = [ ];
            var index = 0;
            for (; index < target.length; index++)
            {
                if (!(index in base)) break;
                if (base[index].name !== target[index].name) break;
            }
            for (; index < target.length; index++) a.push(target[index]);
            return a;
        }
        function matchRout(path, required)
        {
            if (typeof path !== "string") throw new Error("path is not a string");
            var nodes = path.split("/");
            var node = { routs : routs };
            var rout = [ ];
            for (var index in nodes)
            {
                var name = nodes[index];
                node = getNode(node.routs, name);
                if (node === null)
                {
                    if (required) throw new Error("unknow node \"" + name + "\" in path \"" + path + "\"");
                    return null;
                }
                rout.push({ name : name, node : node });
            }
            return rout;
        }

        Object.defineProperty(this, "routs", {
            configurable : false,
            get : function()
            {
                return routs;
            },
            set : function(value)
            {
                routs = value;
            }
        });
        Object.defineProperty(this, "onRoutOpen", {
            configurable : false,
            get : function()
            {
                return onRoutOpen;
            },
            set : function(fn)
            {
                onRoutOpen = aUI.utils.functionOrNull(fn);
            }
        });
        Object.defineProperty(this, "onRoutClose", {
            configurable : false,
            get : function()
            {
                return onRoutClose;
            },
            set : function(fn)
            {
                onRoutClose = aUI.utils.functionOrNull(fn);
            }
        });
        Object.defineProperty(this, "onNodeOpen", {
            configurable : false,
            get : function()
            {
                return onNodeOpen;
            },
            set : function(fn)
            {
                onNodeOpen = aUI.utils.functionOrNull(fn);
            }
        });
        Object.defineProperty(this, "onNodeClose", {
            configurable : false,
            get : function()
            {
                return onNodeClose;
            },
            set : function(fn)
            {
                onNodeClose = aUI.utils.functionOrNull(fn);
            }
        });
        Object.defineProperty(this, "path", {
            configurable : false,
            get : function()
            {
                return getPath(current.rout);
            },
            set : function(path)
            {
                if (getPath(current.rout) === path) return current.node;
                var rout = matchRout(path, true);
                var node = null;
                if (rout.length !== 0) node = rout[rout.length - 1];
                var closeTail = getDeferenceTail(rout, current.rout);
                var openTail = getDeferenceTail(current.rout, rout);
                if (onNodeClose)
                {
                    for (var index = closeTail.length - 1; index >= 0; index--)
                        onNodeClose.call(closeTail[index].node, closeTail[index].name);
                }
                if (current.node && onRoutClose) onRoutClose.call(current.node);
                current.node = node;
                current.rout = rout;
                if (onNodeOpen) for (var index in openTail) onNodeOpen.call(openTail[index].node, openTail[index].name);
                if (current.node && onRoutOpen) onRoutOpen.call(current.node);
                return current.node;
            }
        });
        Object.defineProperty(this, "rout", {
            configurable : false,
            get : function()
            {
                return current.rout;
            }
        });
        this.routFeatures = function(name)
        {
            return getRoutFeatures(current.rout, name);
        };
    }
    return Router;
//---------------------------------------------------------------------------
});