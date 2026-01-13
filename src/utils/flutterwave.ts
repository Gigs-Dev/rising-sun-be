import axios from 'axios'
import { FLW_SECRET_KEY } from '../config/env.config';


const flutterwave = axios.create({
    baseURL: 'https://api.flutterwave.com/v3/',
    timeout: 50000,
    withCredentials: true,
    //  headers: {
    // "Content-Type": "application/json",
    // Accept: "application/json",
  // },
})


flutterwave.interceptors.request.use((config) => {
  const secretKey = FLW_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Flutterwave secret key not configured");
  }

  config.headers.Authorization = `Bearer ${secretKey}`;
  return config;
});


export default flutterwave;
