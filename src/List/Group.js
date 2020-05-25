import React, { useState, useEffect } from 'react';
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
        props.items.map((item, index) => <Item key={item.id} item={item} index={index} />)
    );
});

export default React.memo(function Group(props) {
    const [expanded, setExpanded] = useState(false);
    const [items, setItems] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const handleCheckboxClick = () => {
        dispatch({ type: 'checkClickOnGroup', payload: { id: props.group.id } });
    }

    useEffect(() => {
        if(props.items.length<10){
            setHasMore(false);
            setItems(props.items)
        }
        else{
            setHasMore(true);
            setItems(props.items.slice(0,11))
        }
        
    }, [props.items])

    const loadMore = () => {
        if(items.length<props.items.length && hasMore){
            const newItems =  props.items.length > items.length +10 ?  props.items.slice(0,(items.length+10)) : props.items;
             setItems(newItems);
        }
        else{
            setHasMore(false);
        }
    }
    
    const handleScroll = e => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
             loadMore(); 
            }
    }

    return (
        <ExpansionPanel onClick={() => setExpanded(true)}>
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
            <ExpansionPanelDetails onScroll={ e => {handleScroll(e); } }>
                {expanded &&
                    <Droppable droppableId={props.group.id}>
                        {provided => (
                            <Items
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                               
                                    <InnerList items={items} />
                              

                                {provided.placeholder}
                            </Items>
                        )}
                    </Droppable>
                }
                
            </ExpansionPanelDetails>
           
        </ExpansionPanel>
    );
});