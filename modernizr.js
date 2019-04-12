/*! modernizr 3.7.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-appearance-canvas-customelements-es5-es5array-es5date-es5function-es5object-es5string-es6array-es6collections-es6object-es6string-formattribute-formvalidation-fullscreen-htmlimports-ie8compat-input-inputsearchevent-inputtypes-json-olreversed-placeholder-promises-svg-templatestrings-setclasses !*/
!(function(window, document, undefined) {
  function is(e, t) {
    return typeof e === t;
  }
  function testRunner() {
    var e, t, r, n, o, i, s;
    for (var d in tests)
      if (tests.hasOwnProperty(d)) {
        if (
          ((e = []),
          (t = tests[d]),
          t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
        )
          for (r = 0; r < t.options.aliases.length; r++) e.push(t.options.aliases[r].toLowerCase());
        for (n = is(t.fn, 'function') ? t.fn() : t.fn, o = 0; o < e.length; o++)
          (i = e[o]),
            (s = i.split('.')),
            1 === s.length
              ? (Modernizr[s[0]] = n)
              : (!Modernizr[s[0]] ||
                  Modernizr[s[0]] instanceof Boolean ||
                  (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
                (Modernizr[s[0]][s[1]] = n)),
            classes.push((n ? '' : 'no-') + s.join('-'));
      }
  }
  function setClasses(e) {
    var t = docElement.className,
      r = Modernizr._config.classPrefix || '';
    if ((isSVG && (t = t.baseVal), Modernizr._config.enableJSClass)) {
      var n = new RegExp('(^|\\s)' + r + 'no-js(\\s|$)');
      t = t.replace(n, '$1' + r + 'js$2');
    }
    Modernizr._config.enableClasses &&
      (e.length > 0 && (t += ' ' + r + e.join(' ' + r)),
      isSVG ? (docElement.className.baseVal = t) : (docElement.className = t));
  }
  function createElement() {
    return 'function' != typeof document.createElement
      ? document.createElement(arguments[0])
      : isSVG
      ? document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0])
      : document.createElement.apply(document, arguments);
  }
  function contains(e, t) {
    return !!~('' + e).indexOf(t);
  }
  function getBody() {
    var e = document.body;
    return e || ((e = createElement(isSVG ? 'svg' : 'body')), (e.fake = !0)), e;
  }
  function injectElementWithStyles(e, t, r, n) {
    var o,
      i,
      s,
      d,
      a = 'modernizr',
      l = createElement('div'),
      u = getBody();
    if (parseInt(r, 10)) for (; r--; ) (s = createElement('div')), (s.id = n ? n[r] : a + (r + 1)), l.appendChild(s);
    return (
      (o = createElement('style')),
      (o.type = 'text/css'),
      (o.id = 's' + a),
      (u.fake ? u : l).appendChild(o),
      u.appendChild(l),
      o.styleSheet ? (o.styleSheet.cssText = e) : o.appendChild(document.createTextNode(e)),
      (l.id = a),
      u.fake &&
        ((u.style.background = ''),
        (u.style.overflow = 'hidden'),
        (d = docElement.style.overflow),
        (docElement.style.overflow = 'hidden'),
        docElement.appendChild(u)),
      (i = t(l, e)),
      u.fake
        ? (u.parentNode.removeChild(u), (docElement.style.overflow = d), docElement.offsetHeight)
        : l.parentNode.removeChild(l),
      !!i
    );
  }
  function domToCSS(e) {
    return e
      .replace(/([A-Z])/g, function(e, t) {
        return '-' + t.toLowerCase();
      })
      .replace(/^ms-/, '-ms-');
  }
  function computedStyle(e, t, r) {
    var n;
    if ('getComputedStyle' in window) {
      n = getComputedStyle.call(window, e, t);
      var o = window.console;
      if (null !== n) r && (n = n.getPropertyValue(r));
      else if (o) {
        var i = o.error ? 'error' : 'log';
        o[i].call(o, 'getComputedStyle returning null, its possible modernizr test results are inaccurate');
      }
    } else n = !t && e.currentStyle && e.currentStyle[r];
    return n;
  }
  function nativeTestProps(e, t) {
    var r = e.length;
    if ('CSS' in window && 'supports' in window.CSS) {
      for (; r--; ) if (window.CSS.supports(domToCSS(e[r]), t)) return !0;
      return !1;
    }
    if ('CSSSupportsRule' in window) {
      for (var n = []; r--; ) n.push('(' + domToCSS(e[r]) + ':' + t + ')');
      return (
        (n = n.join(' or ')),
        injectElementWithStyles('@supports (' + n + ') { #modernizr { position: absolute; } }', function(e) {
          return 'absolute' === computedStyle(e, null, 'position');
        })
      );
    }
    return undefined;
  }
  function cssToDOM(e) {
    return e
      .replace(/([a-z])-([a-z])/g, function(e, t, r) {
        return t + r.toUpperCase();
      })
      .replace(/^-/, '');
  }
  function testProps(e, t, r, n) {
    function o() {
      s && (delete mStyle.style, delete mStyle.modElem);
    }
    if (((n = !is(n, 'undefined') && n), !is(r, 'undefined'))) {
      var i = nativeTestProps(e, r);
      if (!is(i, 'undefined')) return i;
    }
    for (var s, d, a, l, u, c = ['modernizr', 'tspan', 'samp']; !mStyle.style && c.length; )
      (s = !0), (mStyle.modElem = createElement(c.shift())), (mStyle.style = mStyle.modElem.style);
    for (a = e.length, d = 0; d < a; d++)
      if (((l = e[d]), (u = mStyle.style[l]), contains(l, '-') && (l = cssToDOM(l)), mStyle.style[l] !== undefined)) {
        if (n || is(r, 'undefined')) return o(), 'pfx' !== t || l;
        try {
          mStyle.style[l] = r;
        } catch (e) {}
        if (mStyle.style[l] !== u) return o(), 'pfx' !== t || l;
      }
    return o(), !1;
  }
  function fnBind(e, t) {
    return function() {
      return e.apply(t, arguments);
    };
  }
  function testDOMProps(e, t, r) {
    var n;
    for (var o in e) if (e[o] in t) return !1 === r ? e[o] : ((n = t[e[o]]), is(n, 'function') ? fnBind(n, r || t) : n);
    return !1;
  }
  function testPropsAll(e, t, r, n, o) {
    var i = e.charAt(0).toUpperCase() + e.slice(1),
      s = (e + ' ' + cssomPrefixes.join(i + ' ') + i).split(' ');
    return is(t, 'string') || is(t, 'undefined')
      ? testProps(s, t, n, o)
      : ((s = (e + ' ' + domPrefixes.join(i + ' ') + i).split(' ')), testDOMProps(s, t, r));
  }
  function addTest(e, t) {
    if ('object' == typeof e) for (var r in e) hasOwnProp(e, r) && addTest(r, e[r]);
    else {
      e = e.toLowerCase();
      var n = e.split('.'),
        o = Modernizr[n[0]];
      if ((2 === n.length && (o = o[n[1]]), void 0 !== o)) return Modernizr;
      (t = 'function' == typeof t ? t() : t),
        1 === n.length
          ? (Modernizr[n[0]] = t)
          : (!Modernizr[n[0]] || Modernizr[n[0]] instanceof Boolean || (Modernizr[n[0]] = new Boolean(Modernizr[n[0]])),
            (Modernizr[n[0]][n[1]] = t)),
        setClasses([(t && !1 !== t ? '' : 'no-') + n.join('-')]),
        Modernizr._trigger(e, t);
    }
    return Modernizr;
  }
  function testAllProps(e, t, r) {
    return testPropsAll(e, undefined, undefined, t, r);
  }
  var tests = [],
    ModernizrProto = {
      _version: '3.7.1',
      _config: { classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
      _q: [],
      on: function(e, t) {
        var r = this;
        setTimeout(function() {
          t(r[e]);
        }, 0);
      },
      addTest: function(e, t, r) {
        tests.push({ name: e, fn: t, options: r });
      },
      addAsyncTest: function(e) {
        tests.push({ name: null, fn: e });
      }
    },
    Modernizr = function() {};
  (Modernizr.prototype = ModernizrProto), (Modernizr = new Modernizr());
  var classes = [],
    docElement = document.documentElement,
    isSVG = 'svg' === docElement.nodeName.toLowerCase();
  Modernizr.addTest('canvas', function() {
    var e = createElement('canvas');
    return !(!e.getContext || !e.getContext('2d'));
  }),
    Modernizr.addTest('customelements', 'customElements' in window);
  var omPrefixes = 'Moz O ms Webkit',
    cssomPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : [];
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  var modElem = { elem: createElement('modernizr') };
  Modernizr._q.push(function() {
    delete modElem.elem;
  });
  var mStyle = { style: modElem.elem.style };
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });
  var domPrefixes = ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : [];
  (ModernizrProto._domPrefixes = domPrefixes), (ModernizrProto.testAllProps = testPropsAll);
  var atRule = function(e) {
    var t,
      r = prefixes.length,
      n = window.CSSRule;
    if (void 0 === n) return undefined;
    if (!e) return !1;
    if (((e = e.replace(/^@/, '')), (t = e.replace(/-/g, '_').toUpperCase() + '_RULE') in n)) return '@' + e;
    for (var o = 0; o < r; o++) {
      var i = prefixes[o];
      if (i.toUpperCase() + '_' + t in n) return '@-' + i.toLowerCase() + '-' + e;
    }
    return !1;
  };
  ModernizrProto.atRule = atRule;
  var prefixed = (ModernizrProto.prefixed = function(e, t, r) {
    return 0 === e.indexOf('@')
      ? atRule(e)
      : (-1 !== e.indexOf('-') && (e = cssToDOM(e)), t ? testPropsAll(e, t, r) : testPropsAll(e, 'pfx'));
  });
  Modernizr.addTest(
    'fullscreen',
    !(!prefixed('exitFullscreen', document, !1) && !prefixed('cancelFullScreen', document, !1))
  );
  var hasOwnProp;
  !(function() {
    var e = {}.hasOwnProperty;
    hasOwnProp =
      is(e, 'undefined') || is(e.call, 'undefined')
        ? function(e, t) {
            return t in e && is(e.constructor.prototype[t], 'undefined');
          }
        : function(t, r) {
            return e.call(t, r);
          };
  })(),
    (ModernizrProto._l = {}),
    (ModernizrProto.on = function(e, t) {
      this._l[e] || (this._l[e] = []),
        this._l[e].push(t),
        Modernizr.hasOwnProperty(e) &&
          setTimeout(function() {
            Modernizr._trigger(e, Modernizr[e]);
          }, 0);
    }),
    (ModernizrProto._trigger = function(e, t) {
      if (this._l[e]) {
        var r = this._l[e];
        setTimeout(function() {
          var e;
          for (e = 0; e < r.length; e++) (0, r[e])(t);
        }, 0),
          delete this._l[e];
      }
    }),
    Modernizr._q.push(function() {
      ModernizrProto.addTest = addTest;
    }),
    Modernizr.addTest('htmlimports', 'import' in createElement('link')),
    Modernizr.addTest('ie8compat', !window.addEventListener && !!document.documentMode && 7 === document.documentMode);
  var inputElem = createElement('input'),
    inputattrs = 'autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '),
    attrs = {};
  Modernizr.input = (function(e) {
    for (var t = 0, r = e.length; t < r; t++) attrs[e[t]] = !!(e[t] in inputElem);
    return attrs.list && (attrs.list = !(!createElement('datalist') || !window.HTMLDataListElement)), attrs;
  })(inputattrs);
  var hasEvent = (function() {
    function e(e, r) {
      var n;
      return (
        !!e &&
        ((r && 'string' != typeof r) || (r = createElement(r || 'div')),
        (e = 'on' + e),
        (n = e in r),
        !n &&
          t &&
          (r.setAttribute || (r = createElement('div')),
          r.setAttribute(e, ''),
          (n = 'function' == typeof r[e]),
          r[e] !== undefined && (r[e] = undefined),
          r.removeAttribute(e)),
        n)
      );
    }
    var t = !('onblur' in docElement);
    return e;
  })();
  (ModernizrProto.hasEvent = hasEvent), Modernizr.addTest('inputsearchevent', hasEvent('search'));
  var inputtypes = 'search tel url email datetime date month week time datetime-local number range color'.split(' '),
    inputs = {};
  (Modernizr.inputtypes = (function(e) {
    for (var t, r, n, o = e.length, i = 0; i < o; i++)
      inputElem.setAttribute('type', (t = e[i])),
        (n = 'text' !== inputElem.type && 'style' in inputElem),
        n &&
          ((inputElem.value = '1)'),
          (inputElem.style.cssText = 'position:absolute;visibility:hidden;'),
          /^range$/.test(t) && inputElem.style.WebkitAppearance !== undefined
            ? (docElement.appendChild(inputElem),
              (r = document.defaultView),
              (n =
                r.getComputedStyle &&
                'textfield' !== r.getComputedStyle(inputElem, null).WebkitAppearance &&
                0 !== inputElem.offsetHeight),
              docElement.removeChild(inputElem))
            : /^(search|tel)$/.test(t) ||
              (n = /^(url|email)$/.test(t)
                ? inputElem.checkValidity && !1 === inputElem.checkValidity()
                : '1)' !== inputElem.value)),
        (inputs[e[i]] = !!n);
    return inputs;
  })(inputtypes)),
    Modernizr.addTest('json', 'JSON' in window && 'parse' in JSON && 'stringify' in JSON),
    Modernizr.addTest('olreversed', 'reversed' in createElement('ol')),
    Modernizr.addTest(
      'svg',
      !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    ),
    Modernizr.addTest('templatestrings', function() {
      var supports;
      try {
        eval('``'), (supports = !0);
      } catch (e) {}
      return !!supports;
    }),
    (ModernizrProto.testAllProps = testAllProps),
    Modernizr.addTest('appearance', testAllProps('appearance')),
    Modernizr.addTest('es5array', function() {
      return !!(
        Array.prototype &&
        Array.prototype.every &&
        Array.prototype.filter &&
        Array.prototype.forEach &&
        Array.prototype.indexOf &&
        Array.prototype.lastIndexOf &&
        Array.prototype.map &&
        Array.prototype.some &&
        Array.prototype.reduce &&
        Array.prototype.reduceRight &&
        Array.isArray
      );
    }),
    Modernizr.addTest('es5date', function() {
      var e = !1;
      try {
        e = !!Date.parse('2013-04-12T06:06:37.307Z');
      } catch (e) {}
      return !!(Date.now && Date.prototype && Date.prototype.toISOString && Date.prototype.toJSON && e);
    }),
    Modernizr.addTest('es5function', function() {
      return !(!Function.prototype || !Function.prototype.bind);
    }),
    Modernizr.addTest('es5object', function() {
      return !!(
        Object.keys &&
        Object.create &&
        Object.getPrototypeOf &&
        Object.getOwnPropertyNames &&
        Object.isSealed &&
        Object.isFrozen &&
        Object.isExtensible &&
        Object.getOwnPropertyDescriptor &&
        Object.defineProperty &&
        Object.defineProperties &&
        Object.seal &&
        Object.freeze &&
        Object.preventExtensions
      );
    }),
    Modernizr.addTest(
      'strictmode',
      (function() {
        'use strict';
        return !this;
      })()
    ),
    Modernizr.addTest('es5string', function() {
      return !(!String.prototype || !String.prototype.trim);
    }),
    Modernizr.addTest('es5syntax', function() {
      var value, obj, stringAccess, getter, setter, reservedWords, zeroWidthChars;
      try {
        return (
          (stringAccess = eval('"foobar"[3] === "b"')),
          (getter = eval('({ get x(){ return 1 } }).x === 1')),
          eval('({ set x(v){ value = v; } }).x = 1'),
          (setter = 1 === value),
          eval('obj = ({ if: 1 })'),
          (reservedWords = 1 === obj.if),
          (zeroWidthChars = eval('_‌‍ = true')),
          stringAccess && getter && setter && reservedWords && zeroWidthChars
        );
      } catch (e) {
        return !1;
      }
    }),
    Modernizr.addTest('es5undefined', function() {
      var e, t;
      try {
        (t = window.undefined), (window.undefined = 12345), (e = void 0 === window.undefined), (window.undefined = t);
      } catch (e) {
        return !1;
      }
      return e;
    }),
    Modernizr.addTest('es5', function() {
      return !!(
        Modernizr.es5array &&
        Modernizr.es5date &&
        Modernizr.es5function &&
        Modernizr.es5object &&
        Modernizr.strictmode &&
        Modernizr.es5string &&
        Modernizr.json &&
        Modernizr.es5syntax &&
        Modernizr.es5undefined
      );
    }),
    Modernizr.addTest(
      'es6array',
      !!(
        Array.prototype &&
        Array.prototype.copyWithin &&
        Array.prototype.fill &&
        Array.prototype.find &&
        Array.prototype.findIndex &&
        Array.prototype.keys &&
        Array.prototype.entries &&
        Array.prototype.values &&
        Array.from &&
        Array.of
      )
    ),
    Modernizr.addTest('es6collections', !!(window.Map && window.Set && window.WeakMap && window.WeakSet)),
    Modernizr.addTest('es6object', !!(Object.assign && Object.is && Object.setPrototypeOf)),
    Modernizr.addTest('promises', function() {
      return (
        'Promise' in window &&
        'resolve' in window.Promise &&
        'reject' in window.Promise &&
        'all' in window.Promise &&
        'race' in window.Promise &&
        (function() {
          var e;
          return (
            new window.Promise(function(t) {
              e = t;
            }),
            'function' == typeof e
          );
        })()
      );
    }),
    Modernizr.addTest(
      'es6string',
      !!(
        String.fromCodePoint &&
        String.raw &&
        String.prototype.codePointAt &&
        String.prototype.repeat &&
        String.prototype.startsWith &&
        String.prototype.endsWith &&
        String.prototype.includes
      )
    ),
    Modernizr.addTest('formattribute', function() {
      var e,
        t = createElement('form'),
        r = createElement('input'),
        n = createElement('div'),
        o = 'formtest' + new Date().getTime(),
        i = !1;
      t.id = o;
      try {
        r.setAttribute('form', o);
      } catch (t) {
        document.createAttribute && ((e = document.createAttribute('form')), (e.nodeValue = o), r.setAttributeNode(e));
      }
      return (
        n.appendChild(t),
        n.appendChild(r),
        docElement.appendChild(n),
        (i = t.elements && 1 === t.elements.length && r.form === t),
        n.parentNode.removeChild(n),
        i
      );
    }),
    Modernizr.addTest(
      'placeholder',
      'placeholder' in createElement('input') && 'placeholder' in createElement('textarea')
    );
  var testStyles = (ModernizrProto.testStyles = injectElementWithStyles);
  Modernizr.addTest('formvalidation', function() {
    var e = createElement('form');
    if (!('checkValidity' in e && 'addEventListener' in e)) return !1;
    if ('reportValidity' in e) return !0;
    var t,
      r = !1;
    return (
      (Modernizr.formvalidationapi = !0),
      e.addEventListener(
        'submit',
        function(e) {
          (window.opera && !window.operamini) || e.preventDefault(), e.stopPropagation();
        },
        !1
      ),
      (e.innerHTML = '<input name="modTest" required="required" /><button></button>'),
      testStyles('#modernizr form{position:absolute;top:-99999em}', function(n) {
        n.appendChild(e),
          (t = e.getElementsByTagName('input')[0]),
          t.addEventListener(
            'invalid',
            function(e) {
              (r = !0), e.preventDefault(), e.stopPropagation();
            },
            !1
          ),
          (Modernizr.formvalidationmessage = !!t.validationMessage),
          e.getElementsByTagName('button')[0].click();
      }),
      r
    );
  }),
    testRunner(),
    setClasses(classes),
    delete ModernizrProto.addTest,
    delete ModernizrProto.addAsyncTest;
  for (var i = 0; i < Modernizr._q.length; i++) Modernizr._q[i]();
  window.Modernizr = Modernizr;
})(window, document);
