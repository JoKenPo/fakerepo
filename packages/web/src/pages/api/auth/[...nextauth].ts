import NextAuth, { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { IActiveUser } from '../../../services/socket.services';

interface NextAuthResponse {
	user: IActiveUser;
	auth: {
		token: string;
		refreshToken?: string;
	};
}

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const response = await fetch(process.env.NEXTAUTH_URL + '/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'key': 'localhost',
							'Basic':
								process.env.BASIC_USER + ':' + process.env.BASIC_PASSWORD,
						},
						body: JSON.stringify({
							email: credentials?.email,
							password: credentials?.password,
						}),
					});

					const user = (await response.json()) as NextAuthResponse;

					if (response.ok && user) {
						return user.user;
					}
					return null;
				} catch (error) {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/',
		error: '/', // Redireciona para home em caso de erro
	},
	// jwt: {
	//   signingKey: process.env.SIGNING_KEY
	// },
	callbacks: {
		async session({ session, user, token }) {
			try {
				// get
				return {
					...session,
					...user,
					...token,
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
		/*
		 * While using `jwt` as a strategy, `jwt()` callback will be called before
		 * the `session()` callback. So we have to add custom parameters in `token`
		 * via `jwt()` callback to make them accessible in the `session()` callback
		 */
		async jwt({ token, user }) {
			if (user) {
				/*
				 * For adding custom parameters to user in session, we first need to add those parameters
				 * in token which then will be available in the `session()` callback
				 */
				token.id_permissao = user.id_permissao;
				token.id = user.id;
				token.nome = user.nome;
				token.departamento = user.departamento;
				token.id_permissao = user.id_permissao;
				token.acesso = user.acesso;
				token.url_foto = user.url_foto;
				token.cliente = user.cliente;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				// ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
				session.user.id_permissao = token.id_permissao;
				session.user.id = token.id;
				session.user.nome = token.nome;
				session.user.departamento = token.departamento;
				session.user.id_permissao = token.id_permissao;
				session.user.acesso = token.acesso;
				session.user.url_foto = token.url_foto;
				session.user.cliente = token.cliente;
				// session.user.fullName = token.fullName
			}

			return session;
		},
	},
});
