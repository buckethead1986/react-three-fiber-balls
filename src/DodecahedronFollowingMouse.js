import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import "./styles.css";
import {
  OrbitControls,
  FlyControls,
  DeviceOrientationControls,
  PointerLockControls,
  TransformControls,
  PerspectiveCamera,
  Stars
} from "@react-three/drei";

function Plane(props) {
  const { color, xRotation = 0 } = props;
  const [ref] = usePlane(() => ({
    rotation: [xRotation, 0, 0],
    position: [0, -10, 0]
  }));
  return (
    <mesh ref={ref} onClick={props.onClick}>
      <planeBufferGeometry args={[100, 100]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
}

function Dodecahedron() {
  const { viewport } = useThree();
  // viewport = canvas in 3d units (meters)
  // const [hovered, setHovered] = useState(false);

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

export default function DodecahedronFollowingMouse() {
  // <OrbitControls/>
  return (
    <Canvas>
      <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />

      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane color="lightgreen" xRotation={-Math.PI / 2} />

        <Dodecahedron />
      </Physics>
    </Canvas>
  );
}
