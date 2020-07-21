import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    List, ListItem, ListItemIcon, ListItemText,
    IconButton, Button, TextField
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { SearchProjects, SearchResources } from '../../General/Requests';

const useStyles = makeStyles({
    root: {
        height: 500,
        flexGrow: 1,
    },
});

export default function Search(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Wanted model for searching (resource / project)
    const model = props.model;
    // Set search function by given model
    const searchFunction = model === 'resource' ? SearchResources : SearchProjects;

    useEffect(() => {
        console.log('in');
    }, [searchResults]);

    //Search for every keystroke the user inserts
    // useEffect(() => {
    //     // Set to no results if empty search
    //     if(searchText === '') {
    //         setSearchResults([]);
    //         return;
    //     }

    //     search(searchText);
    // }, [searchText]);

    const search = async () => {
        try {
            const results = await searchFunction(searchText);
            setSearchResults(results[model + 's']);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <TextField onChange={(event) => setSearchText(event.target.value)}></TextField>
            <Button onClick={search}>
                Click me!
            </Button>
            {searchResults && <List>
                {searchResults.map((path, index) =>
                    <ListItem button key={index} onClick={()=>props.handleSelect(path)}>
                        <ListItemText>{path}</ListItemText>
                    </ListItem>
                )}
            </List>}
        </div>
    )
}