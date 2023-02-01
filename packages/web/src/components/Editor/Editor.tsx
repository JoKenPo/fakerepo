import dynamic from 'next/dynamic';
import QuillCursors from 'quill-cursors';
import { useQuill } from 'react-quilljs';
import styles from './editor.module.scss';

import 'quill/dist/quill.snow.css';
import { useState } from 'react';

interface IEditorProps {
	id: string;
	value?: string;
}

export default function Header(props: IEditorProps) {
	const docId = props.id;
	const toolbar = [
		[{ size: [] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: [] }, { background: [] }],
		[{ script: 'super' }, { script: 'sub' }],
		[{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['direction', { align: [] }],
		['link', 'image', 'video', 'formula'],
		['clean'],
	];

	const theme = 'snow';

	const modules = {
		// cursor: true,
		toolbar,
	};

	const [editorValue, setEditorValue] = useState(props.value || '');

	const { quill, Quill, quillRef } = useQuill();
	// const { quillRef } = useQuill({ theme, modules });

	if (Quill && !quill) {
		// For execute this line only once.
		// Quill.register('modules/cursors', QuillCursors);
	}

	if (quill) {
		quill.on('text-change', (delta, oldDelta, source) => {
			// console.log('Text change!');
			// console.log(quill.getText()); // Get text only
			// console.log(quill.getContents()); // Get delta contents
			// console.log(quill.root.innerHTML); // Get innerHTML using quill
			// console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
			setEditorValue(quill.getText());
		});
	}

	// Quill.register('modules/cursors', QuillCursors);

	// const editor = new Quill(`#${props.id}`, {
	// 	modules: {
	// 		toolbar: toolbar,
	// 		theme: 'snow',
	// modules: {
	// 	cursors: true,
	// },
	// 	},
	// });

	return (
		<div className={styles.editor}>
			<div id={'toolbar'}></div>
			<p>{editorValue}</p>
			<div id={props.id} ref={quillRef}></div>
		</div>
	);
}
