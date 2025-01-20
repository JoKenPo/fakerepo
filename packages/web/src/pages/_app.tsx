// src/pages/_app.tsx
import Header from '../components/Header/Header';
import { NextAuthProvider } from '../contexts/providers';
import '../styles/global.scss';
import type { AppProps } from 'next/app';

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<NextAuthProvider>
			<Header />
			<Component {...pageProps} />
		</NextAuthProvider>
	);
}
