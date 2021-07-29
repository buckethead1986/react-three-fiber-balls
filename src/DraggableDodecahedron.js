// import ReactDOM from "react-dom";
import * as CANNON from "cannon";
// import React, { useState } from "react";
// import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useDrag } from "react-use-gesture";
import * as THREE from "three";
import "./styles.css";
import { useCannon, Provider } from "./useCannon";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import {
  OrbitControls,
  FlyControls,
  PerspectiveCamera,
  Stars
} from "@react-three/drei";
// import useEventListener from "@use-it/event-listener";

function DraggableDodecahedron({ position: initialPosition }) {
  const { size, viewport } = useThree();
  const [position, setPosition] = useState(initialPosition);
  const [quaternion, setQuaternion] = useState([0, 0, 0, 0]);
  const aspect = size.width / viewport.width;

  // const { ref, body } = useCannon(
  //   { bodyProps: { mass: 100000 } },
  //   body => {
  //     body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
  //     body.position.set(...position);
  //   },
  //   []
  // );

  const [ref, body] = useBox(() => ({
    mass: 100000,
    position: { ...position }
  }));

  //----------
  // function Wall(props) {
  //   const { args = [5, 0.5, 1.5] } = props;
  //   const [ref, api] = useBox(() => ({ args }));
  //
  //   useFrame(() => {
  //     api.position.set(4, -2, 0); //x, y, z position on page
  //     api.rotation.set(0, 0, 1);
  //   });
  //
  //   return (
  //     <mesh ref={ref}>
  //       <boxBufferGeometry args={args} />
  //       <meshStandardMaterial color={"blue"} />
  //     </mesh>
  //   );
  // }
  //--------

  //
  // const bind = useDrag(
  //   ({ offset: [,], xy: [x, y], first, last }) => {
  //     if (first) {
  //       body.mass = 0;
  //       body.updateMassProperties();
  //     } else if (last) {
  //       body.mass = 10000;
  //       body.updateMassProperties();
  //     }
  //     body.position.set(
  //       (x - size.width / 2) / aspect,
  //       -(y - size.height / 2) / aspect,
  //       -0.7
  //     );
  //   },
  //   { pointerEvents: true }
  // );
  //
  useFrame(() => {
    // Sync cannon body position with three js
    const deltaX = Math.abs(body.position.x - position[0]);
    const deltaY = Math.abs(body.position.y - position[1]);
    const deltaZ = Math.abs(body.position.z - position[2]);
    if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
      setPosition(body.position.clone().toArray());
    }
    const bodyQuaternion = body.quaternion.toArray();
    const quaternionDelta = bodyQuaternion
      .map((n, idx) => Math.abs(n - quaternion[idx]))
      .reduce((acc, curr) => acc + curr);
    if (quaternionDelta > 0.01) {
      setQuaternion(body.quaternion.toArray());
    }
  });
  return (
    <mesh
      ref={ref}
      // castShadow
      position={position}
      quaternion={quaternion}
      // {...bind()}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <dodecahedronBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  );
}

// function DraggableDodecahedron() {
//   const colors = ["hotpink", "red", "blue", "green", "yellow"];
//   const ref = useRef();
//   const [colorIdx, setColorIdx] = useState(0);
//   const [position, setPosition] = useState([0, 0, 0]);
//   const { size, viewport } = useThree();
//   const aspect = size.width / viewport.width;
//   useFrame(() => {
//     ref.current.rotation.z += 0.01;
//     ref.current.rotation.x += 0.01;
//   });
//   // const bind = useDrag(
//   //   ({ offset: [x, y] }) => {
//   //     const [, , z] = position;
//   //     setPosition([x / aspect, -y / aspect, z]);
//   //   },
//   //   { pointerEvents: true }
//   // );
//
//   return (
//     <mesh
//       position={position}
//       ref={ref}
//       onClick={e => {
//         console.log(e);
//         if (colorIdx === 4) {
//           setColorIdx(0);
//         } else {
//           setColorIdx(colorIdx + 1);
//         }
//       }}
//       onPointerOver={e => console.log("hover")}
//       onPointerOut={e => console.log("unhover")}
//     >
//       <dodecahedronBufferGeometry attach="geometry" />
//       <meshLambertMaterial attach="material" color={colors[colorIdx]} />
//     </mesh>
//   );
// }

// function Plane() {
//   const [ref] = usePlane(() => ({
//     rotation: [-Math.PI / 2, 0, 0]
//   }));
//   return (
//     <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
//       <planeBufferGeometry attach="geometry" args={[100, 100]} />
//       <meshLambertMaterial attach="material" color="lightblue" />
//     </mesh>
//   );
// }

// function Plane({ position, onPlaneClick }) {
//   const { ref } = useCannon({ bodyProps: { mass: 0 } }, body => {
//     body.addShape(new CANNON.Plane());
//     body.position.set(...position);
//   });
//   return (
//     <mesh ref={ref} receiveShadow position={position} onClick={onPlaneClick}>
//       <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
//       <meshPhongMaterial attach="material" color="#272727" />
//     </mesh>
//   );
// }

function Objects({ objects, addObject }) {
  return <React.Fragment>{objects}</React.Fragment>;
}

const keyPressStart = {
  w: 0,
  s: 0,
  d: 0,
  a: 0
};

function App() {
  const [objects, setObjects] = useState([
    // <DraggableDodecahedron position={[0, 0, 0]} key={Math.random()} />
  ]);

  // const { mouse, camera } = useThree();
  const onPlaneClick = e => {
    console.log(e, "plane");
    //   var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    //   vector.unproject(camera);
    //   var dir = vector.sub(camera.position).normalize();
    //   var distance = -camera.position.z / dir.z;
    //   var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //   const position = [pos.x, pos.y, 2];
    //   setObjects([
    //     ...objects,
    //     <DraggableDodecahedron position={position} key={Math.random()} />
    //   ]);
  };

  const v = new THREE.Vector3();
  function OnPlaneClick() {
    return useFrame(state => {
      state.camera.position.lerp(
        v.set(
          Math.sin(state.mouse.x) * 5,
          4 + Math.atan(state.mouse.y) * 6,
          Math.cos(state.mouse.x) * 5
        ),
        0.1
      );
      state.camera.lookAt(0, 0, 0);
    });
  }

  // https://codepen.io/Fallenstedt/pen/QvKBQo

  const handleKeyDown = e => {
    // if (keyPressStart[e.key] === 0) {
    //   keyPressStart[e.key] = new Date().getTime();
    // }
    // const duration = new Date().getTime() - keyPressStart[e.key];
    // const momentum = Math.sqrt(duration + 200) * 0.01 + 0.1;
    // switch (e.key) {
    //   case "w":
    //     camera.translateY(momentum);
    //     break;
    //   case "s":
    //     camera.translateY(-momentum);
    //     break;
    //   case "d":
    //     camera.translateX(momentum);
    //     break;
    //   case "a":
    //     camera.translateX(-momentum);
    //     break;
    //   default:
    // }
  };

  const handleKeyUp = e => {
    // keyPressStart[e.key] = 0;
  };

  // useEventListener("keydown", handleKeyDown);
  // useEventListener("keyup", handleKeyUp);

  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 50]}
        angle={0.2}
        penumbra={1}
        castShadow
      />
      <Provider>
        <Objects objects={objects} />
        <Plane
          position={[0, 0, -2]}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPlaneClick={onPlaneClick}
        />
        <OnPlaneClick />
      </Provider>
    </Canvas>
  );
}

//--------
function Ground(props) {
  const { args = [10, 0.8, 1] } = props;
  const [ref, api] = useBox(() => ({ args }));

  useFrame(() => {
    api.position.set(0, -3.5, 0);
    api.rotation.set(0, 0, -0.08);
  });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <meshStandardMaterial color={"green"} />
    </mesh>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [0, 0, 0], ...props }));
  return (
    <mesh
      ref={ref}
      rotation={[0, 0, 0]}
      onClick={e => console.log(props, props.onClick)}
      // onClick={e => console.log("plane function")}
    >
      <planeBufferGeometry args={[100, 100]} />
      <meshLambertMaterial attach="material" color={props.color} />
    </mesh>
  );
}

// function OnPlaneClick(e) {
//   console.log(e, "plane clicked");
//   const v = new THREE.Vector3();
//   return useFrame(state => {
//     state.camera.position.lerp(
//       v.set(
//         Math.sin(state.mouse.x) * 5,
//         4 + Math.atan(state.mouse.y) * 6,
//         Math.cos(state.mouse.x) * 5
//       ),
//       0.1
//     );
//     state.camera.lookAt(0, 0, 0);
//   });
// }

export default function App2() {
  const [objects, setObjects] = useState([
    // <DraggableDodecahedron position={[0, 0, 0]} key={Math.random()} />
  ]);
  // useFrame(state => {
  //   console.log(state.mouse.x);
  // });

  return (
    <mesh>
      <Canvas>
        <FlyControls movementSpeed={5} rollSpeed={0.1} dragToLook={true} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Physics
          gravity={[0, -26, 0]}
          defaultContactMaterial={{ restitution: 0.6 }}
        >
          <Plane onClick={console.log("plane")} color={"lightblue"} />
          <Ground />
        </Physics>
      </Canvas>
    </mesh>
  );
}
//-----------

// function createCanvas() {
//   return (
//     <Canvas
//       onCreated={({ gl }) => {
//         gl.shadowMap.enabled = true;
//         gl.shadowMap.type = THREE.PCFSoftShadowMap;
//       }}
//     >
//       <App />
//     </Canvas>
//   );
// }

// ReactDOM.render(createCanvas(), document.getElementById("root"));
