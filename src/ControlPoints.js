import React, { useState, useCallback } from "react";
import "./styles.css";

import {
  Canvas,
  PointerEvent,
  ReactThreeFiber,
  useFrame
} from "react-three-fiber";
import styled from "styled-components";

import * as THREE from "three";
import * as R from "ramda";
// import { colors } from "./colors";

const StyledCanvas = styled(Canvas)`
  width: 100vw;
  height: 100vw;
  background-color: 'black';
`;

interface ScaledGridProps {
  size?: number;
  divisions?: number;
  scaledUnitSize?: number;
}

const useControlPoints = (
  Component: React.ComponentType<
    ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>
  >,
  initialControlPoints: THREE.Vector3[]
): [React.ComponentType, THREE.Vector3[]] => {
  const [controlPoints, setControlPoints] = useState(initialControlPoints);
  const [active, setActive] = useState<number | null>(null);

  const handleStart = useCallback((event: PointerEvent) => {
    event.stopPropagation();
    event.target.setPointerCapture(event.pointerId);
    setActive(event.object.userData.id);
  }, []);

  const handleMove = useCallback(
    (event: PointerEvent) => {
      const { id } = event.object.userData;
      if (active === id) {
        event.stopPropagation();
        setControlPoints(prev => [
          ...prev.slice(0, id),
          event.unprojectedPoint
            .setZ(0)
            .multiply(new THREE.Vector3(10 / 600, 10 / 600, 10 / 600)),
          ...prev.slice(id + 1)
        ]);
      }
    },
    [active]
  );

  const handleEnd = useCallback((event: PointerEvent) => {
    event.stopPropagation();
    event.target.releasePointerCapture(event.pointerId);
    setActive(null);
  }, []);

  const eventHandlers = {
    onPointerDown: handleStart,
    onPointerMove: handleMove,
    onPointerUp: handleEnd
  };

  const ControlPoints = () => (
    <>
      $
      {controlPoints.map((controlPoint, id) => (
        <Component
          {...eventHandlers}
          position={controlPoint}
          key={id}
          userData={{ id }}
        />
      ))}
    </>
  );

  return [ControlPoints, controlPoints];
};

interface ParabolicArcStringArtProps {
  controlPoints: THREE.Vector3[];
  resolution?: number;
}

const ParabolicArcStringArt: React.FC<ParabolicArcStringArtProps> = ({
  controlPoints,
  resolution = 16
}) => {
  const update = useCallback(self => (self.verticesNeedUpdate = true), [
    controlPoints
  ]);
  return (
    <>
      <line>
        <lineBasicMaterial
          color={new THREE.Color(colors.magenta[60])}
          attach="material"
        />
        <geometry
          vertices={controlPoints}
          attach="geometry"
          onUpdate={update}
        />
      </line>
    </>
  );
};

const ScaledGrid: React.FC<ScaledGridProps> = ({
  size = 600,
  divisions = 10,
  scaledUnitSize = size / divisions,
  children
}) => (
  <>
    <gridHelper
      rotation={new THREE.Euler(Math.PI / 2, 0, 0)}
      args={[
        size,
        divisions,
        new THREE.Color(colors.white[0]),
        new THREE.Color(colors.gray[90])
      ]}
    />
    <group
      scale={new THREE.Vector3(scaledUnitSize, scaledUnitSize, scaledUnitSize)}
    >
      {children}
    </group>
  </>
);

export default function App() {
  const [ControlPoints, controlPoints] = useControlPoints(
    props => (
      <mesh {...props}>
        <boxBufferGeometry attach="geometry" args={[0.2, 0.2, 0.05]} />
        <meshBasicMaterial
          attach="material"
          color={new THREE.Color(colors.magenta[50])}
        />
      </mesh>
    ),
    [
      new THREE.Vector3(-1, -2, 0),
      new THREE.Vector3(-1, 2, 0),
      new THREE.Vector3(2, 3, 0)
    ]
  );

  return (
    <StyledCanvas
      style={{ width: "600px", height: "600px" }}
      orthographic
      pixelRatio={window.devicePixelRatio}
    >
      <ScaledGrid>
        <ParabolicArcStringArt controlPoints={controlPoints} />
        <ControlPoints />
      </ScaledGrid>
    </StyledCanvas>
  );
}
