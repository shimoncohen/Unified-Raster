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


export default function ProjectSelector(props) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [projectName, setProjectName] = useState(null);
    const [projects, setProjects] = useState(null);
    const lastProjectName = useSelector(state => state.project.projectName);
    const getProjectsFromServer = async () => {
        // Get projects from the server.
        try {
            const res = await GetProjects();
            setProjects(res.projects);
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
                open={open}
                onClose={() => toggleDialog()}
                fullWidth={true}
                maxWidth='sm'
            >
                <List>
                    {
                        (projects &&
                            projects.map((project, index) => (
                                <ListItem key={index}
                                    button
                                    selected={projectName === project}
                                    onClick={() => handleClickOnList(project)}
                                >
                                    <ListItemIcon>
                                        <Photo />
                                    </ListItemIcon>
                                    <ListItemText primary={project} />
                                </ListItem>
                            ))
                        )
                    }
                </List>
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