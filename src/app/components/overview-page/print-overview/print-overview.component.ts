import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-print-overview',
  templateUrl: './print-overview.component.html',
  styleUrls: ['./print-overview.component.scss']
})
export class PrintOverviewComponent implements OnInit {
  printStyle: boolean;
  ngOnInit() {
    this.printStyle = true;
  }
}
