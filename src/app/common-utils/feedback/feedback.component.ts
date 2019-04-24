import { Component, OnInit, AfterViewInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements AfterViewInit {
  public get;
  public set;
  public start;
  public check;
  public go;

  constructor(@Inject(DOCUMENT) private document: any, private elementRef: ElementRef) {}

  public ngAfterViewInit() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';

    s.src =
      'https://zn0h7qksubhyyafbf-uhcdr.siteintercept.qualtrics.com/WRSiteInterceptEngine/?Q_ZID=ZN_0H7qksUbHYyAfbf';

    const __this = this; // to store the current instance to call
    // afterScriptAdded function on onload event of
    // script.

    s.onload = function() {
      __this.afterScriptAdded();
    };
    this.elementRef.nativeElement.appendChild(s);
  }

  afterScriptAdded() {
    /* tslint:disable */
    let a;
    let b;
    let c;
    let e;
    let h;
    let f;
    let g;
    {
      this.get = function(a) {
        for (a = a + '=', c = document.cookie.split(';'), b = 0, e = c.length; b < e; b++) {
          for (var d = c[b]; ' ' == d.charAt(0); ) d = d.substring(1, d.length);
          if (0 == d.indexOf(a)) return d.substring(a.length, d.length);
        }
        return null;
      };
      this.set = function(a, c) {
        (b = ''), (b = new Date());
        b.setTime(b.getTime() + 6048e5);
        b = '; expires=' + b.toGMTString();
        document.cookie = a + '=' + c + b + '; path=/; ';
      };
      this.check = function() {
        var a = this.get(f);
        if (a) a = a.split(':');
        else if (100 != e)
          'v' == h && (e = Math.random() >= e / 100 ? 0 : 100), (a = [h, e, 0]), this.set(f, a.join(':'));
        else return !0;
        var c = a[1];
        if (100 == c) return !0;
        switch (a[0]) {
          case 'v':
            return !1;
          case 'r':
            return (c = a[2] % Math.floor(100 / c)), a[2]++, this.set(f, a.join(':')), !c;
        }
        return !0;
      };
      this.go = function() {
        if (this.check()) {
          var a = document.createElement('script');
          a.type = 'text/javascript';
          a.src = g + '&t=' + new Date().getTime();
          document.body && document.body.appendChild(a);
        }
      };
      this.start = function() {
        var a = this;
        window.addEventListener
          ? window.addEventListener(
              'load',
              function() {
                a.go();
              },
              !1
            )
          : window['attachEvent'] && window['attachEvent("onload",function(){a.go()})'];
      };
    }
    try {
      new g(
        100,
        'r',
        'QSI_S_ZN_0H7qksUbHYyAfbf',
        'https://zn0h7qksubhyyafbf-uhcdr.siteintercept.qualtrics.com/WRSiteInterceptEngine/?Q_ZID=ZN_0H7qksUbHYyAfbf&Q_LOC=' +
          encodeURIComponent(window.location.href)
      ).start();
    } catch (i) {}
    this.refreshQualtrics();
    /* tslint:disable */
  }

  public refreshQualtrics() {
    try {
      // @ts-ignore
      QSI.API.unload();
      // @ts-ignore
      QSI.API.load();
      // @ts-ignore
      QSI.API.run();
      console.log('QSI calls------------------->');
    } catch (error) {
      console.log('Error ', error);
    }
  }
}
