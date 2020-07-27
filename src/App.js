import React, { useEffect, useState } from "react";
import "./App.css";
import Map from "./Map/Map";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Config from "./General/Config";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const projectName = useSelector((state) => state.project.projectName);
  const getDataFromServer = async () => {
    // Get layers from the server and update store.
    try {
      const res = await Axios.get(Config.urlGetProjectByName + projectName);
      dispatch({ type: "INIT_STORE", payload: res.data.latest.resources });
    } catch {
      enqueueSnackbar(
        "There is a problem in our server, please try again later",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (projectName) {
      getDataFromServer();
      setLoading(true);
    }
  }, [projectName]);

  return (
    <>
      <Map />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}

export default App;
