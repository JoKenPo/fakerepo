import { useSession } from 'next-auth/react';
import Editor from '../../components/Editor/Editor';
import { SocketProvider } from '../../contexts/Socket.context';
import { IActiveUser } from '../../services/socket.services';

export default function EditorPage() {
	const { data: session, status } = useSession();
	const user: IActiveUser | null = session
		? {
				id: session.user.id,
				id_permissao: session.user.id_permissao,
				nome: session.user.nome,
				url_foto: session.user.url_foto || '',
				auth: {
					token: session.user.auth.token as string,
				},
			}
		: null;

	return (
		<>
			{status === 'authenticated' && session && (
				<SocketProvider user={user}>
					<Editor id={'teste'} value={''} />
				</SocketProvider>
			)}
			{JSON.stringify(status)}
		</>
	);
}
