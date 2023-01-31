import dynamic from 'next/dynamic';
// import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import styles from './editor.module.scss';

import 'react-quill/dist/quill.snow.css';

interface IEditorProps {
	id: string;
	value: string;
}

function formatRange(range) {
	return range ? [range.index, range.index + range.length].join(',') : 'none';
}

function onEditorChange(value, delta, source, editor) {
	this.setState({
		value: editor.getContents(),
		events: [`[${source}] text-change`, ...this.state.events],
	});
}

function onEditorChangeSelection(range, source) {
	this.setState({
		selection: range,
		events: [
			`[${source}] selection-change(${this.formatRange(
				this.state.selection,
			)} -> ${this.formatRange(range)})`,
			...this.state.events,
		],
	});
}

function onEditorFocus(range, source) {
	this.setState({
		events: [`[${source}] focus(${this.formatRange(range)})`].concat(
			this.state.events,
		),
	});
}

function onEditorBlur(previousRange, source) {
	this.setState({
		events: [`[${source}] blur(${this.formatRange(previousRange)})`].concat(
			this.state.events,
		),
	});
}

export default function Header(props: IEditorProps) {
	const docId = props.id;

	//eslint-disable-next-line
	// const Quill = dynamic(import('quill'), { ssr: false });
	const ReactQuill = dynamic(import('react-quill'), { ssr: false });

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

	// Quill.register('modules/cursors', QuillCursors);

	// const editor = new Quill(`#${props.id}`, {
	// 	modules: {
	// 		toolbar: toolbar,
	// 		theme: 'snow',
	// 		// modules: {
	// 		// 	cursors: true,
	// 		// },
	// 	},
	// });

	return (
		<div className={styles.editor}>
			<div id={'toolbar'}></div>
			{/* <div id={props.id}></div> */}
			<ReactQuill theme="snow" className={styles.quill} />
		</div>
	);
}
