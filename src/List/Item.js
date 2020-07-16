import React, { useState, useEffect } from 'react';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel,
    Typography, Link, Avatar, IconButton
} from '@material-ui/core/';
import { ExpandMore, Settings, ZoomIn } from '@material-ui/icons/';
import { useSelector, useDispatch } from 'react-redux';
import OpacitySlider from './OpacitySlider';
import SettingsTabs from '../Tabs/SettingsTabs';

const itemStyle = {
    
    width: '100%',
}

const avatarStyle = {
    display: 'inline-table',
    marginRight: '5px',
    marginLeft: '-10px',
}

export default React.memo(function Item(props) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const itemDetails = useSelector(state => state.data.data.items[props.item]);
    const [item, setItem] = useState(null);

    useEffect(() => {
        setItem(itemDetails);
    }, [itemDetails])

    const handleCheckboxClick = () => {
        dispatch({ type: 'TOOGLE_ITEM', payload: { id: item.name } });
    }

    const handleSelectItem = e => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_ITEM', payload: { id: item.name } });
    }

    const handleOpenDialog = () => {
        setOpen(true);
    }

    const handleCloseDialog = () => {
        setOpen(false);
    }


    const handleZoomToLayer = () => {
        dispatch({ type: 'ZOOM_TO_LAYER', payload: { id: item.name } });
    }

    return (
        <div>
        { item ?
        <div>
        <ExpansionPanel TransitionProps={{ unmountOnExit: true }} style={{ background: item.selected ? 'rgba(0, 158, 115,0.1)' : '' }}>
            <ExpansionPanelSummary
                style={{ textAlign: 'left' }}
                {...props.provided.dragHandleProps}
                expandIcon={<ExpandMore />}
                aria-label="Expand"
                aria-controls="additional-item-content"
                id={item.name + '-expansion-panel-summary'}
            >

                <div style={itemStyle}>
                    <FormControlLabel
                        aria-label="item-details"
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        control={<Checkbox checked={item.checked} onClick={handleCheckboxClick} />}
                    // label={props.item.name}
                    />
                    <Avatar style={avatarStyle} variant="square" src={item.uri} />
                    <Link className='rasterName' onClick={handleSelectItem}>{item.name}</Link>

                </div>

            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <IconButton onClick={e => { handleOpenDialog(); }}><Settings /></IconButton>
                <IconButton onClick={e => { handleZoomToLayer(); }}><ZoomIn /></IconButton>
                <OpacitySlider item={item} />

            </ExpansionPanelDetails>
        </ExpansionPanel>
        <SettingsTabs itemId={item.name} item={item} src={item.uri} extent={item.extent} open={open} close={handleCloseDialog} />
        </div>
    :
    <div
    {...props.provided.dragHandleProps}
    ></div>
    
    }
            </div>
);
});
