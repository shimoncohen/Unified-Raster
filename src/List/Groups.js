import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Group from './Group';
import { useSelector, useDispatch } from 'react-redux';


export default function Groups(props) {
    const dataFromStore = useSelector(state => state.data.data);
    const dispatch = useDispatch();
    const [data, setData] = useState(dataFromStore);

    useEffect(() => {
        setData(dataFromStore);
    }, [dataFromStore])

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }

        const groupStart = data.groups[source.droppableId];
        const groupFinisih = data.groups[destination.droppableId];
        let newData;

        if (groupStart === groupFinisih) {
            // same group
            const newItemsIds = [...groupStart.itemsIds];
            newItemsIds.splice(source.index, 1);
            newItemsIds.splice(destination.index, 0, draggableId);

            const newGroup = {
                ...groupStart,
                itemsIds: newItemsIds,
            }

            newData = {
                ...data,
                groups: {
                    ...data.groups,
                    [newGroup.id]: newGroup,
                }
            }
        }

        else {
            // Moving to another group
            const startItemsIds = Array.from(groupStart.itemsIds);
            startItemsIds.splice(source.index, 1);
            const newStart = {
                ...groupStart,
                itemsIds: startItemsIds,
            };

            const finishItemsIds = Array.from(groupFinisih.itemsIds);
            finishItemsIds.splice(destination.index, 0, draggableId);
            const newFinish = {
                ...groupFinisih,
                itemsIds: finishItemsIds,
            };

            newData = {
                ...data,
                groups: {
                    ...data.groups,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish,
                },
            };
        }

        setData(newData);
        dispatch({type:'updateStore',payload:newData});
    }

    return (
        <DragDropContext onDragEnd={onDragEnd} >
            {
                data.groupsOrder.map((groupId) => {
                    const group = data.groups[groupId];
                    const items = group.itemsIds.map(itemId => data.items[itemId]);

                    return <Group key={group.id} group={group} items={items} />;
                })
            }
        </DragDropContext >
    );
}