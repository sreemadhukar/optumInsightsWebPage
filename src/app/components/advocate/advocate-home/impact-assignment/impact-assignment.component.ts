import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-impact-assignment',
  templateUrl: './impact-assignment.component.html',
  styleUrls: ['./impact-assignment.component.scss']
})
export class ImpactAssignmentComponent implements OnInit {
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'star',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/star-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'round-search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
  }

  ngOnInit() {}
}
