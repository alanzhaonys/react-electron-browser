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
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //let hlight = new THREE.AmbientLight(0x404040, 100);
    //scene.add(hlight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    let light = new THREE.PointLight(0xc4c4c4, 1);
    light.position.set(0, 300, 500);
    scene.add(light);

    let light2 = new THREE.PointLight(0xc4c4c4, 1);
    light2.position.set(500, 100, 0);
    scene.add(light2);

    let light3 = new THREE.PointLight(0xc4c4c4, 1);
    light3.position.set(0, 100, -500);
    scene.add(light3);

    let light4 = new THREE.PointLight(0xc4c4c4, 1);
    light4.position.set(-500, 300, 500);
    scene.add(light4);

    /*
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);
    */

    /*
    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);
    */

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
    loader.load("skull/scene.gltf", gltf => {
      mesh = gltf.scene;
      mesh.scale.set(15, 15, 15);
      mesh.position.set(0, 0, 0);
      //pivot.add( mesh );

      //const box = new THREE.Box3().setFromObject(mesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //scene.add(boxHelper);

      //let center = box.getCenter(new THREE.Vector3());
      //let size = box.getSize(new THREE.Vector3());
      //mesh.position.set(-center.x, size.y / 2 - center.y, -center.z);
      mesh.position.set(0, 0, 0);

      scene.add(mesh);
      animate();
    });

    // add 3D text beveled and sized
    const fontLoader = new THREE.FontLoader();
    fontLoader.load("fonts/nobile_regular.typeface.json", function(font) {
      let textGeo = new THREE.TextGeometry("ARE YOU LOST?", {
        font: font,
        size: 13,
        height: 1,
        curveSegments: 5,
        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true
      });

      let material = new THREE.MeshPhongMaterial({
        color: "red"
      });

      let textMesh = new THREE.Mesh(textGeo, material);
      //textMesh.scale.set(0.5, 0.5, 0.5);

      textGeo.computeBoundingBox();
      const centerX =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      // Center Y
      //const centerY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
      const centerY =
        -2.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

      //let center = box.getCenter(new THREE.Vector3());
      //let size = box.getSize(new THREE.Vector3());
      //textMesh.position.set(-center.x, size.y / 2 - center.y, -center.z);

      textMesh.position.set(centerX, centerY, 0);

      textMesh.rotation.x = 0;
      textMesh.rotation.y = 0;
      textMesh.rotation.z = 0;

      //const box = new THREE.Box3().setFromObject(textMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //scene.add(boxHelper);

      scene.add(textMesh);
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
        <ul id="menu">
          <li>Menu 1</li>
          <li>Menu 2</li>
          <li>Menu 3</li>
        </ul>
      </div>
    );
  }
}
