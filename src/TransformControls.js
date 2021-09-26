import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import {
  FlyControls,
  Stars,
  Box,
  OrbitControls,
  TransformControls
} from "@react-three/drei";

function TransformControlsLockScene(props) {
  // const {
  //   transform, setTransform,
  //   mode,
  //   showX,
  //   showY,
  //   showZ
  // } = props;
  const [state, setState] = useState(props);
  console.log(state, props);
  // const [active, setActive] = useState(false)
  const orbitControls = useRef();
  const transformControls = useRef();

  // useEffect(() => {
  //   if (transformControls.current) {
  //     console.log('current')
  //     const { current: controls } = transformControls;
  //     const callback = event => {
  //       // orbitControls.current.enabled = !event.value;
  //       setPosition(transformControls.current.point)};
  //     controls.addEventListener("dragging-changed", callback);
  //     return () => controls.removeEventListener("dragging-changed", callback);
  //   }
  //
  // });

  useEffect(
    () => {
      setState({ ...state, active: props.active });
    },
    [props]
  );

  return (
    <TransformControls
      ref={transformControls}
      enabled={props.active === props.id ? true : false}
      showX={props.active === props.id ? true : false}
      showY={props.active === props.id ? true : false}
      showZ={props.active === props.id ? true : false}
    >
      <Box
        onClick={() => props.onClick(props.id)}
        onPointerOver={() => {
          console.log("active");
        }}
      >
        <meshBasicMaterial attach="material" wireframe />
      </Box>
    </TransformControls>
  );
}
// <OrbitControls ref={orbitControls} />

export default function App() {
  const [cubes, setCubes] = useState([]);
  const [transform1, setTransform1] = useState({ id: 1 });
  const [transform2, setTransform2] = useState({ id: 2 });
  const [active, setActive] = useState(null);

  const handleChange = id => {
    console.log("handleChange", id);
    setActive(id);

    // let newCubes = [...cubes];
    // const color = colors[getRandomInt(6)];
    // newCubes.push({
    //
    // });
    // setCubes([...newCubes]);
  };
  return (
    <Canvas>
      <TransformControlsLockScene
        {...transform1}
        position={[0, -4, 0]}
        active={active}
        onClick={handleChange}
      />
      <TransformControlsLockScene
        {...transform2}
        position={[-5, 0, 0]}
        active={active}
        onClick={handleChange}
      />
    </Canvas>
  );
}

// export default function TransformControlsStory() {
//   return (
//     <Canvas>
//     <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />
//       <Stars />
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 15, 10]} angle={0.3} />
//       <TransformControls>
//         <Box>
//           <meshBasicMaterial attach="material" wireframe />
//         </Box>
//       </TransformControls>
// </Canvas>
//   )
// }
