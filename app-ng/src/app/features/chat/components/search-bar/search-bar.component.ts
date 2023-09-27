import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'SearchBar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() text = '';
  @Output() textChange = new EventEmitter<string>()

  onSearch() {
    this.textChange.emit(this.text);
  }
}
