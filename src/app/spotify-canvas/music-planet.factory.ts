/* 
TODO: Once this has been worked out for relationships of sizes 
Refactor into sub component factory sections for reuseability
    */
import * as THREE from 'three';

import { ArtistPlanet } from './spotify-canvas.component';

export const musicPlanetFactory = (artist: ArtistPlanet, main: boolean, parent:{
 popularity: number, followers: number;
}, count?: number): any => {
    /* TODO: Define params for the method as an interface */

    const textureLoader = new THREE.TextureLoader();
    const textureCube = textureLoader.load(artist.image);
    const material = new THREE.MeshPhongMaterial( { map: textureCube } );
    let size = 2;

    /* 
    TODO: THIS IS AWFUL CODE - too many branches 
     - working out the maths for sizes of 
    artist plantes based on the relationship with the main
     */
    if( !main) {
        if( artist.popularity < parent.popularity) {
            const scaleDivide = parent.popularity/artist.popularity;
            size = 0.7-scaleDivide;
            size = size + 1; 
        } 

    } else {
        size = 1;
    }

    if( !main && size >=1) {
            size = 0.8;
    }

    if( !main && size <0) {
        size = 0.2;
}
    
    if(main) {
      material.emissiveIntensity = 1;
      material.shininess = 1;
    }

    const geometry = new THREE.BoxGeometry(size, size, size)
    let cube = new THREE.Mesh(geometry, material);
    cube.castShadow =true;

    let numberOf = 2;
    if( count ) {
        numberOf = numberOf + count;
    }

    const positionx = numberOf;

    if(!main) {
        let finalPos = positionx / 1.8;
        if ( finalPos > 5 ) {
            finalPos = positionx / 3;
        }
        cube.position.x = finalPos;        
    }

    return cube;
}