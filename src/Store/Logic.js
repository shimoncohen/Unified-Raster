export function isGroupChecked(state){
state.data.groupsOrder.map(groupId => {
    const group = state.data.groups[groupId];
    let checked = true;
    group.itemsIds.map(itemId => {
        if(!state.data.items[itemId].checked){
            checked=false;
            group.checked=checked;
            return state;
        }
    });
    group.checked=checked;
});
return state;
}