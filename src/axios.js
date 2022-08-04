import axios from "axios";
import { urlsConfig } from "./urlsConfig";


const instance = axios.create({
    baseURL: `${urlsConfig}/`,
})


instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});


export default instance;