import { Client } from 'faunadb';

const secret = process.env.FAUNADB_KEY;
let endpoint = process.env.FAUNADB_ENDPOINT;

if (typeof secret === 'undefined' || secret === '') {
	console.error('The FAUNADB_KEY environment variable is not set, exiting');
	process.exit(1);	
}

if (!endpoint) endpoint = 'https://db.fauna.com/';

export const fauna = new Client({
	secret: process.env.FAUNADB_KEY!,
});
