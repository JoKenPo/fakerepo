import NextAuth, { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			authorization: {
				params: {
					scope: 'read:user',
				},
			},
		}),
	],
	// jwt: {
	//   signingKey: process.env.SIGNING_KEY
	// },
	callbacks: {
		async session({ session, user, token }) {
			try {
				// get
				return {
					...session,
					activeSubscription: true,
				};
			} catch {
				return {
					...session,
					activeSubscription: null,
				};
			}
		},
		async signIn({ user, account, profile, email, credentials }) {
			// const { email } = user;

			try {
				// user exist

				return true;
			} catch {
				return false;
			}
		},
	},
});
