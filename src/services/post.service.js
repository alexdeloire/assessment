import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

class PostDataService {
  getAll(params) {
    return axios.get(API_URL + "/posts", { params });
  }

  fetchCategories() {
    return axios.get(API_URL + "/categories");
  }

}

export default new PostDataService();