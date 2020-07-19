import Axios from 'axios';
import Config from './Config';

export async function GetProjects(path){
    const serachPath = path ? '?path='+path : '';
    const projects = await Axios.get(Config.urlGetProjects + serachPath);
    return projects.data;
}

async function Search(rootPath, name) {
    const query = '?name=' + name;
    const results = await Axios.get(rootPath + query);
    return results.data;
}

export async function SearchProjects(name) {
    return await Search(Config.urlSearchProjects, name);
}

export async function SearchResources(name) {
    return await Search(Config.urlSearchResources, name);
}