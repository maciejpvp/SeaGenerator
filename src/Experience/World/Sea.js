import * as THREE from "three";

import Experience from "../Experience";

export default class Sea {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.resources = this.experience.resources;
    this.waterVertexShader = this.resources.items.vertexShader;
    this.waterFragmentShader = this.resources.items.fragmentShader;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Water");
    }

    this.waterColors = {
      depthColor: "#00004d",
      surfaceColor: "#00357a",
    };

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }
  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10, 64, 64);
  }
  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.waterVertexShader,
      fragmentShader: this.waterFragmentShader,
      side: THREE.DoubleSide,
      fog: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["fog"],
        {
          uTime: { value: 0 },

          uBigWavesElevation: { value: 0.138 },
          uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
          uOffsetSpeed: { value: 1 },

          uSmallWavesElevation: { value: 0.15 },
          uSmallWavesFrequency: { value: 3 },
          uSmallWavesSpeed: { value: 0.2 },
          uSmallInterations: { value: 4 },

          uDepthColor: { value: new THREE.Color(this.waterColors.depthColor) },
          uSurfaceColor: {
            value: new THREE.Color(this.waterColors.surfaceColor),
          },
          uColorOffset: { value: 0.308 },
          uColorMultiplier: { value: 2.15 },
        },
      ]),
    });
    if (this.debug.active) {
      this.setWavesDebug();
    }
  }

  setWavesDebug() {
    this.bigWavesFolder = this.debugFolder.addFolder("Big Waves");
    this.bigWavesFolder
      .add(this.material.uniforms.uBigWavesElevation, "value")
      .min(0)
      .max(1)
      .name("uBigWavesElevation");
    this.bigWavesFolder
      .add(this.material.uniforms.uBigWavesFrequency.value, "x")
      .min(0)
      .max(15)
      .name("uBigWavesFrequencyX");
    this.bigWavesFolder
      .add(this.material.uniforms.uBigWavesFrequency.value, "y")
      .min(0)
      .max(15)
      .name("uBigWavesFrequencyZ");
    this.bigWavesFolder
      .add(this.material.uniforms.uOffsetSpeed, "value")
      .min(0)
      .max(5)
      .name("uOffsetSpeed");

    this.smallWavesFolder = this.debugFolder.addFolder("Small Waves");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallInterations, "value")
      .min(0)
      .max(10)
      .step(1)
      .name("uSmallInterations");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesElevation, "value")
      .min(0)
      .max(1)
      .name("uSmallWavesElevation");

    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesFrequency, "value")
      .min(0)
      .max(5)
      .name("uSmallWavesFrequency");

    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(1)
      .name("uSmallWavesSpeed");

    this.waterColor = this.debugFolder.addFolder("Water Color");
    this.waterColor
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .name("uColorOffset");
    this.waterColor
      .add(this.material.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .name("uColorMultiplier");
    this.waterColor.addColor(this.waterColors, "depthColor").onChange(() => {
      this.material.uniforms.uDepthColor.value.set(this.waterColors.depthColor);
    });
    this.waterColor.addColor(this.waterColors, "surfaceColor").onChange(() => {
      this.material.uniforms.uSurfaceColor.value.set(
        this.waterColors.surfaceColor
      );
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.mesh);
  }
  update() {
    this.material.uniforms.uTime.value = this.time.elapsed;
  }
}
