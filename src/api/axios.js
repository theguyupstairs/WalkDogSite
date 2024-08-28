import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:5023/bacoapi'
});