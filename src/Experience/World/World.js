import * as THREE from "three";
import Experience from "../Experience";
import Enviroment from "./Enviroment";
import Sea from "./Sea";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.water = new Sea();
      this.enviroment = new Enviroment();
    });
  }
  update() {
    if (this.water) this.water.update();
  }
}
