import { useSession } from 'next-auth/react';
import styles from './Avatars.module.scss';

export function Avatars() {
	// const users = useOthers();
	const { data: session, status } = useSession();
	const currentUser = session?.user;

	return (
		<div className={styles.avatars}>
			{/* {users.map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} picture={info.url_foto} name={info.name} />
        );
      })} */}

			{currentUser && (
				<div className="relative ml-8 first:ml-0">
					<Avatar picture={currentUser.url_foto} name={currentUser.nome} />
				</div>
			)}
		</div>
	);
}

export function Avatar({ picture, name }: { picture: string; name: string }) {
	return (
		<div className={styles.avatar} data-tooltip={name}>
			<img
				src={picture}
				className={styles.avatar_picture}
				data-tooltip={name}
			/>
		</div>
	);
}
