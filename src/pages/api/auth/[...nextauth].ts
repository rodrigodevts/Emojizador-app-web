import NextAuth from "next-auth";
import { fauna } from "@/services/fauna";
import { query } from "faunadb";
import GoogleProvider from "next-auth/providers/google";

type User = {
	name?: string;
	email: string;
	imagem?: string;
	maxMovies: number;
	countMovies: number;
	created_at: Date;
}

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
		}),
	],
	secret: process.env.JWT_SECRET,
	callbacks: {
		async session({ session }) {
			try {
				const userActive = await fauna.query(
					query.Get(
						query.Match(
							query.Select(
								"ref",
								query.Get(
									query.Match(
										query.Index("user_by_email"),
										query.Casefold(session?.user?.email!)
									),
								),
							),
						),
					),
				);

				return {
					...session,
					userActive: userActive,
				};
			} catch (err) {
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
				created_at: new Date()
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