import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProjectSelector from "../Group/Selector/ProjectSelector";
import Groups from "../Group/Groups";
import { Drawer, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { SimpleButton, MapComponent } from "@terrestris/react-geo";
import { INITIALIZE_MAP } from "../../Store/Reducers/actionTypes";

import "ol/ol.css";
import "antd/dist/antd.css";
import "./react-geo.css";

function App() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const map = useSelector((state) => state.data.map);

  useEffect(() => {
    dispatch({ type: INITIALIZE_MAP });
  }, []);

  const toggleDrawer = function () {
    setVisible(!visible);
  };

  return (
    <div className="App">
      <MapComponent map={map} />

      <SimpleButton
        style={{ position: "fixed", top: "30px", right: "30px" }}
        onClick={toggleDrawer}
        icon="bars"
      />
      <Drawer
        anchor="right"
        onClose={toggleDrawer}
        open={visible}
        variant="persistent"
        classes={{
          paper: "paperDrawer",
        }}
      >
        <div>
          <IconButton onClick={toggleDrawer}>
            <Close />{" "}
          </IconButton>
        </div>
        <ProjectSelector />
        <Groups map={map} />
      </Drawer>
    </div>
  );
}

export default App;
