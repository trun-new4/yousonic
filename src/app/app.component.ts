import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiSpotifyService, SearchResultArtist, Artist } from './services/spotify/api.spotify.service';
import { SpotifyApi, ItemTypes, PartialSearchResult } from "@spotify/web-api-ts-sdk";

import { ArtistSystem, CubeConfig } from './spotify-canvas/spotify-canvas.component';
import { SearchBarConfig } from './search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor( private spotify: ApiSpotifyService) {}
  title = 'yousonic';
  currentUIArtist:  CubeConfig;
  artistSystem: ArtistSystem;

  artistName: string;

  searchBarConfig: SearchBarConfig = {
    search: this.findArtist.bind(this)
  }

  ngOnInit(): void {
    this.searchArtist();
  }


  findArtist(artistName: string): void {
    this.searchArtist(artistName);
  }

  searchArtist(artist?: string): void {

    const artistToSearchOn = artist || 'The Beatles';

    this.spotify.searchArtist(artistToSearchOn).subscribe((items: SearchResultArtist[])=> {
      console.log('new data --- ');
      console.log(items);

      if( items[0] ) {
        this.getArtist(items[0].id);
      }
    });
    
  }

  getArtist(id: string): void {
    this.spotify.getArtist(id).subscribe((artist: Artist)=>{
      console.log(artist.name);
      console.log(artist);
      this.currentUIArtist = {
        name: artist.name,
        image: artist.images[0]?.url || '',
        popularity: artist.popularity,
        followers: artist.followers
      };
      this.getSimilarArtists(artist.id);
    })
  }

  getSimilarArtists(id: string): void {
    this.spotify.getSimilarArtist(id).subscribe((similarArtists: Artist[])=>{
      console.log('similarArtists');
      console.log(similarArtists);



      const artistSystem: ArtistSystem = {
        name: this.currentUIArtist.name,
        image: this.currentUIArtist.image,
        popularity: this.currentUIArtist.popularity,
        followers: this.currentUIArtist.followers,
        similar: []
      };

      similarArtists.forEach((similarArtist: Artist)=> {
        artistSystem.similar?.push({
          name: similarArtist.name,
          image: similarArtist.images[0]?.url || '',
          popularity: similarArtist.popularity,
          followers: similarArtist.followers
        });
      });

      this.artistSystem = artistSystem;
    })
  }


}
