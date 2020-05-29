import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() dropdownList;
  @Output() valueChange = new EventEmitter();
  selected: string;
  itemsList: any;
  constructor(private readonly iconRegistry: MatIconRegistry, private readonly sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'arrow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg'
      )
    );
  }

  ngOnInit() {
    this.itemsList = this.dropdownList;
    this.selected = this.itemsList[0].value;
  }
  doSomething(val) {
    this.valueChange.emit(val);
  }
}
