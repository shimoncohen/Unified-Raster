export const initialData = {
    items: {
        'preview': {
            id: 'preview', pixelSize: 0.35, version: 3, name: 'preview',
            checked: true, selected: false, uri: 'http://localhost:3000/Rasters/preview.png',
            extent: [-180, -90, 180, 90]
        },
        'preview_1': {
            id: 'preview_1', pixelSize: 0.00002, version: 6, name: 'preview_1',
            checked: true, selected: false, uri: 'http://localhost:3000/Rasters/preview_1.png',
            extent: [-7.5507617, 49.7626698, -7.5359130, 49.7722828]
        },
        'preview_2': {
            id: 'preview_2', pixelSize: 0.00002, version: 5, name: 'preview_2',
            checked: false, selected: false, uri: 'http://localhost:3000/Rasters/preview_2.png',
            extent: [-7.5507617, 49.7626698, -7.5359130, 49.7722828]
        },
    },
    groups: {
        'group-1': {
            id: 'group-1',
            title: 'Group 1',
            checked: false,
            itemsIds: ['raster-1', 'raster-2', 'raster-3'],
        },
        'group-2': {
            id: 'group-2',
            title: 'Group 2',
            checked: true,
            itemsIds: ['raster-4'],
        },
    },
    groupsOrder: ['group-1', 'group-2']
};