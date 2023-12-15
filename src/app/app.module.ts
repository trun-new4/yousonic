import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

import { ApiService } from './services/api.service';

import { AppComponent } from './app.component';
import { InterfaceComponent } from './interface/interface.component';
import { SpotifyCanvasComponent } from './spotify-canvas/spotify-canvas.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { TitleComponent } from './title/title.component';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [ 
    AppComponent, 
    InterfaceComponent, 
    SpotifyCanvasComponent, 
    SearchBarComponent, 
    TitleComponent,
    LogoComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { bindToComponentInputs: true }),
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }