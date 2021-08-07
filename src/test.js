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
  const { args = [0.2, 32, 32], color, position } = props;
  const [hovered, setHovered] = useState(false);
  const [ref] = useSphere(() => ({
    args: 0.2,
    position: position,
    mass: 1
  }));

  // return (
  //   <mesh
  //     ref={ref}
  //     onClick={e => {
  //       setHovered(true);
  //       e.stopPropagation();
  //     }}
  //     onPointerMissed={() => setHovered(false)}
  //   >
  //     {hovered ? (
  //       <TransformControls>
          // <sphereBufferGeometry args={args} />
          // <meshStandardMaterial color={color} />
  //       </TransformControls>
  //     ) : (
  //       <mesh>
  //         <sphereBufferGeometry args={args} />
  //         <meshStandardMaterial color={color} />
  //       </mesh>
  //     )}
  //   </mesh>
  // );

  const orbit = useRef()
  const transform = useRef()
  // const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  // const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")
  useEffect(() => {
    if (ref.current) {
      const controls = ref.current
      // controls.setMode(mode)
      const callback = event => {console.log(`a=${ref.current}`, event,  `c=${orbit.current.enabled}`, `d=${!event.value}`); orbit.current.enabled = !event.value; event.stopPropagation()}
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  }, console.log('after'))
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
  return (
    <
    >
      {hovered ? (
        <>
          <TransformControls ref={ref} position={position} onClick={e => {setHovered(false);
          console.log('second');
          e.stopPropagation()}}>

              <mesh castShadow receiveShadow >
              <sphereBufferGeometry args={args} />
              <meshStandardMaterial color={color} />
              </mesh>


          </TransformControls>
          <OrbitControls ref={orbit}/>
        </>
      ) : (
        <mesh ref={ref} onClick={e => {
          setHovered(true);
          console.log('propagation');
          e.stopPropagation();
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

// function Plane2(props) {
//   const [ref] = usePlane(() => ({
//     rotation: [0, 0, 0]
//   }));
//   return (
//     <mesh
//       ref={ref}
//       onClick={e => console.log("clicked", e)}
//       onPointerDown={() => console.log("pointerDown")}
//     >
//       >
//       <planeBufferGeometry attach="geometry" args={[100, 100]} />
//       <meshLambertMaterial attach="material" color={props.color} />
//     </mesh>
//   );
// }



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

  // <OrbitControls/>
  return (
    <Canvas>

      <OrbitControls
        enablePan

      />

      <Stars />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} />
      <Physics>
        <Plane
          color="lightgreen"
          xRotation={-Math.PI / 2}
          onClick={e => {handleCanvasClick(e); e.stopPropagation()}}
        />
        <Plane color="lightblue" />
        {balls.map(props => <Ball {...props} />)}


      </Physics>
    </Canvas>
  );
}
