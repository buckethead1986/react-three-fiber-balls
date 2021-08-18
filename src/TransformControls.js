import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
// import { withKnobs, optionsKnob, boolean } from '@storybook/addon-knobs'
// import { TransformControls as TransformControlsImpl } from 'three-stdlib'

// import { Setup } from '../Setup'

import {
  FlyControls,
  Stars,
  Box,
  OrbitControls,
  TransformControls
} from "@react-three/drei";

// export default function TransformControlsStory() {
//   return (
//     <Canvas>
//     <FlyControls movementSpeed={10} rollSpeed={0.1} dragToLook={true} />
//
//
//       <Stars />
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 15, 10]} angle={0.3} />
//
//       <TransformControls>
//         <Box>
//           <meshBasicMaterial attach="material" wireframe />
//         </Box>
//       </TransformControls>
//
// </Canvas>
//   )
// }

// TransformControlsStory.storyName = 'Default'
//
// export default {
//   title: 'Controls/TransformControls',
//   component: TransformControls,
// }

function TransformControlsLockScene({
  transform, setTransform,
  mode,
  showX,
  showY,
  showZ
}) {
  const [position, setPosition] = useState([])
  const [active, setActive] = useState(false)
  const orbitControls = useRef();
  const transformControls = useRef();

  useEffect(() => {
    if (transformControls.current) {
      console.log('current')
      const { current: controls } = transformControls;
      const callback = event => {
        // orbitControls.current.enabled = !event.value;
        setPosition(transformControls.current.point)};
      controls.addEventListener("dragging-changed", callback);
      return () => controls.removeEventListener("dragging-changed", callback);
    }

  });

  return (
    <>
    {active ? (
      <TransformControls
      position={transform}
        ref={transformControls}
        mode={mode}
        showX={showX}
        showY={showY}
        showZ={showZ}

      >
        <Box>
          <meshBasicMaterial attach="material" wireframe />
        </Box>
      </TransformControls>
  ) : (<Box onPointerOver={setActive(true)}>
    <meshBasicMaterial attach="material" wireframe />
  </Box>)}
  </>
  );
}
// <OrbitControls ref={orbitControls} />

export default function App() {
  const [transform1, setTransform1] = useState([0,-5, 0])
  const [transform2, setTransform2] = useState([-5,0, 0])
  return (
  <Canvas>
  <TransformControlsLockScene transform={transform1} setTransform={setTransform1}/>
  <TransformControlsLockScene transform={transform2} setTransform={setTransform2}/>
  </Canvas>
)
}

// export const TransformControlsLockSt = () => {
//   const modesObj = {
//     scale: 'scale',
//     rotate: 'rotate',
//     translate: 'translate',
//   }
//
//   return (
//     <TransformControlsLockScene
//       mode={optionsKnob('mode', modesObj, 'translate', {
//         display: 'radio',
//       })}
//       showX={boolean('showX', true)}
//       showY={boolean('showY', true)}
//       showZ={boolean('showZ', true)}
//     />
//   )
// }

// TransformControlsLockSt.storyName = 'Lock orbit controls while transforming'
// TransformControlsLockSt.decorators = [withKnobs, (storyFn) => <Setup controls={false}>{storyFn()}</Setup>]
