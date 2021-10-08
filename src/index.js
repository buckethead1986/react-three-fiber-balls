import ReactDOM from "react-dom";
import React from "react";
import "./styles.css";
import App from "./App";
// import DragableShape from "./DraggableDodecahedron";
// import HoverCubes from "./HoverCubes";
// import CreateShapeOnClick from "./CreateShapeOnClick";
import WorkingClickToAddSphereAndTransformOnClick from "./workingClickToAddSphereAndTransformOnClick";
// import CreateBallsAndTransformOnClick from "./CreateBallsAndTransformOnClick";
// import DodecahedronFollowingMouse from "./DodecahedronFollowingMouse";
import TransformControls from "./TransformControls";

ReactDOM.render(
  <WorkingClickToAddSphereAndTransformOnClick />,
  document.getElementById("root")
);
