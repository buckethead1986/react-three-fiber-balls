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

function Ball(props) {
  const { args = [0.2, 32, 32], color } = props;
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState(props.position)
  const [ref] = useSphere(() => ({
    args: 0.2,
    position: position
  }));



  const orbit = useRef()
  const transform = useRef()
  // const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  // const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")

  //orbit.current.enabled = !event.value;
  useEffect((e) => {
    if (ref.current) {
      const controls = ref.current
      // controls.setMode(mode)

      const callback = event => {console.log(`a=${ref.current}`, ref.current, `d=${!event.value}`); setPosition([ref.current.pointEnd.x, ref.current.pointEnd.y, ref.current.pointEnd.z]);
    }
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })
  // return (
  //   <>
  //     <TransformControls ref={transform} position={position}>
  //
  //         <mesh castShadow receiveShadow >
  //         <sphereBufferGeometry args={args} />
  //         <meshStandardMaterial color={color} />
  //         </mesh>
  //
  //
  //     </TransformControls>
  //     <OrbitControls ref={orbit}/>
  //   </>
  // )


//-----------
//separate out box logic into a separate component
//send onClick ref up to parent component, and base camera/flycontrols/etc off whether or not youre transforming something.
// <OrbitControls ref={orbit}/>
// onPointerMissed={e => {e.stopPropagation();console.log('missed', e);setHovered(false);props.setCamera(true)}}>
  return (
    <
    >
      {hovered ? (
        <>
          <TransformControls ref={ref} position={position}
           onPointerUp={e => console.log(e.point,'pointer up')}
         onClick={e => {console.log(e, 'second');

          e.stopPropagation()}}
          onUpdate={(self) => {console.log(self.position); props.updateBall(props.ballId, self.position)}}
>
              <mesh castShadow receiveShadow >
              <sphereBufferGeometry args={args} />
              <meshStandardMaterial color={color} />
              </mesh>


          </TransformControls>
        </>
      ) : (
        <mesh ref={ref} onClick={e => {
          e.stopPropagation();

          setPosition(e.point);
          props.setCamera(false);
          console.log('propagation', e.point);
          setHovered(true)
        }}>
          <sphereBufferGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
    </>
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





function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default function Test() {
  const [balls, setBalls] = useState({});
  const [camera, setCamera] = useState(true)
  const colors = ["#173f5f", "#20639b", "#ff4f79", "#C44536", "#ed553b"];

function updateBall(ballId, newPosition) {
  console.log(ballId, newPosition)
  // let newBalls = Object.assign({}, balls)
  // newBalls[ballId].position = newPosition
  // setBalls(newBalls)
}

  function handleCanvasClick(e) {
    if(camera) {
    let ballId = `ball-${Object.keys(balls).length}`
    let newBalls = Object.assign({}, balls)
    const color = colors[getRandomInt(6)];
    newBalls[ballId] = {
      ballId: ballId,
      updateBall: updateBall,
      color: color,
      setCamera: setCamera,
      position: [e.point.x, e.point.y, e.point.z]
    }
    setBalls(newBalls);
    // console.log(newBalls, balls)
  }
  }

  // <OrbitControls/>
  return (
    <Canvas>
{camera && <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />
      }

      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane
          color="lightgreen"
          onClick={e => {console.log(e); handleCanvasClick(e); e.stopPropagation()}}
        />


        {Object.keys(balls).map(function(key, index) {
        return  <Ball {...balls[key]} />
        })}

      </Physics>
    </Canvas>
  );
}
