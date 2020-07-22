import { makeCoordinatesArrayFromString } from '../General/Logic';
import Config from '../General/Config';

export function addToGroups(groups, resource) {
    if (!groups['level-' + resource.level]) {
        groups['level-' + resource.level] = {
            id: 'level-' + resource.level,
            title: 'Level ' + resource.level,
            checked: true,
            level: resource.level,
            itemsIds: [resource.name]
        };
    }
    else {
        groups[resource.level].itemIds.push(resource.name);
    }
}

export function prepareResourceForDIsplay(resource) {
    resource.uri = Config.urlThumbnail +
                    'name=' + resource.name + 
                    '&version=' + resource.version;
    resource.checked = true;
    resource.selected = false;
    resource.extent = makeCoordinatesArrayFromString(resource.extent);
}