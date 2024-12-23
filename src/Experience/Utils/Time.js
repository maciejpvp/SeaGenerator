import EventEmitter from "./EventEmitter";
import * as THREE from "three";

export default class Time extends EventEmitter {
  constructor() {
    super();
    this.clock = new THREE.Clock();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    this.elapsed = this.clock.getElapsedTime();
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
