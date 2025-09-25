import axios from 'axios';

const api = axios.create({
	baseURL: '/api',
	timeout: 20000,
	headers: {
		'Content-Type': 'application/json',
	},
	retry: 3,
	retryDelay: 1000,
});

export default api;
