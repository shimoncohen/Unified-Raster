import React from 'react';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel,
    Typography
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';

export default function Item(props) {

    const dispatch = useDispatch();

    const handleCheckboxClick = () => {
        dispatch({type:'checkClickOnItem',payload:{id:props.item.id}});
    }

    return (

        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-label="Expand"
                aria-controls="additional-item-content"
                id={props.item.id + '-expansion-panel-summary'}
            >
                <FormControlLabel
                    aria-label="item-details"
                    onClick={event => event.stopPropagation()}
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox checked={props.item.checked} onClick={handleCheckboxClick} />}
                    label={props.item.name}
                />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography color="textSecondary">
                    More details...
          </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>

    );
}
