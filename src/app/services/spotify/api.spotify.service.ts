import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, map, of } from 'rxjs';
import { ApiService, ApiServiceRequest } from '@services/api.service';
import { environment } from 'src/environments/environment';
import { SpotifyApi, ItemTypes, PartialSearchResult } from "@spotify/web-api-ts-sdk";
import { from } from 'rxjs';

import { ApiSpotifyAuthService } from '@services/spotify/api.spotify.auth.service';

export interface SearchResultArtist {
  id: string;
  name: string;
  followers: number;
  popularity: number;
  image: string;
}

export interface Artist {
  id: string;
  name: string;
  followers: number;
  popularity: number;
  images: {
    height: number;
    width: number;
    url: string;
  }[];
  uri: string;
  genres: string[];
}


@Injectable({
  providedIn: 'root'
})
export class ApiSpotifyService {
  env = environment;
  constructor(private apiSpotifyAuth: ApiSpotifyAuthService) {}

  api(): SpotifyApi {
    return this.apiSpotifyAuth.authenticate();
  }

  searchArtist(searchTerm: string): Observable<SearchResultArtist[]> {
    const request = this.api().search(searchTerm, ['artist']);
    return from(request).pipe(map(this.searchArtistResponse.bind(this)));
  }

  searchArtistResponse(items: any): SearchResultArtist[] {
    return items.artists.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      followers: item.followers.total,
      popularity: item.popularity,
      image: item.images[0]?.url || ''
    }));
  }

  getArtist(id: string): any {
    const request = this.api().artists.get(id);
    return from(request).pipe(map(this.getArtistResponse.bind(this)));
  }

  getArtistResponse(item: any): Artist {
    console.log(item);
    return {
      id: item.id,
      name: item.name,
      followers: item.followers.total,
      popularity: item.popularity,
      images: item.images,
      uri: item.uri,
      genres: item.genres
    }
  }

  getSimilarArtist(id: string): any {
    const request = this.api().artists.relatedArtists(id);
    return from(request).pipe(map(this.getSimilarArtistResponse.bind(this)));
  }

  getSimilarArtistResponse(items: any): Artist[] {
    return items.artists.map((item: any) => (
      {
        id: item.id,
        name: item.name,
        followers: item.followers.total,
        popularity: item.popularity,
        images: item.images,
        uri: item.uri,
        genres: item.genres
      }
    ));
  }
}