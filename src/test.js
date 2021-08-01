import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import "./styles.css";
import {
  OrbitControls,
  FlyControls,
  PerspectiveCamera,
  Stars
} from "@react-three/drei";

function Plane(props) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0]
  }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
      <meshLambertMaterial attach="material" color={props.color} />
    </mesh>
  );
}

function Plane2(props) {
  const [ref] = usePlane(() => ({
    rotation: [0, 0, 0]
  }));
  return (
    <mesh
      ref={ref}
      onClick={e => console.log("clicked", e)}
      onPointerDown={() => console.log("pointerDown")}
    >
      >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshLambertMaterial attach="material" color={props.color} />
    </mesh>
  );
}

function Dodecahedron() {
  const { viewport } = useThree();
  // viewport = canvas in 3d units (meters)

  const ref = useRef();
  useFrame(({ mouse }) => {
    const x = mouse.x * viewport.width / 2;
    const y = mouse.y * viewport.height / 2;
    ref.current.position.set(x, y, 0);
    ref.current.rotation.set(-y, x, 0);
  });

  return (
    <mesh ref={ref} castShadow>
      <dodecahedronBufferGeometry attach="geometry" />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

export default function Test() {
  return (
    <Canvas>
      <FlyControls movementSpeed={5} rollSpeed={0.1} dragToLook={true} />
      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane color="lightgreen" />
        <Plane2 color="lightblue" />
        <Dodecahedron />
      </Physics>
    </Canvas>
  );
}
