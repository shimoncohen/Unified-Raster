import Axios from 'axios';
import Config from './Config';

export async function GetProjects(path){
    const serachPath = path ? '?path='+path : '';
    const projects = await Axios.get(Config.urlGetProjects + serachPath); 
    return projects.data;
}