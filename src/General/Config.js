const baseUrl = 'https://gee.covid-97.com';
const urlGetProjectByName = baseUrl + '/imagery/project/?name=';
const urlThumbnail = baseUrl + '/imagery/resource/image/?';
const urlGetProjects = baseUrl + '/imagery/projects/';

module.exports = {
    urlGetProjectByName,
    urlThumbnail,
    urlGetProjects
}