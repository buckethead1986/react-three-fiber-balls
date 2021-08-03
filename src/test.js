import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import "./styles.css";
import {
  OrbitControls,
  FlyControls,
  PointerLockControls,
  TransformControls,
  PerspectiveCamera,
  Stars
} from "@react-three/drei";

function Ball(props) {
  const { args = [0.2, 32, 32], color, position } = props;
  const [ref] = useSphere(() => ({
    args: 0.2,
    position: position,
    mass: 1
  }));
  // console.log(props.position, position);

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

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
    <TransformControls>
      <mesh ref={ref} castShadow>
        <dodecahedronBufferGeometry attach="geometry" />
        <meshNormalMaterial attach="material" />
      </mesh>
    </TransformControls>
  );
}

// function Main() {
//   const orbit = useRef()
//   const transform = useRef()
//   const { camera, gl } = useThree()
//   const [ref, mesh] = useResource()
//
//   useFrame(() => orbit.current.update())
//   useEffect(() => {
//     if (transform.current) {
//       const controls = transform.current
//       const callback = event => (orbit.current.enabled = !event.value)
//       controls.addEventListener('dragging-changed', callback)
//       return () => controls.removeEventListener('dragging-changed', callback)
//     }
//   })
//
//   return (
//     <>
//       <mesh ref={ref}>
//         <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
//         <meshNormalMaterial attach="material" />
//       </mesh>
//       <orbitControls ref={orbit} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.1} />
//       {mesh && <transformControls ref={transform} args={[camera, gl.domElement]} onUpdate={self => self.attach(mesh)} />}
//     </>
//   )
// }

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default function Test() {
  const [balls, setBalls] = useState([]);
  const colors = ["#173f5f", "#20639b", "#ff4f79", "#C44536", "#ed553b"];

  function handleCanvasClick(e) {
    // console.log("canvas click", e.clientX, e.clientY, e.point);
    let newBalls = [...balls];
    const color = colors[getRandomInt(6)];
    newBalls.push({
      color: color,
      position: [e.point.x, e.point.y, e.point.z]
    });
    setBalls([...newBalls]);
  }

  return (
    <Canvas>
      <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />
      <PointerLockControls />

      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane
          color="lightgreen"
          xRotation={-Math.PI / 2}
          onClick={e => handleCanvasClick(e)}
        />
        <Plane color="lightblue" onClick={e => handleCanvasClick(e)} />
        {balls.map(props => <Ball {...props} />)}

        <Dodecahedron />
      </Physics>
    </Canvas>
  );
}
