/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-borderradius-cssgradients-setclasses !*/
!(function(e, n, t) {
  function r(e, n) {
    return typeof e === n;
  }
  function o() {
    var e, n, t, o, s, i, a;
    for (var l in w)
      if (w.hasOwnProperty(l)) {
        if (
          ((e = []),
          (n = w[l]),
          n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
        )
          for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
        for (o = r(n.fn, 'function') ? n.fn() : n.fn, s = 0; s < e.length; s++)
          (i = e[s]),
            (a = i.split('.')),
            1 === a.length
              ? (Modernizr[a[0]] = o)
              : (!Modernizr[a[0]] ||
                  Modernizr[a[0]] instanceof Boolean ||
                  (Modernizr[a[0]] = new Boolean(Modernizr[a[0]])),
                (Modernizr[a[0]][a[1]] = o)),
            C.push((o ? '' : 'no-') + a.join('-'));
      }
  }
  function s(e) {
    var n = b.className,
      t = Modernizr._config.classPrefix || '';
    if ((x && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      var r = new RegExp('(^|\\s)' + t + 'no-js(\\s|$)');
      n = n.replace(r, '$1' + t + 'js$2');
    }
    Modernizr._config.enableClasses &&
      ((n += ' ' + t + e.join(' ' + t)), x ? (b.className.baseVal = n) : (b.className = n));
  }
  function i() {
    return 'function' != typeof n.createElement
      ? n.createElement(arguments[0])
      : x
      ? n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function a(e, n) {
    return !!~('' + e).indexOf(n);
  }
  function l(e) {
    return e
      .replace(/([a-z])-([a-z])/g, function(e, n, t) {
        return n + t.toUpperCase();
      })
      .replace(/^-/, '');
  }
  function f(e, n) {
    return function() {
      return e.apply(n, arguments);
    };
  }
  function u(e, n, t) {
    var o;
    for (var s in e) if (e[s] in n) return t === !1 ? e[s] : ((o = n[e[s]]), r(o, 'function') ? f(o, t || n) : o);
    return !1;
  }
  function d(e) {
    return e
      .replace(/([A-Z])/g, function(e, n) {
        return '-' + n.toLowerCase();
      })
      .replace(/^ms-/, '-ms-');
  }
  function c(n, t, r) {
    var o;
    if ('getComputedStyle' in e) {
      o = getComputedStyle.call(e, n, t);
      var s = e.console;
      if (null !== o) r && (o = o.getPropertyValue(r));
      else if (s) {
        var i = s.error ? 'error' : 'log';
        s[i].call(s, 'getComputedStyle returning null, its possible modernizr test results are inaccurate');
      }
    } else o = !t && n.currentStyle && n.currentStyle[r];
    return o;
  }
  function p() {
    var e = n.body;
    return e || ((e = i(x ? 'svg' : 'body')), (e.fake = !0)), e;
  }
  function m(e, t, r, o) {
    var s,
      a,
      l,
      f,
      u = 'modernizr',
      d = i('div'),
      c = p();
    if (parseInt(r, 10)) for (; r--; ) (l = i('div')), (l.id = o ? o[r] : u + (r + 1)), d.appendChild(l);
    return (
      (s = i('style')),
      (s.type = 'text/css'),
      (s.id = 's' + u),
      (c.fake ? c : d).appendChild(s),
      c.appendChild(d),
      s.styleSheet ? (s.styleSheet.cssText = e) : s.appendChild(n.createTextNode(e)),
      (d.id = u),
      c.fake &&
        ((c.style.background = ''),
        (c.style.overflow = 'hidden'),
        (f = b.style.overflow),
        (b.style.overflow = 'hidden'),
        b.appendChild(c)),
      (a = t(d, e)),
      c.fake ? (c.parentNode.removeChild(c), (b.style.overflow = f), b.offsetHeight) : d.parentNode.removeChild(d),
      !!a
    );
  }
  function g(n, r) {
    var o = n.length;
    if ('CSS' in e && 'supports' in e.CSS) {
      for (; o--; ) if (e.CSS.supports(d(n[o]), r)) return !0;
      return !1;
    }
    if ('CSSSupportsRule' in e) {
      for (var s = []; o--; ) s.push('(' + d(n[o]) + ':' + r + ')');
      return (
        (s = s.join(' or ')),
        m('@supports (' + s + ') { #modernizr { position: absolute; } }', function(e) {
          return 'absolute' == c(e, null, 'position');
        })
      );
    }
    return t;
  }
  function h(e, n, o, s) {
    function f() {
      d && (delete T.style, delete T.modElem);
    }
    if (((s = r(s, 'undefined') ? !1 : s), !r(o, 'undefined'))) {
      var u = g(e, o);
      if (!r(u, 'undefined')) return u;
    }
    for (var d, c, p, m, h, v = ['modernizr', 'tspan', 'samp']; !T.style && v.length; )
      (d = !0), (T.modElem = i(v.shift())), (T.style = T.modElem.style);
    for (p = e.length, c = 0; p > c; c++)
      if (((m = e[c]), (h = T.style[m]), a(m, '-') && (m = l(m)), T.style[m] !== t)) {
        if (s || r(o, 'undefined')) return f(), 'pfx' == n ? m : !0;
        try {
          T.style[m] = o;
        } catch (y) {}
        if (T.style[m] != h) return f(), 'pfx' == n ? m : !0;
      }
    return f(), !1;
  }
  function v(e, n, t, o, s) {
    var i = e.charAt(0).toUpperCase() + e.slice(1),
      a = (e + ' ' + z.join(i + ' ') + i).split(' ');
    return r(n, 'string') || r(n, 'undefined')
      ? h(a, n, o, s)
      : ((a = (e + ' ' + k.join(i + ' ') + i).split(' ')), u(a, n, t));
  }
  function y(e, n, r) {
    return v(e, t, t, n, r);
  }
  var C = [],
    w = [],
    _ = {
      _version: '3.6.0',
      _config: { classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
      _q: [],
      on: function(e, n) {
        var t = this;
        setTimeout(function() {
          n(t[e]);
        }, 0);
      },
      addTest: function(e, n, t) {
        w.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function(e) {
        w.push({ name: null, fn: e });
      }
    },
    Modernizr = function() {};
  (Modernizr.prototype = _), (Modernizr = new Modernizr());
  var b = n.documentElement,
    x = 'svg' === b.nodeName.toLowerCase(),
    S = _._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['', ''];
  (_._prefixes = S),
    Modernizr.addTest('cssgradients', function() {
      for (
        var e,
          n = 'background-image:',
          t = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
          r = '',
          o = 0,
          s = S.length - 1;
        s > o;
        o++
      )
        (e = 0 === o ? 'to ' : ''), (r += n + S[o] + 'linear-gradient(' + e + 'left top, #9f9, white);');
      Modernizr._config.usePrefixes && (r += n + '-webkit-' + t);
      var a = i('a'),
        l = a.style;
      return (l.cssText = r), ('' + l.backgroundImage).indexOf('gradient') > -1;
    });
  var P = 'Moz O ms Webkit',
    z = _._config.usePrefixes ? P.split(' ') : [];
  _._cssomPrefixes = z;
  var k = _._config.usePrefixes ? P.toLowerCase().split(' ') : [];
  _._domPrefixes = k;
  var E = { elem: i('modernizr') };
  Modernizr._q.push(function() {
    delete E.elem;
  });
  var T = { style: E.elem.style };
  Modernizr._q.unshift(function() {
    delete T.style;
  }),
    (_.testAllProps = v),
    (_.testAllProps = y),
    Modernizr.addTest('borderradius', y('borderRadius', '0px', !0)),
    o(),
    s(C),
    delete _.addTest,
    delete _.addAsyncTest;
  for (var N = 0; N < Modernizr._q.length; N++) Modernizr._q[N]();
  e.Modernizr = Modernizr;
})(window, document);
