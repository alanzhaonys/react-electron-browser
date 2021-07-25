import React from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Page } from "./base/Page";

const path = require("path");

/**
 * Todo:
 * reset pos
 * stop/result animate
 * loading spinner
 * mouse pointer issue
 * about
 * body label
 */

export class Home extends Page {
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

    // https://redstapler.co/threejs-realistic-light-shadow-tutorial/
    let scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

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
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    document.getElementById("scene").appendChild(renderer.domElement);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", refresh);

    let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 5);
    scene.add(hemiLight);

    let spotLight = new THREE.SpotLight(0xffa95c, 4);
    spotLight.position.set(-50, 50, 50);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024 * 4;
    spotLight.shadow.mapSize.height = 1024 * 4;
    scene.add(spotLight);

    let loader = new GLTFLoader();
    let mainMesh = null;
    console.log(
      "Main path: " + path.join(resourceDir, "gltf", "body", "scene.gltf")
    );
    loader.load(path.join(resourceDir, "gltf", "body", "scene.gltf"), gltf => {
      mainMesh = gltf.scene;
      mainMesh.name = "Main";
      mainMesh.userData.isContainer = true;
      mainMesh.scale.set(2, 2, 2);
      mainMesh.position.set(0, 0, 0);
      mainMesh.rotation.set(0, 0, 0);

      let labelCount = 0;

      mainMesh.traverse(n => {
        if (n.isMesh) {
          // Lighting
          n.castShadow = true;
          n.receiveShadow = true;
          if (n.material.map) {
            n.material.map.anisotropy = 16;
          }

          // Custom data, assign a label
          n.userData.label = "part-" + ++labelCount;

          n.callback = () => {
            console.log(n.userData.label);
          };
        }
      });

      console.log("Total parts: " + labelCount);

      //const box = new THREE.Box3().setFromObject(mainMesh);
      //const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      //scene.add(boxHelper);

      scene.add(mainMesh);

      // On click call back
      mainMesh.callback = () => {
        console.log("Main clicked");
      };

      animate();

      // After main mesh is loaded
      setupKeyControls();
    });

    renderer.domElement.addEventListener("click", onMouseClick, false);
    renderer.domElement.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("resize", onWindowResize);

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let intersected = null;
    let mouseMoved = false;

    function setupKeyControls() {
      var mesh = scene.getObjectByName("Main");
      if (mesh) {
        console.log("Mesh is found");
        document.onkeydown = event => {
          switch (event.keyCode) {
            case 37:
              mesh.rotation.x += 0.1;
              break;
            case 38:
              mesh.rotation.z -= 0.1;
              break;
            case 39:
              mesh.rotation.x -= 0.1;
              break;
            case 40:
              mesh.rotation.z += 0.1;
              break;
          }
        };
      } else {
        console.log("Mesh not found");
      }
    }

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

        // Walk up to get parent object (if you want to only trigger callback for parent
        //while (!object.userData.isContainer) {
        //object = object.parent;
        //}

        // Trigger callback
        if (object.callback) {
          object.callback();
        }
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

      // Rotate spot light
      if (spotLight) {
        spotLight.position.set(
          camera.position.x + 10,
          camera.position.y + 10,
          camera.position.z + 10
        );
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
              // Remove box helper
              if (intersected.boxHelper) {
                scene.remove(intersected.boxHelper);
              }
              // Hide annotation
              hideAnnotation(intersected.userData.label);
            }

            intersected = intersects[0].object;
            if (intersected.isMesh) {
              intersected.currentHex = intersected.material.color.getHex();
              intersected.material.color.setHex(0x00ff00);
              document.body.style.cursor = "pointer";

              // Show box helper
              /*const box = new THREE.Box3().setFromObject(intersected);
              const boxHelper = new THREE.Box3Helper(box, 0xffff00);
              scene.add(boxHelper);
              intersected.boxHelper = boxHelper;
              */

              // Create annotation
              const canvas = renderer.domElement;
              const vector = new THREE.Vector3(250, 250, 250);
              //const vector = intersects[0].point;
              vector.project(camera);
              vector.x = Math.round(
                (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
              );
              vector.y = Math.round(
                (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
              );
              // Show annotation
              showAnnotation(intersected.userData.label, vector);
            }
          }
        } else {
          if (intersected) {
            // Reset current intersect mesh color
            intersected.material.color.setHex(intersected.currentHex);
            // Remove box helper
            if (intersected.boxHelper) {
              scene.remove(intersected.boxHelper);
            }
            // Hide annotation
            hideAnnotation(intersected.userData.label);
          }
          intersected = null;
          document.body.style.cursor = "default";
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function showAnnotation(partName, vector) {
      const annotation = document.querySelector("#" + partName);
      if (annotation) {
        console.log("Annotation found for " + partName);

        // Invalid
        annotation.style.topx = `${vector.y}px`;
        annotation.style.leftx = `${vector.x}px`;

        annotation.style.opacity = 1;
        annotation.style.visibility = "visible";
      } else {
        console.log("Annotation not found for " + partName);
      }
    }

    function hideAnnotation(partName) {
      const annotation = document.querySelector("#" + partName);
      if (annotation) {
        annotation.style.opacity = 0;
        annotation.style.visibility = "hidden";
      }
    }
  }

  render() {
    return (
      <div className="page">
        <div id="scene"></div>
        <div className="part" id="part-1">
          Part 1
        </div>
        <div className="part" id="part-2">
          Part 2
        </div>
        <div className="part" id="part-3">
          Part 3
        </div>
        <div className="part" id="part-4">
          Part 4
        </div>
        <div className="part" id="part-5">
          Part 5
        </div>
        <div className="part" id="part-6">
          Part 6
        </div>
        <div className="part" id="part-7">
          Part 7
        </div>
        <div className="part" id="part-8">
          Part 8
        </div>
        <div className="part" id="part-9">
          Part 9
        </div>
        <div className="part" id="part-10">
          Part 10
        </div>
        <div className="part" id="part-11">
          Part 11
        </div>
        <div className="part" id="part-12">
          Part 12
        </div>
        <div className="part" id="part-13">
          Part 13
        </div>
        <div className="part" id="part-14">
          Part 14
        </div>
        <div className="part" id="part-15">
          Part 15
        </div>
        <div className="part" id="part-16">
          Part 16
        </div>
      </div>
    );
  }
}
