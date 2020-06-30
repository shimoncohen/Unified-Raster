import Axios from 'axios';
import Config from './Config';

export async function GetProjects(){
    const projects = await Axios.get(Config.urlGetProjects); 
    return projects.data;
}