import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Flash} from './Components/Flash';
import * as classNames from 'classnames';

let _instance: ClassUI;

export interface IProps {
	contentWidth?: number // ContentWidth is the maxWidth of the UI.
	offline?: boolean
};

/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, any> {
	private static mounted:Boolean = false;
	private static funcs: Function[] = [];

	public static defaultProps: IProps = {
		contentWidth: 1024,
		offline: false
	};

	public static get contentWidth() {
		if (!_instance)// THIS NEVER HAPPENS.
			console.error("Class-UI instance not found!!!");
		return _instance?_instance.props.contentWidth: 0;
	}

	public static onMounted(func: Function) {
		if (ClassUI.mounted){
			func();
			return;
		}
		ClassUI.funcs.push(func);
	}
	componentDidMount() {
		ClassUI.mounted = true;
		ClassUI.funcs.map((func)=>{
			func();
		});
		ClassUI.funcs = [];
	}
	constructor(props: any, context: any) {
		super(props, context);
		if (_instance) {
			console.error("Only one instance of ClassUI is permitted.");
			return _instance;
		}
		_instance = this;
	}
	render() {
		let cls = classNames("classui", {
			offline: this.props.offline
		});
		return <div className={cls}>
			{this.props.children}
			<Flash />
		</div>;
	}
}