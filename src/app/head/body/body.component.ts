import { Component, OnInit, AfterViewInit, Inject, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, AfterViewInit {
  constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: any) {}

  ngOnInit() {}
  ngAfterViewInit() {
    const url = environment.clickStreamUrl;
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.src = url;
    const __this = this; // to store the current instance to call
    // afterScriptAdded function on onload event of
    // script.

    s.onload = function() {
      __this.afterScriptAdded();
    };
    this.elementRef.nativeElement.appendChild(s);
  }

  afterScriptAdded() {
    const params = {
      uuid: '3501-kbw47t-8734iygfo8awe'
    };
    if (typeof window['pageDataLayer.digitalData.protected.URLSearchParams.uuid'] === 'function') {
      window['pageDataLayer.digitalData.protected.URLSearchParams.uuid'](params);
    }
  }
}
