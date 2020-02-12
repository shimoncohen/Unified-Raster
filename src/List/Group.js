import React from 'react';
import styled from 'styled-components';
import Item from './ItemContainer';
import { Droppable } from 'react-beautiful-dnd';

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
        <Container>
            <Title>{props.group.title}</Title>
            {/* wrap the drop area, provided adds props and ref that react-beautiful-dnd needs */}
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
        </Container>
    );
}