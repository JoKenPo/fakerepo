import styles from './texteditor.module.scss';
import '../../services/socket.services';

export default function TextEditor() {
	return (
		<div className={styles.headerContainer}>
			<div className={styles.headerContent}></div>
		</div>
	);
}
