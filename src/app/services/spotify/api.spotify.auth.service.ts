/*


77abd0f4318d42d48e4fd5355af5e751

49f8576cdd3143f9a89c5543f235cae4



curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=77abd0f4318d42d48e4fd5355af5e751&client_secret=49f8576cdd3143f9a89c5543f235cae4"

     >>> returns access token

     {
  "access_token": "BQDBKJ5eo5jxbtpWjVOj7ryS84khybFpP_lTqzV7uV-T_m0cTfwvdn5BnBSKPxKgEb11",
  "token_type": "Bearer",
  "expires_in": 3600
}

*/

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, map, of } from 'rxjs';
import { ApiService, ApiServiceRequest } from '@services/api.service';
import { environment } from 'src/environments/environment';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiSpotifyAuthService {
  env = environment;
  spotifyApi = SpotifyApi;
  constructor(private apiService: ApiService) {}

  authenticate(): SpotifyApi {
    const id = this.env.spotify.auth.id;
    const secret = this.env.spotify.auth.secret;

    return this.spotifyApi.withClientCredentials(id, secret);
  }
}