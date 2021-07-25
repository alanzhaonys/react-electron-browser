/**
 * MakerAL.com 2021
 **/

import React from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Page } from "./base/Page";

const path = require("path");

export class Lost extends Page {
  constructor(props) {
    super(props);
  }

  // Runs after the first render() lifecycle
  componentDidMount() {
    const env = process.env.NODE_ENV;
    const resourceDir = "resources";

    console.log("Env: " + env);
    console.log("URL: " + window.location.href);
    console.log("Resource dir: " + resourceDir);

    let canvasWidth;
    let canvasHeight;

    updateCanvasSize();

    let scene = new THREE.Scene();
    //scene.background = new THREE.Color("black");
    scene.background = new THREE.CubeTextureLoader()
      .setPath(path.join(resourceDir, "backgrounds", path.sep))
      .load([
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg",
        "matrix.jpg"
      ]);

    let camera = new THREE.PerspectiveCamera(
      100,
      canvasWidth / canvasHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    document.getElementById("scene").appendChild(renderer.domElement);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", refresh);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 5);
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

    let loader = new GLTFLoader();
    let mainMesh = null;
    console.log(
      "Main path: " + path.join(resourceDir, "gltf", "skull", "scene.gltf")
    );
    loader.load(path.join(resourceDir, "gltf", "skull", "scene.gltf"), gltf => {
      mainMesh = gltf.scene;
      mainMesh.name = "Main";
      mainMesh.userData.isContainer = true;
      mainMesh.scale.set(15, 15, 15);
      mainMesh.position.set(0, 0, 0);
      mainMesh.rotation.set(0, 0, 0);

      //const box = new THREE.Box3().setFromObject(mainMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //scene.add(boxHelper);

      scene.add(mainMesh);

      // On click call back
      mainMesh.callback = () => {
        console.log("Main clicked");
      };

      document.querySelector("#scene").style.display = "block";
      document.querySelector(".loading").style.display = "none";
    });

    // add 3D text beveled and sized
    const fontLoader = new THREE.FontLoader();
    console.log(
      "Font path: " +
        path.join(resourceDir, "fonts", "amble_regular.typeface.json")
    );
    fontLoader.load(
      path.join(resourceDir, "fonts", "amble_regular.typeface.json"),
      function(font) {
        let textGeo = new THREE.TextGeometry("ARE YOU LOST?", {
          font: font,
          size: 10,
          height: 0.5,
          curveSegments: 10,
          bevelThickness: 0.5,
          bevelSize: 0.5,
          bevelEnabled: true
        });

        let material = new THREE.MeshPhongMaterial({
          color: 0xff0000
        });

        let textMesh = new THREE.Mesh(textGeo, material);
        textMesh.name = "Text";
        textMesh.userData.isContainer = true;
        //textMesh.scale.set(0.5, 0.5, 0.5);

        textGeo.computeBoundingBox();
        const centerX =
          -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        // To center Y
        //const centerY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
        const centerY =
          -3 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

        textMesh.position.set(centerX, centerY, 0);
        textMesh.rotation.set(0, 0, 0);

        //const box = new THREE.Box3().setFromObject(textMesh);
        //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
        //scene.add(boxHelper);

        scene.add(textMesh);

        // On click call back
        textMesh.callback = () => {
          console.log("Text clicked");
        };

        animate();
      }
    );

    renderer.domElement.addEventListener("click", onMouseClick, false);
    renderer.domElement.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("resize", onWindowResize);

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let intersected = null;
    let mouseMoved = false;

    function updateMouse(event) {
      let canvasBounds = renderer.domElement.getBoundingClientRect();

      mouse.x =
        ((event.clientX - canvasBounds.left) /
          (canvasBounds.right - canvasBounds.left)) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - canvasBounds.top) /
          (canvasBounds.bottom - canvasBounds.top)
        ) *
          2 +
        1;
    }

    function onMouseClick(event) {
      updateMouse(event);

      raycaster.setFromCamera(mouse, camera);

      let intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        let object = intersects[0].object;

        // Walk up to get parent object
        while (!object.userData.isContainer) {
          object = object.parent;
        }
        // Trigger callback
        object.callback();
      }
    }

    function onMouseMove(event) {
      updateMouse(event);

      mouseMoved = true;
    }

    function updateCanvasSize() {
      canvasWidth = window.innerWidth;
      canvasHeight =
        window.innerHeight -
        document.getElementsByTagName("header")[0].clientHeight -
        document.getElementsByTagName("footer")[0].clientHeight;
      console.log("Canvas width: " + canvasWidth);
      console.log("Canvas height: " + canvasHeight);
    }

    function onWindowResize() {
      updateCanvasSize();
      camera.aspect = canvasWidth / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasWidth, canvasHeight);
    }

    function refresh() {
      renderer.render(scene, camera);
    }

    function animate() {
      // Rotate main mesh
      if (mainMesh) {
        mainMesh.rotation.y += 0.01;
      }

      if (mouseMoved) {
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          // A new intersect is found
          if (intersected != intersects[0].object) {
            if (intersected) {
              // Reset current intersect mesh color
              intersected.material.color.setHex(intersected.currentHex);
            }

            intersected = intersects[0].object;
            if (intersected.isMesh) {
              intersected.currentHex = intersected.material.color.getHex();
              intersected.material.color.setHex(0x00ff00);
              document.body.style.cursor = "pointer";
            }
          }
        } else {
          if (intersected) {
            // Reset current intersect mesh color
            intersected.material.color.setHex(intersected.currentHex);
          }
          intersected = null;
          document.body.style.cursor = "default";
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
  }

  render() {
    return (
      <div className="page lost">
        <div className="loading">
          <i className="fas fa-spin fa-sync" />
        </div>
        <div id="scene"></div>
      </div>
    );
  }
}
