import * as THREE from "three";
import ReactDOM from "react-dom";
import React, {
  Fragment,
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo
} from "react";
import { Canvas, useThree } from "react-three-fiber";
// import { OrbitControls } from "@react-three/drei/OrbitControls";
import { OrbitControls, Stars } from "@react-three/drei";
import "./styles.css";

function useHover() {
  const [hovered, setHover] = useState(false);
  const hover = useCallback(e => (e.stopPropagation(), setHover(true)), []);
  const unhover = useCallback(e => setHover(false), []);
  return [{ onPointerOver: hover, onPointerOut: unhover }, hovered];
}

function useDrag(onDrag, onEnd) {
  const [active, setActive] = useState(false);
  const [, toggle] = useContext(camContext);
  const activeRef = useRef();
  const down = useCallback(
    e => (
      setActive(true),
      toggle(false),
      e.stopPropagation(),
      e.target.setPointerCapture(e.pointerId)
    ),
    [toggle]
  );
  const up = useCallback(
    e => (
      setActive(false),
      toggle(true),
      e.target.releasePointerCapture(e.pointerId),
      onEnd && onEnd()
    ),
    [onEnd, toggle]
  );
  const move = useCallback(
    event =>
      activeRef.current &&
      (event.stopPropagation(), onDrag(event.unprojectedPoint)),
    [onDrag]
  );
  useEffect(() => void (activeRef.current = active));
  return { onPointerDown: down, onPointerUp: up, onPointerMove: move };
}

function EndPoint({ position, onDrag, onEnd }) {
  let [bindHover, hovered] = useHover();
  let bindDrag = useDrag(onDrag, onEnd);
  return (
    <mesh position={position} {...bindDrag} {...bindHover}>
      <sphereBufferGeometry args={[7.5, 16, 16]} />
      <meshBasicMaterial color={hovered ? "hotpink" : "white"} />
    </mesh>
  );
}

function Line({ defaultStart, defaultEnd }) {
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const vertices = useMemo(
    () => [start, end].map(v => new THREE.Vector3(...v)),
    [start, end]
  );
  const update = useCallback(self => {
    self.verticesNeedUpdate = true;
    self.computeBoundingSphere();
  }, []);
  return (
    <Fragment>
      <line>
        <geometry vertices={vertices} onUpdate={update} />
        <lineBasicMaterial color="white" />
      </line>
      <EndPoint position={start} onDrag={v => setStart(v.toArray())} />
      <EndPoint position={end} onDrag={v => setEnd(v.toArray())} />
    </Fragment>
  );
}

const camContext = React.createContext();
function Controls({ children }) {
  const { gl, camera } = useThree();
  const api = useState(true);
  return (
    <Fragment>
      <OrbitControls
        args={[camera, gl.domElement]}
        enableDamping
        enabled={api[0]}
      />
      <camContext.Provider value={api}>{children}</camContext.Provider>
    </Fragment>
  );
}

function Test3() {
  return (
    <Canvas invalidateFrameloop orthographic camera={{ position: [0, 0, 500] }}>
      <Controls>
        <Line defaultStart={[-100, -100, 0]} defaultEnd={[0, 100, 0]} />
        <Line defaultStart={[0, 100, 0]} defaultEnd={[100, -100, 0]} />
      </Controls>
    </Canvas>
  );
}

export default { Test3 };
// ReactDOM.render(<App />, document.getElementById("root"));
