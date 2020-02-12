import React from 'react';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel,
    Typography, Link
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';

export default React.memo(function Item(props) {

    const dispatch = useDispatch();

    const handleCheckboxClick = () => {
        dispatch({ type: 'checkClickOnItem', payload: { id: props.item.id } });
    }

    const handleSelectItem = e => {
        e.stopPropagation();
        dispatch({ type: 'selectItem', payload: { id: props.item.id } });
    }

    return (

        <ExpansionPanel style={{background:props.item.selected ? 'rgba(0, 158, 115,0.1)' : ''}}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-label="Expand"
                aria-controls="additional-item-content"
                id={props.item.id + '-expansion-panel-summary'}
            >
                <div>
                    <FormControlLabel
                        aria-label="item-details"
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        control={<Checkbox checked={props.item.checked} onClick={handleCheckboxClick} />}
                    // label={props.item.name}
                    />
                    <Link style={{color:'inherit',textDecoration:'none'}} onClick={handleSelectItem}>{props.item.name}</Link>
                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography color="textSecondary">
                    More details...
          </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>

    );
});
