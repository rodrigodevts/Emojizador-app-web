import axios from 'axios';

const BASE_URL_API = process.env.BASE_URL_API;

if (typeof BASE_URL_API === 'undefined' || BASE_URL_API === '') {
	console.error('The BASE_URL_API environment variable is not set, exiting');
	process.exit(1);
}

export const api = axios.create({
	baseURL: `${BASE_URL_API}`, 
});