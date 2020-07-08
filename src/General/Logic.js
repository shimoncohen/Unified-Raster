import proj4 from 'proj4';

export function isGroupChecked(state) {
    state.data.groupsOrder.forEach(groupId => {
        const group = state.data.groups[groupId];
        let checked = true;
        checked = group.itemsIds.every(itemId =>
            state.data.items[itemId].checked
        );
        group.checked = checked;
    });
    return state;
}

// export function makeCoordinatesArrayFromString(s) {
//     let arr = [];
//     let splitS = s.split(',');
//     arr.push(parseInt(splitS[3]));
//     arr.push(parseInt(splitS[1]));
//     arr.push(parseInt(splitS[2]));
//     arr.push(parseInt(splitS[0]));
//     return arr;
// }

export function makeCoordinatesArrayFromString(s) {
        let arr = [];
        debugger;
        let splitS = s.split(',');
        const wgs = '+proj=longlat +datum=WGS84 +no_defs';
        const google = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=degree +nadgrids=@null +wktext  +no_defs';
        let leftCoordinate =  proj4(google,wgs,[parseInt(splitS[3]),parseInt(splitS[1])]);
        let rightCoordinate =  proj4(google,wgs,[parseInt(splitS[2]),parseInt(splitS[0])]);
        arr.push(leftCoordinate[0]);
        arr.push(leftCoordinate[1]);
        arr.push(rightCoordinate[0]);
        arr.push(rightCoordinate[1]);
        return arr;
    }