import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edi-submission',
  templateUrl: './edi-submission.component.html',
  styleUrls: ['./edi-submission.component.scss']
})
export class EdiSubmissionComponent implements OnInit {
  pageTitle: String = '';

  constructor() {
    this.pageTitle = 'EDI';
  }

  ngOnInit() {}
}
