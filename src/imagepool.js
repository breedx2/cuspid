'use strict';
const _ = require('lodash');
const QuadsBuilder = require('./quads-builder');
import { URLS1, URLS2 } from './default-urls';

class ImagePool {

  constructor(sets) {
    if(sets.length != 10){
      throw new Error("Must have 10 sets in the pool.");
    }
    this.sets = sets;
    this.current = 0;
  }

  static async buildWithDefaults() {
    console.log('Building ImagePool with default sets...');
    const quadSet1 = await QuadsBuilder.load(URLS1);
    console.log(`Loaded ${quadSet1.length} quads in set 1`);

    const quadSet2 = await QuadsBuilder.load(URLS2);
		console.log(`Loaded ${quadSet2.length} quads in set 2`);

    const sets = [
      quadSet1, quadSet2, null, null, null,
      null, null, null, null, null
    ];
    return new ImagePool(sets);
  }

  setCurrent(n) {
    this.current = n;
  }

  // assigns a set of quads at an index.
  // current stays the same
  setQuads(n, quads) {
    this.sets[n] = quads;
  }

  getQuads(n){
    return this.sets[n];
  }

  getImages(n){
    return this.sets[n].map(quad => quad.material.uniforms['texture'].value.image);
  }

  currentQuads() {
    return this.getQuads(this.current);
  }

}

export { ImagePool };
