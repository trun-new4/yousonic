import { Component, Input } from '@angular/core';

export interface SearchBarConfig { search: Function; }

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  @Input() config: SearchBarConfig;
  artistName: string;

  findArtist(): void {
    this.config.search(this.artistName);
  }
}
