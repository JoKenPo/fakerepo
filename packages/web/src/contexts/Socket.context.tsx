'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IActiveUser, SocketIOClient } from '../services/socket.services';

interface SocketContextProps {
	socketClient: SocketIOClient | null;
}

const SocketContext = createContext<SocketContextProps>({ socketClient: null });

export const SocketProvider: React.FC<{
	children: React.ReactNode;
	user: IActiveUser | null;
}> = ({ children, user }) => {
	const [socketClient, setSocketClient] = useState<SocketIOClient | null>(null);

	useEffect(() => {
		if (user) {
			// Inicialize o socket somente se o usuário estiver definido
			const client = new SocketIOClient(user);
			setSocketClient(client);

			// Limpeza ao desmontar ou alterar o usuário
			return () => {
				client.disconnect();
				setSocketClient(null);
			};
		} else {
			// Se não houver usuário, desconecte qualquer socket existente
			if (socketClient) {
				socketClient.disconnect();
			}
			setSocketClient(null);
		}
	}, [user]);

	return (
		<SocketContext.Provider value={{ socketClient }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
