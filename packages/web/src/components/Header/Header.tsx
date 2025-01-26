import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Link href={'/'}>
					<img src="/images/gugu_sheets.png" alt="logo" />
					<span>FakeDocs</span>
				</Link>
			</div>
		</header>
	);
}
