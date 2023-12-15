import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyCanvasComponent } from './spotify-canvas.component';

describe('SpotifyCanvasComponent', () => {
  let component: SpotifyCanvasComponent;
  let fixture: ComponentFixture<SpotifyCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
