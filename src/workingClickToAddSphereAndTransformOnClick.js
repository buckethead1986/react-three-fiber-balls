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
  const [state, setState] = useState(props);
  // console.log(state, props);
  const { args = [0.2, 32, 32], color, position } = props;
  // const [hovered, setHovered] = useState(false);
  // const [position, setPosition] = useState(props.position);
  // const [ref] = useSphere(() => ({
  //   args: 0.2,
  //   position: position
  // }));

  const orbit = useRef();
  const transform = useRef();

  useEffect(
    () => {
      setState({ ...state, active: props.active });
    },
    [props]
  );
  // const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  // const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")

  //orbit.current.enabled = !event.value;
  // useEffect(e => {
  //   if (ref.current) {
  //     const controls = ref.current;
  //     // controls.setMode(mode)
  //
  //     const callback = event => {
  //       console.log(`a=${ref.current}`, ref.current, `d=${!event.value}`);
  //       setPosition([
  //         ref.current.pointEnd.x,
  //         ref.current.pointEnd.y,
  //         ref.current.pointEnd.z
  //       ]);
  //     };
  //     controls.addEventListener("dragging-changed", callback);
  //     return () => controls.removeEventListener("dragging-changed", callback);
  //   }
  // });
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
    <TransformControls
      ref={transform}
      position={position}
      enabled={props.active === props.id ? true : false}
      showX={props.active === props.id ? true : false}
      showY={props.active === props.id ? true : false}
      showZ={props.active === props.id ? true : false}
    >
      <mesh
        key={props.id}
        castShadow
        receiveShadow
        onClick={e => {
          props.setActive(props.id);
          e.stopPropagation();
        }}
      >
        <sphereBufferGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    </TransformControls>
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
      <meshLambertMaterial
        attach="material"
        color={color}
        transparent={true}
        opacity={props.opacity}
      />
    </mesh>
  );
}

function Box(props) {
  const { color } = props;
  const [ref] = useBox(() => ({
    position: props.position
  }));

  return (
    <mesh ref={ref} onClick={props.onClick} position={props.position}>
      <boxBufferGeometry args={props.args} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
}

function SimpleBox(props) {
  return (
    <mesh
      onClick={props.onClick}
      position={props.position}
      rotation={[Math.PI / 3, 0, 0]}
    >
      <boxGeometry args={props.args} />
      <meshBasicMaterial color={props.color} />
    </mesh>
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default function Test() {
  const [balls, setBalls] = useState([]);
  const [active, setActive] = useState("");
  const [counter, setCounter] = useState(0);
  const [camera, setCamera] = useState(true);
  const colors = ["#173f5f", "#20639b", "#ff4f79", "#C44536", "#ed553b"];

  // function updateBall(ballId, newPosition) {
  //   console.log(ballId, newPosition)
  //   // let newBalls = Object.assign({}, balls)
  //   // newBalls[ballId].position = newPosition
  //   // setBalls(newBalls)
  // }

  // function handleCanvasClick(e) {
  //   if(camera) {
  //   let ballId = `ball-${Object.keys(balls).length}`
  //   let newBalls = Object.assign({}, balls)
  //   const color = colors[getRandomInt(6)];
  //   newBalls[ballId] = {
  //     ballId: ballId,
  //     updateBall: updateBall,
  //     color: color,
  //     setCamera: setCamera,
  //     position: [e.point.x, e.point.y, e.point.z]
  //   }
  //   setBalls(newBalls);
  //   // console.log(newBalls, balls)
  // }
  // }

  function handleCanvasClick(e) {
    // console.log(
    //   // e,
    //   e.clientX,
    //   e.clientY,
    //   e.target.offsetLeft,
    //   e.target.offsetTop,
    //   e.target.clientWidth,
    //   e.target.clientHeight
    // );
    let mouseX =
      (e.clientX - e.target.offsetLeft) / e.target.clientWidth * 2 - 1;
    let mouseY =
      -((e.clientY - e.target.offsetTop) / e.target.clientHeight) * 2 + 1;
    // console.log(e.point, mouseX, mouseY, counter);
    if (active === "") {
      let newBalls = [...balls];
      const color = colors[getRandomInt(6)];
      newBalls.push({
        id: `ball-${counter}`,
        color: color,
        position: [e.point.x, e.point.y, e.point.z]
      });
      setBalls([...newBalls]);
      setCounter(counter + 1);
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function undoLastBall() {
    let tempBalls = [...balls];
    let ballToUndo = tempBalls.pop();
    if (ballToUndo.id === active) {
      setActive("");
    }
    setBalls([...tempBalls]);
  }

  function deleteActiveBall() {
    let tempBalls = [...balls];
    tempBalls.forEach((ball, index) => {
      if (ball.id === active) {
        tempBalls.splice(index, 1);
      }
    });
    setActive("");
    setBalls([...tempBalls]);
  }

  // {camera && (
  //   <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />
  // )}
  return (
    <Canvas>
      <OrbitControls enabled={active === "" ? true : false} />

      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane
          color="lightgreen"
          opacity={0.5}
          onClick={e => {
            handleCanvasClick(e);
            e.stopPropagation();
          }}
        />
        <Box
          id={"undoBox"}
          color={"green"}
          args={[1, 4]}
          position={[4, 4, 0]}
          onClick={e => {
            balls.length > 0 && undoLastBall();
            e.stopPropagation();
          }}
        />
        <SimpleBox
          id={"deleteActiveBox"}
          color={"red"}
          args={[2, 1]}
          position={[-2, 2, 0]}
          onClick={e => {
            deleteActiveBall();
            e.stopPropagation();
          }}
        />

        {balls.map(props => (
          <Ball active={active} setActive={setActive} {...props} />
        ))}
      </Physics>
    </Canvas>
  );
}
