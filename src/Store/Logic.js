export function isGroupChecked(state){
state.data.groupsOrder.map(groupId => {
    const group = state.data.groups[groupId];
    let checked = true;
    checked = !group.itemsIds.some(itemId => 
        !state.data.items[itemId].checked
    );
    group.checked=checked;
});
return state;
}
