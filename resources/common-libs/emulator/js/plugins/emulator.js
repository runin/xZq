/* 
a: document.getElementById("device"), 
b: document.getElementById("url_input"), 
c: document.getElementById("open_url_button"), 
d: document.getElementById("orientation_selector"), 
e: document.getElementById("scale_selector"), 
f: document.getElementById("real_scale_options"), 
g: document.getElementById("screensize_selector"), 
h: document.getElementById("resolution_x_input"), 
i: document.getElementById("resolution_y_input"), 
j: document.getElementById("scale_factor_input"), 
k: document.getElementById("scrolling_toggle"), 
l: document.getElementById("native_resolution_toggle"))

*/
function VIEWPORT_EMULATOR(a, b, c, d, e, f, g, h, i, j, k, l) {
    function r() {
        B(p.get_parameter("pixel_ratio", m)),
        x(p.get_parameter("url", o)),
        z(p.get_parameter("scale", /^([0-9]*\.?[0-9]+)$/)),
        A(p.get_parameter("scrolling", n)),
        E(),
        F(),
        G(),
        H(),
        c.onchange = function() {
        	p.set_parameter("url", this.value),
            H()
        },
        e.onchange = function() {
            E(),
            p.set_parameter("scale", this.value)
        },
        k.onchange = function() {
            F(),
            p.set_parameter("scrolling", this.checked ? "on": "off")
        },
        window.onpopstate = function() {
            C()
        },
        window.onpageshow = function() {
            C()
        }
    }
    function s(a, b) {
        if (!a || !b) return ! 1;
        for (var c = a.options.length; c--;) if (b == a.options[c].value) return a.selectedIndex = c,
        !0;
        return ! 1
    }
    function t(a) {
        if (!a) return "";
        return a;
        
        /*var b = o.exec(a);
        return ! b || b && /javascript/i.test(b[0]) ? "": /^http(s)?:\/\//.test(b[0]) ? b[0] : "http://" + b[0]*/
    }
    function w() {
    	// device_pixel_ratio
        return 2;
    }
    function x(a) {
        a = t(a),
        p.set_parameter("url", a)
    }
    function y(a) {
        return s(d, a)
    }
    function z(a) {
        return a || (a = Math.round(1e3 * (1 / w())) / 1e3),
        s(e, a) || (j.value = a)
    }
    function A(a) {
        return n.test(a) ? (k.checked = "on" == a ? !0 : !1, void 0) : !1
    }
    function B(b) {
        if (!m.test(b)) return ! 1;
        if (l.checked = 1 == b ? !0 : !1, 1 != b && b != w()) {
            document.getElementById("device_pixel_ratio").innerHTML = b,
            q = !0;
            var c = Math.round(a.get_native_resolution("x") / b),
            d = Math.round(a.get_native_resolution("y") / b);
            document.getElementById("virtual_resolution").innerHTML = document.getElementById("virtual_resolution").innerHTML.replace(/^[0-9]+( x )[0-9]+([a-zA-Z- ]*)$/, c + "$1" + d + "$2"),
            document.getElementById("native_resolution_toggle").parentNode.className = ""
        }
    }
    function C() {
        p.has_been_modified_from_external() && (p.reassert_parameters(["orientation", "scale", "scrolling", "pixel_ratio"]), x(p.get_parameter("url", o)), H())
    }
    function E() {
        var b = e.value;
        a.scale(b)
    }
    function F() {
        a.allow_scrolling(k.checked)
    }
    function G() {
        a.change_pixel_ratio(w())
    }
    function H() {
        url = p.get_parameter("url", o),
        s(c, url),
        a.open_url(url || c.firstElementChild.value)
    }
    var m = /^[0-9]*\.?[0-9]+$/,
    n = /^(on|off)$/,
    o = /^([!#$&-;=?-[\]_a-z~]|%[0-9a-fA-F]{2})+$/,
    p = new QUERY_STING,
    a = new VIEWPORT_EMULATOR_DEVICE(a),
    q = !1;
    r()
}
function QUERY_STING() {
    function c(b, c) {
        return c && "push" == c ? history.pushState(null, null, b) : history.replaceState(null, null, b),
        a = location.search,
        !0
    }
    var a = location.search,
    b = {};
    this.get_parameter = function(a, c) {
        var d = new RegExp("[?&]" + a + "=([^&]*)").exec(location.search),
        d = d && c.exec(decodeURIComponent(d[1]));
        return d && (b[a] = d[0]),
        d && d[0]
    },
    this.set_parameter = function(a, d, e) {
        if (this.replace_parameter(a, d, e)) return ! 0;
        d = encodeURIComponent(d),
        b[a] = d;
        var f = location.href + (/\?/.test(location.href) ? "&": "?") + a + "=" + d;
        return c(f, e)
    },
    this.replace_parameter = function(a, d, e) {
        if (!d) return this.remove_parameter(a, e);
        var f = new RegExp("([?&]" + a + "=)([^&]*)"),
        g = f.exec(location.search);
        if (!g) return ! 1;
        if (d = encodeURIComponent(d), g[2] == d) return ! 0;
        b[a] = d;
        var h = location.href.replace(f, "$1" + d);
        return c(h, e)
    },
    this.remove_parameter = function(a, d) {
        var e = new RegExp("([?&])" + a + "=[^&]*(&)?"),
        f = e.exec(location.search);
        if (!f) return ! 0;
        b[a] = "";
        var g = location.href.replace(e, f[2] ? "$1": "");
        return c(g, d)
    },
    this.reassert_parameters = function(c) {
        for (var d = c.length; d--;) b.hasOwnProperty(c[d]) && this.set_parameter(c[d], b[c[d]]);
        a = location.search
    },
    this.has_been_modified_from_external = function() {
        return a != location.search
    }
}
function VIEWPORT_EMULATOR_DEVICE(a) {
    function h() {
        a.style.width = Math.ceil(b.offsetWidth * g) + "px",
        a.style.height = Math.ceil(b.offsetHeight * g) + "px"
    }
    var b = a.firstElementChild,
    c = b.firstElementChild,
    d = "portrait",
    e = c.offsetHeight,
    f = c.offsetWidth,
    g = 1;
    this.get_native_resolution = function(a) {
        return "x" == a ? e: f
    },
    this.get_scale_factor = function() {
        return g
    },
    this.open_url = function(a) {
        var d = document.createElement("iframe");
        d.className = c.className,
        d.style.width = c.style.width,
        d.style.height = c.style.height,
        d.style.transformOrigin = c.style.transformOrigin,
        d.style.transform = c.style.transform,
        d.style.WebkitTransformOrigin = c.style.WebkitTransformOrigin,
        d.style.WebkitTransform = c.style.WebkitTransform,
        d.scrolling = c.scrolling,
        d.src = a,
        b.replaceChild(d, c),
        c = d
    },
    this.rotate = function(a) {
        if (a != d) {
            b.className = b.className.replace(d, a),
            d = a;
            var e = c.style.width;
            c.style.width = c.style.height,
            c.style.height = e,
            h()
        }
    },
    this.scale = function(a) {
        a = window.devicePixelRatio ? a / window.devicePixelRatio: a,
        b.style.transformOrigin = "left top",
        b.style.transform = "scale(" + a + ")",
        b.style.WebkitTransformOrigin = "left top",
        b.style.WebkitTransform = "scale(" + a + ")",
        g = a,
        h()
    },
    this.allow_scrolling = function(a) {
        if (c.scrolling = a ? "auto": "no", c.style.overflow = a ? "auto": "hidden", navigator.userAgent && !/firefox/i.test(navigator.userAgent)) {
            var d = c.cloneNode();
            b.replaceChild(d, c),
            c = d
        }
    },
    this.change_pixel_ratio = function(a) {
        var b = f,
        g = e;
        c.style.width = Math.round(b / a) + "px",
        c.style.height = Math.round(g / a) + "px",
        c.style.transformOrigin = "left top",
        c.style.transform = "scale(" + a + ")",
        c.style.WebkitTransformOrigin = "left top",
        c.style.WebkitTransform = "scale(" + a + ")"
    }
}
window.onload = function() {
    new VIEWPORT_EMULATOR(document.getElementById("device"), document.getElementById("url_input"), document.getElementById("module_selector"), document.getElementById("orientation_selector"), document.getElementById("scale_selector"), document.getElementById("real_scale_options"), document.getElementById("screensize_selector"), document.getElementById("resolution_x_input"), document.getElementById("resolution_y_input"), document.getElementById("scale_factor_input"), document.getElementById("scrolling_toggle"), document.getElementById("native_resolution_toggle"))
};