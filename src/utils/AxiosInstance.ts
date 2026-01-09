import axios from 'axios'


const AxiosInstance = axios.create({
    baseURL: 'https://api.flutterwave.com/v3/',
    timeout: 50000,
    withCredentials: true
})

export default AxiosInstance;
