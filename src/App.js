import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useSphere, useBox } from "@react-three/cannon";

function Ball(props) {
  const { args = [0.2, 32, 32], color, position } = props;
  const [ref] = useSphere(() => ({
    args: 0.2,
    // position: [position[0] / 100, position[1] / 100, position[2]],
    position: position,
    mass: 1
  }));
  // console.log(props.position);

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Sphere(props) {
  const [ref, api] = useSphere(() => ({
    args: [2, 16, 16]
  }));
  useFrame(({ mouse }) => {
    api.position.set(mouse.x, mouse.y, 0);
  });
  // console.log(props.position);
  return (
    <mesh ref={ref}>
      <sphereGeometry attach="geometry" args={[props.radius, 32, 32]} />
      <meshLambertMaterial attach="material" color={props.color} />
    </mesh>
  );
}

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

function Wall(props) {
  const { args = [5, 0.5, 1.5] } = props;
  const [ref, api] = useBox(() => ({ args }));

  useFrame(() => {
    api.position.set(4, -2, 0); //x, y, z position on page
    api.rotation.set(0, 0, 1);
  });

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
}

export default function App() {
  const [balls, setBalls] = useState([]);
  const colors = ["#173f5f", "#20639b", "#ff4f79", "#C44536", "#ed553b"];
  return (
    <mesh onClick={e => onCanvasClicked(e)}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Physics
          gravity={[0, -26, 0]}
          defaultContactMaterial={{ restitution: 0.6 }}
        >
          {balls.map(props => <Ball {...props} />)}
          <Ground />
          <Wall />
          <Ball position={[-5, 0, 0]} />
        </Physics>
      </Canvas>
    </mesh>
  );
  function onCanvasClicked(e) {
    console.log(
      e.clientX,
      e.clientY,
      e.target.offsetLeft,
      e.target.offsetTop,
      e.target.clientWidth,
      e.target.clientHeight
    );
    let mouseX =
      (e.clientX - e.target.offsetLeft) / e.target.clientWidth * 2 - 1;
    let mouseY =
      -((e.clientY - e.target.offsetTop) / e.target.clientHeight) * 2 + 1;
    console.log(mouseX, mouseY);
    let newBalls = [...balls];
    const color = colors[getRandomInt(6)];
    newBalls.push({ color: color, position: [mouseX, mouseY, 0] });
    setBalls([...newBalls]);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
