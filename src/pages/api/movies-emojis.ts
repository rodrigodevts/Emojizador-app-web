import { fauna } from '@/services/fauna';
import { query } from 'faunadb';
import type { NextApiRequest, NextApiResponse } from 'next';

type MoviesEmojiData = {
	data: {
		movieName: string;
		text: string;
	}
}

type MoviesEmojiListResponse = {
	movies: MoviesEmojiData[];
	countMovies: number;
	maxMovies: number;
};

type User = {
	name: string;
	email: string;
	imagem: string;
	maxMovies: number;
	countMovies: number;
	created_at: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<MoviesEmojiListResponse>
) {
	const { user_id } = req.body;

	try {
		if (user_id) {
			const data = await fauna.query<MoviesEmojiData[]>(
				query.Map(
					query.Reverse(query.Paginate(query.Match(query.Index('movies_emoji_by_user_id'), user_id))),
					query.Lambda('movies_emoji', query.Get(query.Var('movies_emoji'))),
				),
			);
	
			const { countMovies, maxMovies } = await fauna.query<User>(
				query.Select(
					"data",
					query.Get(
						query.Ref(query.Collection('users'), user_id),
					)
				)
			);
	
			return res.status(200).json({
				movies: data,
				countMovies,
				maxMovies,
			});
		}
	} catch (err) {
		console.log('Not found: ', err);
	};
};
