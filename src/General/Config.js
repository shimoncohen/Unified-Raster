const baseUrl = "http://localhost:8000"; // 'https://gee.covid-97.com';
const urlGetProjectByName = baseUrl + "/imagery/project/?name=";
const urlThumbnail = baseUrl + "/imagery/resource/image/?";
const urlGetProjects = baseUrl + "/imagery/projects/";
const urlSearchProjects = baseUrl + "/imagery/project/search/";
const urlSearchResources = baseUrl + "/imagery/resource/search/";

module.exports = {
  urlGetProjectByName,
  urlThumbnail,
  urlGetProjects,
  urlSearchProjects,
  urlSearchResources,
};
