import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clarify-claims-message',
  templateUrl: './clarify-claims-message.component.html',
  styleUrls: ['./clarify-claims-message.component.scss']
})
export class ClarifyClaimsMessageComponent implements OnInit {
  message: String = '*Claims metrics are calculated using Date of Service.';
  constructor() {}

  ngOnInit() {}
}
