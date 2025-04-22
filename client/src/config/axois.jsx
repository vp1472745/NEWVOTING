// create axois.js file:
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4500/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default axiosInstance;