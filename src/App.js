import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useSphere, useBox } from "@react-three/cannon";

function Ball(props) {
  const { args = [0.2, 32, 32], color } = props;
  const [ref] = useSphere(() => ({
    args: 0.2,
    mass: 1
  }));

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={args} />
      <meshStandardMaterial color={color} />
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

export default function App() {
  const [balls, setBalls] = useState([]);
  const colors = ["#173f5f", "#20639b", "#ff4f79", "#C44536", "#ed553b"];
  return (
    <Canvas>
      <mesh onClick={e => onCanvasClicked(e)}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Physics
          gravity={[0, -26, 0]}
          defaultContactMaterial={{ restitution: 0.6 }}
        >
          {balls.map(props => <Ball {...props} />)}
          <Ground />
        </Physics>
      </mesh>
    </Canvas>
  );
  function onCanvasClicked(e) {
    let newBalls = [...balls];
    const color = colors[getRandomInt(6)];
    newBalls.push({ color: color });
    setBalls([...newBalls]);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
