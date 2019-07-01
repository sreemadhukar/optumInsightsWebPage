import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as html2canvas from 'html2canvas';
import { PrintService } from '../../shared/print.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit, OnDestroy {
  public providerName = '---';
  // @Input() hasFilter: string;
  private canvas: any;
  private subscription: any;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public printService: PrintService) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'print-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/print-icon.svg')
    );
  }

  ngOnInit() {
    this.subscription = this.printService.getNavChangeEmitter().subscribe(() => this.print());
  }

  public print() {
    const region = document.getElementById('print-overview');
    html2canvas(region).then(c => {});
    html2canvas(region).then(canvas => {
      canvas.style.width = 700;
      canvas.style.height = 700;
      this.canvas = canvas;
      if (this.canvas) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.providerName = currentUser[0].Healthcareorganizationname;
        //   this.providerName = 'madhukar';
        this.popup(this.canvas);
      }
    });
  }

  public popup(canvas: any) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
                              <html>
                                <head>
                                  <title>Inderjeet</title>
                                <style>
                                body{
                                    float:left;
                                }
                                canvas {
                                    max-width:100%;
                                    position: absolute;
                                    top:70px;
                                    left:0;
                                    }
                                    .header-logo-space
                                    {
                                        padding: 20px 0 20px 10px;
                                        float:left;
                                     }
                                    .uhc-logo
                                    {
                                        height:30px;
                                        width: 147.12px;
                                     float:left;
                                    }
                                    .provider-name
                                    {
                                        position:absolute;
                                        right:0px;
                                        top:10px;
                                    }
                        </style>
                                </head>
                                <body>
                                <div class="header-logo-space">
                                    <img class="uhc-logo" src="assets/images/UHC Logo@2x.png" alt="UHC Logo" />
                                <div class="provider-name">
                                <h1>Provider Name</h1>
                                </div>
                            </div>
                               </body>
                              </html>`);
    popupWin.document.body.appendChild(canvas);
    popupWin.print();
    popupWin.close();

    // to split each tile
    // for (let i = 0; i < region.length; i++) {
    //   html2canvas(region[i]).then((canvas) => {
    //       canvas.style.width = '1200px';
    //       canvas.style.height = '500px';
    //       popupWin.document.body.appendChild(canvas);
    //       if (popupWin.document.body.childNodes.length - 1 === region.length) {
    //           popupWin.print();
    //       }
    //   });
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
