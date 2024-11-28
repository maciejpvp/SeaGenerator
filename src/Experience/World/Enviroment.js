import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.scene.background = new THREE.Color(0x87ceeb);
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Environment");
    }

    this.setFog();
    // this.setSunLight();
    // this.setEnvironmentMap();
  }

  setFog() {
    this.scene.fog = new THREE.Fog(0x87ceeb, 5, 30);
    if (this.debug.active) {
      this.debugFolder
        .addColor({ fogColor: this.scene.fog.color }, "fogColor")
        .onChange((value) => {
          this.scene.fog.color.set(value);
          this.scene.background.set(value);
        });
      this.debugFolder
        .add({ fogNear: this.scene.fog.near }, "fogNear")
        .min(1)
        .max(10)
        .onChange((value) => {
          this.scene.fog.near = value;
        });
      this.debugFolder
        .add({ fogFar: this.scene.fog.far }, "fogFar")
        .min(1)
        .max(30)
        .onChange((value) => {
          this.scene.fog.far = value;
        });
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    this.debugFolder
      .add(this.sunLight, "intensity")
      .min(0)
      .max(5)
      .step(0.001)
      .name("Sun Intensity");

    this.debugFolder
      .add(this.sunLight.position, "x")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun X");

    this.debugFolder
      .add(this.sunLight.position, "y")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun Y");

    this.debugFolder
      .add(this.sunLight.position, "z")
      .min(-10)
      .max(10)
      .step(0.001)
      .name("Sun Z");
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .min(0)
        .max(5)
        .step(0.001)
        .name("EnvMap Intensity")
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
