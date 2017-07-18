import * as React from 'react';
import * as ReactDOM from 'react-dom';

let _instance: ClassUI = null;

interface propInterface {
	contentWidth?: number // ContentWidth is the maxWidth of the UI.
};

/**
 * Wrapper Component for the whole of Class-UI.
 */
class ClassUI extends React.Component<propInterface, null> {
	private static mounted:Boolean = false;
	private static funcs: Function[] = [];

	public static defaultProps: propInterface = {
		contentWidth: 1024
	};

	public static get contentWidth() {
		return _instance.props.contentWidth;
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
	constructor() {
		super();
		if (_instance) {
			console.error("Only one instance of ClassUI is permitted.");
			return _instance;
		}
		_instance = this;
	}
	render() {
		return <div className="classui">
			{this.props.children}
		</div>;
	}
}

export default ClassUI;