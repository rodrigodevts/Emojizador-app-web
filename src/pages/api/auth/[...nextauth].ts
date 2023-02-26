import NextAuth from "next-auth";
import { query } from "faunadb";
import GoogleProvider from "next-auth/providers/google";
import { fauna } from "@/services/fauna";
import { parseCollectionReference } from "@/utils/parseCollectionReference";

type User = {
	name?: string;
	email: string;
	imagem?: string;
	maxMovies: number;
	countMovies: number;
	created_at: string;
}

type UserRef = {
	[key: string]: {
		id: string;
	}
}

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
				},
			},
		}),
	],
	secret: process.env.JWT_SECRET,
	callbacks: {
		async session({ session, token, user }) {
			try {
				const userRef = await fauna.query(
					query.Select(
						"ref",
						query.Get(
							query.Match(
								query.Index("user_by_email"),
								query.Casefold(session?.user?.email!)
							),
						),
					),
				);

				const userReference = parseCollectionReference(String(userRef));

				return {
					...session,
					userActive: userReference.id,
				};
			} catch (err) {
				console.log('Error: ', err);
				return {
					...session,
					userActive: null,
				};
			}
		},
		async signIn({ user }) {
			const { email } = user;

			if (!email) {
				return false;
			}

			const data: User = {
				name: user?.name!,
				email: user?.email!,
				imagem: user?.image!,
				maxMovies: 3,
				countMovies: 0,
				created_at: new Date().toString()
			};

			await fauna.query(
				query.If(
					query.Not(
						query.Exists(
							query.Match(query.Index("user_by_email"), query.Casefold(email))
						)
					),
					query.Create(query.Collection("users"), { data: data }),
					query.Get(
						query.Match(query.Index("user_by_email"), query.Casefold(email))
					)
				)
			);

			return true;
		},
	},
});