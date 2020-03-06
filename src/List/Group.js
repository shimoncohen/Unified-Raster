import React from 'react';
import styled from 'styled-components';
import Item from './ItemContainer';
import { Droppable } from 'react-beautiful-dnd';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';

const Items = styled.div` padding: 8px;
max-height:500px; 
overflow:auto; `;
const InnerList = React.memo(function list(props) {
    return (
        props.items.map((item, index) => <Item key={item.id} item={item} index={index} /> )
    );
});

export default React.memo(function Group(props) {
    const dispatch = useDispatch();
    const handleCheckboxClick = () => {
        dispatch({ type: 'checkClickOnGroup', payload: { id: props.group.id } });
    }

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-label="Expand"
                aria-controls="group-content"
                id={props.group.id + '-expansion-panel-summary'}
            >
                <FormControlLabel
                    aria-label="group-details"
                    onClick={event => event.stopPropagation()}
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox checked={props.group.checked} onClick={handleCheckboxClick} />}
                    label={props.group.title}
                />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Droppable droppableId={props.group.id}>
                    {provided => (
                        <Items
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <InnerList items={props.items} />
                            {provided.placeholder}
                        </Items>
                    )}
                </Droppable>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
});