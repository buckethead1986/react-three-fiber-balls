import ReactDOM from "react-dom"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useLoader } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Controls, useControl } from "react-three-gui"
import { OrbitControls, TransformControls, StandardEffects } from "drei"
import "./styles.css"

// function Transformable({ active, children, orbitControls }) {
//   console.log(active)
//   const transformControls = useRef()

//   useEffect(() => {
//     if (transformControls.current) {
//       const controls = transformControls.current;
//       const callback = (event) =>
//         (orbitControls.current.enabled = !event.value);
//       controls.addEventListener("dragging-changed", callback);
//       return () => controls.removeEventListener("dragging-changed", callback);
//     }
//   });

//   if (!active) return children

//   return <TransformControls>{children}</TransformControls>

// }



function Keen(props) {
  const orbit = useRef()
  const transform = useRef()
  const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")
  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      controls.setMode(mode)
      const callback = event => (orbit.current.enabled = !event.value)
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })
  if (props.active === props.id) return <group onClick={props.onClick} position={props.position} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
    <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
  </group>
  return (
    <>
      <TransformControls ref={transform}>
        <group position={props.position} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
          <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} />
    </>
  )
  // return <Transformable active={props.active === props.id} children={<group onClick={props.onClick} position={props.position} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
  //   <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
  // </group>} orbitControls={<OrbitControls ref={orbit} />}/>
}

function Keen2(props) {
  // console.log(props)
  const [active, setActive] = useState(false)
  const activeRef = useRef()
  const orbit = useRef()
  const transform = useRef()
  const mode = useControl("mode", { type: "select", items: ["scale", "rotate", "translate"] })
  const { nodes, materials } = useLoader(GLTFLoader, "/scene.gltf")
  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      controls.setMode(mode)
      // const callback = event => (props.setActive(props.id))
      const callback = event => (orbit.current.enabled = !event.value)
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })
  useEffect(() => void (activeRef.current = active))
  if (props.active !== props.id) return <group onClick={(e) => {setActive(!e.value); props.setActive(props.id)}} position={props.position} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
    <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
  </group>
  return (
    <>
      <TransformControls ref={transform}>
        <group  position={props.position} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
          <mesh material={materials["Scene_-_Root"]} geometry={nodes.mesh_0.geometry} castShadow receiveShadow />
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} />
    </>
  )
}

function App() {
  const [active, setActive] = useState('keen-0')
  const [keens, setKeens] = useState([
    { id: 'keen-0',
    change: 'keen-1',
    test:test2,

    position: [0, -7, 0],
    setActive: setActive,
      onClick: (() => { console.log('keen-0'); setActive('keen-1') })},
    {
      id: 'keen-1',
      change: 'keen-0',
      test:test2,

      position: [-7, 0, 0],
      setActive: setActive,
      onClick: (() => { console.log('keen-1'); setActive('keen-0')})
    }
    ]);
    useEffect((prop) => {
      setActive(prop)
    });
  return (
    <>
      <Canvas shadowMap camera={{ position: [0, 0, 17], far: 50 }}>
        <ambientLight />
        <spotLight
          intensity={2}
          position={[40, 50, 50]}
          shadow-bias={-0.00005}
          penumbra={1}
          angle={Math.PI / 6}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <Suspense fallback={null} >
          {keens.map(props => <Keen2 active={active} {...props} />)}


          <StandardEffects />
        </Suspense>
      </Canvas>
      <Controls />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

  // < Keen onClick = {() => { console.log('keen-0'); setActive('keen-1') }} id = { 'keen-0'} active = { active } position = { [0, -7, 0]} />
    // <Keen onClick={() => { console.log('keen-1'); setActive('keen-0') }} id={'keen-1'} active={active} position={[-7, 0, 0]} />
