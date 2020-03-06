import React from 'react';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel,
    Typography, Link, Avatar, IconButton
} from '@material-ui/core/';
import { ExpandMore, Crop } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';
import OpacitySlider from './OpacitySlider';

const itemStyle = {
    whiteSpace: 'nowrap',
    overflow: 'auto',
    width: '200px',
}

const avatarStyle = {
    display: 'inline-table',
    marginRight: '10px',
}

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

        <ExpansionPanel TransitionProps={{ unmountOnExit: true }} style={{ background: props.item.selected ? 'rgba(0, 158, 115,0.1)' : '' }}>
            <ExpansionPanelSummary
                style={{ textAlign: 'left' }}
                {...props.provided.dragHandleProps}
                expandIcon={<ExpandMore />}
                aria-label="Expand"
                aria-controls="additional-item-content"
                id={props.item.id + '-expansion-panel-summary'}
            >

                <div style={itemStyle}>
                    <FormControlLabel
                        aria-label="item-details"
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        control={<Checkbox checked={props.item.checked} onClick={handleCheckboxClick} />}
                    // label={props.item.name}
                    />
                    <Avatar style={avatarStyle} variant="square" src={props.item.uri} />
                    <Link className='rasterName' onClick={handleSelectItem}>{props.item.name}</Link>
                    
                </div>

            </ExpansionPanelSummary>
            <IconButton><Crop/></IconButton>
            <ExpansionPanelDetails>
                <OpacitySlider item={props.item} />
            </ExpansionPanelDetails>
        </ExpansionPanel>

    );
});
