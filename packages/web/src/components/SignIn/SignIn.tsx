'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github, Mail } from 'lucide-react';

export function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn('credentials', {
				email,
				password,
				callbackUrl,
				redirect: true,
			});
		} catch (error) {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white p-8 rounded-lg shadow-md">
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						placeholder="seu@email.com"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Senha
					</label>
					<input
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					{isLoading ? 'Entrando...' : 'Entrar'}
				</button>
			</form>

			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-2 text-gray-500">Ou continue com</span>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<button
						onClick={() => signIn('github', { callbackUrl })}
						className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
					>
						<Github className="h-4 w-4" />
						GitHub
					</button>
					<button
						onClick={() => signIn('google', { callbackUrl })}
						className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
					>
						<Mail className="h-4 w-4" />
						Google
					</button>
				</div>
			</div>
		</div>
	);
}
