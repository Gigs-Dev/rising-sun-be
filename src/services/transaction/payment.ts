import axios from 'axios';

export const baseAxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer `,
    },
})

