import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { PhotoLibrary, Save } from "@material-ui/icons/";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { GetProjects } from "../General/Requests";
import { IconButton, Dialog, Button } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import pathUtil from "path";

const useStyles = makeStyles({
  root: {
    height: 500,
    flexGrow: 1,
  },
});

export default function ProjectSelector(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [projects, setProjects] = useState(null);
  const lastProjectName = useSelector((state) => state.project.projectName);

  const renderTree = function (nodes) {
    return (
      <TreeItem
        key={nodes.path}
        nodeId={nodes.path}
        label={nodes.path.substring(nodes.path.lastIndexOf("/") + 1)}
        onClick={() => {
          getProjectsFromServer(nodes.path);
        }}
      >
        {Array.isArray(nodes.projects)
          ? renderItems(nodes.path, nodes.projects)
          : null}
        {Array.isArray(nodes.directories)
          ? nodes.directories.map((node) =>
              renderTree({
                path: pathUtil.join(nodes.path, node),
                directories: projects[pathUtil.join(nodes.path, node)]
                  ? projects[pathUtil.join(nodes.path, node)].directories
                  : null,
                projects: projects[pathUtil.join(nodes.path, node)]
                  ? projects[pathUtil.join(nodes.path, node)].projects
                  : null,
              })
            )
          : null}
      </TreeItem>
    );
  };

  const renderItems = function (path, items) {
    return items.map((item) => (
      <TreeItem
        selected={projectName === pathUtil.join(path, item)}
        key={pathUtil.join(path, item)}
        nodeId={pathUtil.join(path, item)}
        label={item}
        onClick={() => handleClickOnList(pathUtil.join(path, item))}
      ></TreeItem>
    ));
  };

  const getProjectsFromServer = async function (path) {
    // Get projects from the server.
    try {
      if (path && projects[path]) {
        return;
      }
      const res = await GetProjects(path);
      if (!path) {
        let newProjects = { "/": res };
        setProjects(newProjects);
      } else {
        let newProjects = { ...projects };
        newProjects[path] = res;
        setProjects(newProjects);
      }
    } catch {
      enqueueSnackbar(
        "There is a problem in our server, please try again later",
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    getProjectsFromServer();
  }, []);

  useEffect(() => {}, [projects]);

  const toggleDialog = function () {
    setOpen(!open);
  };

  const handleClickOnList = function (project) {
    setProjectName(project);
  };

  const handleSaveChanges = function () {
    dispatch({ type: "CHANGE_PROJECT", payload: { projectName } });
    toggleDialog();
  };

  return (
    <div>
      <Tooltip title="Select Project">
        <IconButton onClick={() => toggleDialog()}>
          <PhotoLibrary />
        </IconButton>
      </Tooltip>
      <Dialog
        keepMounted
        open={open}
        onClose={() => toggleDialog()}
        fullWidth={true}
        maxWidth="sm"
      >
        {projects && (
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            selected={projectName}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            {renderTree(projects["/"])}
          </TreeView>
        )}
        {lastProjectName !== projectName && (
          <Tooltip title="Reload new project">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
              onClick={() => handleSaveChanges()}
            >
              Save changes
            </Button>
          </Tooltip>
        )}
      </Dialog>
    </div>
  );
}
