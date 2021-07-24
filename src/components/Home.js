import React from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Page } from "./base/Page";

export class Home extends Page {
  constructor(props) {
    super(props);
  }

  // Runs after the first render() lifecycle
  componentDidMount() {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    let camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    //camera.rotation.y = (45 / 180) * Math.PI;
    camera.position.set(10, 0, 5);

    //let hlight = new THREE.AmbientLight(0x404040, 100);
    //scene.add(hlight);

    /*let directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    let light = new THREE.PointLight(0xc4c4c4, 10);
    light.position.set(0, 300, 500);
    scene.add(light);

    let light2 = new THREE.PointLight(0xc4c4c4, 10);
    light2.position.set(500, 100, 0);
    scene.add(light2);*/

    let light3 = new THREE.PointLight(0xc4c4c4, 10);
    light3.position.set(0, 100, -500);
    scene.add(light3);

    let light4 = new THREE.PointLight(0xc4c4c4, 10);
    light4.position.set(-500, 300, 500);
    scene.add(light4);

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(1100, 600);
    document.getElementById("scene").appendChild(renderer.domElement);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", refresh);

    //let pivot = new THREE.Group();
    //scene.add( pivot );

    let loader = new GLTFLoader();
    let mesh = null;
    loader.load("shiba/scene.gltf", gltf => {
      mesh = gltf.scene;
      mesh.scale.set(5, 5, 5);
      mesh.position.set(0, 0, 0);
      //pivot.add( mesh );

      const box = new THREE.Box3().setFromObject(mesh);
      const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      scene.add(boxHelper);
      let center = box.getCenter(new THREE.Vector3());
      let size = box.getSize(new THREE.Vector3());
      mesh.position.set(-center.x, size.y / 2 - center.y, -center.z);

      scene.add(mesh);
      animate();
    });

    refresh();

    function refresh() {
      renderer.render(scene, camera);
    }

    function animate() {
      if (mesh) {
        mesh.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }

  render() {
    return (
      <div className="page">
        <div id="scene"></div>
      </div>
    );
  }
}
