import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Item from './Item';

const Container = styled.div`
padding: 8px;
margin-bottom:8px;
background:white;
`;

export default React.memo(function ItemContainer(props) {

    return (
        // wrap the drag area, provided adds props and ref that react-beautiful-dnd needs

        <Draggable draggableId={props.item.id} index={props.index} >
            {provided => (
                <Container
                {...provided.draggableProps}
                ref={provided.innerRef}
                >
                    <Item item={props.item} provided={provided}/>
                </Container>
            )}
        </Draggable>
    );
});