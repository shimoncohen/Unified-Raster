import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack'
import { Done, PhotoLibrary, Photo, Save } from '@material-ui/icons/'
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { GetProjects } from '../General/Requests';
import {
    List, ListItem, ListItemIcon, ListItemText,
    IconButton, Dialog, Button
} from '@material-ui/core/';

import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


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
    const lastProjectName = useSelector(state => state.project.projectName);

    const renderTree = (nodes) => (
        <TreeItem key={nodes.path} nodeId={nodes.path} label={nodes.path.substring(nodes.path.lastIndexOf('/') + 1)} onClick={() => { getProjectsFromServer(nodes.path); }}>
            {Array.isArray(nodes.projects) ? renderItems(nodes.path, nodes.projects) : null}
            {Array.isArray(nodes.directories) ? nodes.directories.map((node) => renderTree({
                'path': nodes.path + '/' + node,
                'directories': projects[nodes.path + '/' + node] ? projects[nodes.path + '/' + node].directories : null,
                'projects': projects[nodes.path + '/' + node] ? projects[nodes.path + '/' + node].projects : null
            })) : null}
        </TreeItem>
    );

    const renderItems = (path, items) => {
        return (
            items.map((item) => <TreeItem selected={projectName === path + '/' + item} key={path + '/' + item} nodeId={path + '/' + item} label={item} onClick={() => handleClickOnList(path + '/' + item)}>
            </TreeItem>)
        )
    }

    const getProjectsFromServer = async (path) => {
        // Get projects from the server.
        try {
            debugger;
            if (path && projects[path]) {
                return;
            }
            const res = await GetProjects(path);
            if (!path) {
                let newProjects = { '/': res };
                setProjects(newProjects);
            }
            else {
                let newProjects = { ...projects };
                newProjects[path] = res;
                setProjects(newProjects);
            }
        }

        catch{
            enqueueSnackbar('There is a problem in our server, please try again later', { variant: 'error' });
        }
    }

    useEffect(() => {
        getProjectsFromServer();
    }, [])

    useEffect(() => {
        console.log(projects);
    }, [projects])

    const toggleDialog = () => {
        setOpen(!open);
    }

    const handleClickOnList = project => {
        setProjectName(project);
    }

    const handleSaveChanges = () => {
        dispatch({ type: 'CHANGE_PROJECT', payload: { projectName } });
        toggleDialog();
    }

    return (
        <div>
            <Tooltip title='Select Project'>
                <IconButton
                    onClick={() => toggleDialog()}>
                    <PhotoLibrary />
                </IconButton>
            </Tooltip>
            <Dialog
                keepMounted
                open={open}
                onClose={() => toggleDialog()}
                fullWidth={true}
                maxWidth='sm'
            >
                {projects &&
                    <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        selected={projectName}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {renderTree(projects['/'])}
                    </TreeView>
                }
                {
                    lastProjectName !== projectName &&
                    <Tooltip title='Reload new project'>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            onClick={() => handleSaveChanges()}>
                            Save changes
                        </Button>
                    </Tooltip>
                }
            </Dialog>
        </div >
    );
}