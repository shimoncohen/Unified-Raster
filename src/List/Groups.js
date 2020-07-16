import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Group from './Group';
import { useSelector, useDispatch } from 'react-redux';
import { getLayerByName, addLayersToMap, getHoverLayer, getLayerGroupByName } from '../Map/MapUtil';


export default React.memo(function Groups(props) {
    const dataFromStore = useSelector(state => state.data.data);
    const dispatch = useDispatch();
    const [data, setData] = useState(dataFromStore);

    useEffect(() => {
        setData(dataFromStore);
    }, [dataFromStore])

    const onDragEnd = result => {
        console.log(result);
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

        const groupLayerStart = getLayerGroupByName(props.map, source.droppableId).getLayers();
        const groupLayerStartLength = groupLayerStart.getLength();

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
            // TODO : check order of render
            // The layers render from the begin to end so we should reverse it.
            const layerChanged = groupLayerStart.removeAt(groupLayerStartLength - source.index - 1);
            groupLayerStart.insertAt(groupLayerStartLength - destination.index - 1, layerChanged);

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

            const groupLayerEnd = getLayerGroupByName(props.map, destination.droppableId).getLayers();
            const groupLayerEndLength = groupLayerEnd.getLength();

            const layerChanged = groupLayerStart.removeAt(groupLayerStartLength - source.index - 1);
            groupLayerEnd.insertAt(groupLayerEndLength - destination.index, layerChanged);

        }

        setData(newData);
        dispatch({ type: 'UPDATE_STORE', payload: newData });
    }

    return (
        data ?
            <DragDropContext onDragEnd={onDragEnd} >
                {
                    data.groupsOrder.map((groupId) => {
                        const group = data.groups[groupId];
                        //const items = group.itemsIds.map(itemId => data.items[itemId]);
                        const items = group.itemsIds;

                        return <Group key={group.id} group={group} items={items} />;
                    })
                }
            </DragDropContext >
            :
            'Choose project to start'
    );
});