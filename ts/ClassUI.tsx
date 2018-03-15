import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Flash} from './Components/Flash';
import * as classNames from 'classnames';
import { Drawer } from './Components/Drawer';
import { Feedback } from './Components/Feedback';

let _instance: ClassUI;

export interface IProps {
	fullHeight?: boolean
	theme?: "fb" | "green" | "flat" | "offline"
};

export interface IState {
	theme: IProps["theme"]
}
/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, IState> {

	public static defaultProps: IProps = {
		fullHeight: false,
		theme: "flat"
	};

	constructor(props: any, context: any) {
		super(props, context);
		if (_instance) {
			console.error("Only one instance of ClassUI is permitted.");
			return _instance;
		}
		this.state = {
			theme: this.props.theme
		};
		_instance = this;
	}
	public static setTheme(theme: IProps["theme"]) {
		_instance && _instance.setState({
			theme
		});
	}
	render() {
		let cls = classNames("classui", this.state.theme, {
			fullheight: this.props.fullHeight
		});
		return <div className={cls}>
			{this.props.children}
			<Flash />
			<Drawer />
			<Feedback />
		</div>;
	}
}