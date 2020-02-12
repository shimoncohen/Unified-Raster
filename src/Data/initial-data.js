export const initialData = {
    items: {
        'raster-1': { id: 'raster-1', type: 'Imagery', version: 3, name:'raster 1', checked: true },
        'raster-2': { id: 'raster-2', type: 'Imagery', version: 6, name:'raster 2', checked: true },
        'raster-3': { id: 'raster-3', type: 'Imagery', version: 5, name:'raster 3', checked: false },
        'raster-4': { id: 'raster-4', type: 'Imagery', version: 4, name:'raster 4', checked: true },
    },
    groups: {
        'group-1' : {
            id:'group-1',
            title:'Group 1',
            itemsIds: ['raster-1','raster-2','raster-3'],
        }, 
        'group-2' : {
            id:'group-2',
            title:'Group 2',
            itemsIds: ['raster-4'],
        }, 
    },
    groupsOrder: ['group-1','group-2']
};