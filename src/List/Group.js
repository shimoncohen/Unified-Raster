import React from 'react';
import styled from 'styled-components';
import Item from './ItemContainer';
import { Droppable } from 'react-beautiful-dnd';
import {
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox, FormControlLabel,
    Typography
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';

const Container = styled.div`
margin:8px;
border: 1px solid lightgrey;
border-radius: 2px;
`;
const Title = styled.h3`
padding: 8px;
`;
const Items = styled.div`
padding: 8px;
`;

export default function Group(props) {
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
                    control={<Checkbox checked={true} />}
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
                        {props.items.map((item,index) => <Item key={item.id} item={item} index={index} />)}
                        {provided.placeholder}
                    </Items>
                )}
            </Droppable>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}