import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as THREE from 'three';
import { Scene, Mesh, PerspectiveCamera, PointLight,MeshStandardMaterial, MeshBasicMaterial, BoxGeometry, SphereGeometry } from 'three';

import { OrbitControls } from 'three-orbitcontrols-ts';
import { musicPlanetFactory } from './music-planet.factory';


export interface CubeConfig {
  name: string;
  image: string;
  popularity: number;
  followers: number;
}

export interface ArtistPlanet {
  name: string;
  image: string;
  popularity: number;
  followers: number;
}

export interface ArtistSystem {
  name: string;
  image: string;
  popularity: number;
  followers: number;
  similar?: ArtistPlanet[];
}

@Component({
  selector: 'app-spotify-canvas',
  templateUrl: './spotify-canvas.component.html',
  styleUrl: './spotify-canvas.component.scss'
})
export class SpotifyCanvasComponent implements AfterViewInit, OnChanges {
  @Input() config: CubeConfig;
  @Input() artistSystem: ArtistSystem;

  @ViewChild('canvas', { static: true }) public canvas: ElementRef;

  scene: Scene;
  geometry: SphereGeometry | BoxGeometry;
  material: MeshStandardMaterial;
  cube: Mesh;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  light: PointLight;
  renderer: any;

  image: string;

  text1: any;

ngOnChanges(changes: SimpleChanges): void {
  /* @ts-ignore */
  this.camera  = null;
  this.render();
}

 ngAfterViewInit(): void {
   this.render();
 }

 render(): void {
  this.image = this.config.image;
  const canvas = this.canvas.nativeElement;
  let similarArtistPlanets: ArtistPlanet[] = [];
  let subMainObjects: any = [];
  let subMainPlanetsRotations: any = [];
  const ambientLight = new THREE.AmbientLight(0xefefef);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  this.scene = new THREE.Scene();
  this.scene.background = null;
  const sceneTextureLoader = new THREE.CubeTextureLoader();
  const starsTexture = 'https://trun-new4.github.io/yousonic/assets/stars.jpg';
  this.scene.background = sceneTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
  ]);

  const mainArtist = musicPlanetFactory({
    name: this.artistSystem.name,
    image: this.artistSystem.image,
    followers: this.artistSystem.followers,
    popularity: this.artistSystem.popularity
  }, true, {
    popularity: this.artistSystem.popularity,
    followers: this.artistSystem.popularity
  });

  
  this.scene.add(mainArtist);

  this.artistSystem.similar?.forEach((similarArtist)=> {
    similarArtistPlanets.push({
      name: similarArtist.name,
      image: similarArtist.image,
      followers: similarArtist.followers,
      popularity: similarArtist.popularity
    });
  });

  let subArtistPlanets: any = [];

  similarArtistPlanets?.forEach((similarArtistPlanet: ArtistPlanet, index: number)=> {

    const numberCount = index + 1;
    const subArtist = musicPlanetFactory({
      name: similarArtistPlanet.name,
      image: similarArtistPlanet.image,
      followers: similarArtistPlanet.followers,
      popularity: similarArtistPlanet.popularity
    }, false,{
      popularity: this.artistSystem.popularity,
      followers: this.artistSystem.popularity
    }, numberCount);

    subArtistPlanets.push(subArtist);
  });

  /* @ts-ignore */
  subArtistPlanets?.forEach((subArtistPlanet, index)=> {
    const randomStartOrder = Math.floor(Math.random() * 10) + 1
    //subArtistPlanet.rotateY( randomStartOrder)
    subMainObjects[index] = new THREE.Object3D();
    subMainObjects[index].rotateY(randomStartOrder);
    this.scene.add(subMainObjects[index]);
    subMainObjects[index].add(subArtistPlanet);

    subMainPlanetsRotations.push(randomStartOrder / 350);
  });

  this.scene.add(ambientLight);

  this.camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
  this.camera.position.z = 10;
  this.camera.position.y = 5;
  this.camera.zoom = 10;
  //this.camera.position.set(-90, 10, 1);
  this.scene.add(this.camera);


  this.renderer = new THREE.WebGLRenderer({canvas});
  this.renderer.setSize(sizes.width,sizes.height);
  this.renderer.render(this.scene, this.camera);

  this.controls = new OrbitControls(this.camera, canvas);
  this.controls.enableDamping = true;
  //this.controls.autoRotate = true;

  const pointLight = new THREE.PointLight(0xffffff, 90, 400);
  pointLight.position.z = 0
  this.scene.add(pointLight);


  let spotLight1 = new THREE.SpotLight( 0xffffff, 800 );
				spotLight1.position.set( 0, 0, 7 );
				spotLight1.angle = Math.PI / 11;
				spotLight1.penumbra = 1;
				spotLight1.decay = 1.8;
				spotLight1.distance = 10;
				

				// spotLight1.castShadow = true;
				// spotLight1.shadow.mapSize.width = 800;
				// spotLight1.shadow.mapSize.height = 500;
				// spotLight1.shadow.camera.near = 2;
				// spotLight1.shadow.camera.far = 2;
				// spotLight1.shadow.focus = 1;
				//this.scene.add( spotLight1 );

				const lightHelper = new THREE.SpotLightHelper( spotLight1 );
				//this.scene.add( lightHelper );

        let spotLight2 = new THREE.SpotLight( 0xffffff, 800 );
				spotLight2.position.set(6, 6, 3 );
				spotLight2.angle = Math.PI / 1;
				spotLight2.penumbra = 1;
				spotLight2.decay = 3;
				spotLight2.distance = 5;
				

				spotLight2.castShadow = true;
				spotLight2.shadow.mapSize.width = 800;
				spotLight2.shadow.mapSize.height = 500;
				spotLight2.shadow.camera.near = 2;
				spotLight2.shadow.camera.far = 5;
				spotLight2.shadow.focus = 1;
				//this.scene.add( spotLight2 );

				const lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
				//this.scene.add( lightHelper2 );

  const animate = ()=> {
    mainArtist.rotateY(0.0004);

    /* @ts-ignore */
    subArtistPlanets?.forEach((subArtistPlanet)=> {
      subArtistPlanet.rotateY(0.01);
    });

    subMainObjects.forEach((subMainObject: any, index: number)=> {
      let count = index + 1;
      //subMainObject.rotateY(count / 300);
      const rotationSpeed = subMainPlanetsRotations[index];
     // subMainObject.rotateY(rotationSpeed);
     subMainObject.rotateY(0.001);

    });

    this.renderer.render(this.scene, this.camera);
  };

  this.renderer.setAnimationLoop(animate);

  /* Resize */

  window.addEventListener('resize', ()=> {
    sizes.height = window.innerHeight;
    sizes.width = window.innerWidth;
    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(sizes.width, sizes.height);
  });

  let initTimer = 0;
  const initTimerStop = 100;

  const loop = ()=> {

    initTimer = initTimer + 1;
    if (this.controls.autoRotate && initTimer >= initTimerStop ) {
      this.controls.autoRotate = false;
    }
  
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(loop);
  }; loop();


 }
}
