import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

type Data = {
	data: string;
}

export default async function Auth(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const googleProviderConfig = GoogleProvider({
		clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
	});

	const providers = [
		googleProviderConfig,
	]

	if (req.query.nextauth) {
		const isDefaultSignInPage = req.method === 'GET' && req.query.nextauth.includes('signin');
		
		if (isDefaultSignInPage) providers.pop();

		return await NextAuth(req, res, {
			providers,
		});
	}
}
