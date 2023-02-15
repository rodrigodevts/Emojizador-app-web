import { fauna } from '@/services/fauna';
import { query } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

type User = {
	ref: {
		id: string;
	};
	data: {
		name: string;
		email: string;
		avatar: string;
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const session = await getSession({ req });
		console.log('Sessão:', session);

		if (session) {
			try {
				await fauna.query(
					query.Get(
						query.Match(
							query.Index('user_by_email'),
							query.Casefold(session?.user?.email!)
						),
					),
				);
			} catch (error: any) {
				console.log('Erro: ', error);
				if (error === 'NotFound: instance not found') {
					const created = await fauna.query(
						query.Create(
							query.Collection('users'),
							{
								data: {
									name: session?.user?.name,
									email: session?.user?.email,
									avatar: session?.user?.image,
								}
							}
						),
					);

					return res.status(200).json(created);
				}
			}
		} else {
			return res.status(401).json({ error: 'Você precisa fazer login para acessar esta página.' });
		}

	}
}