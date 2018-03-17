import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Flash} from './Components/Flash';
import * as classNames from 'classnames';
import { Drawer } from './Components/Drawer';
import { Feedback } from './Components/Feedback';
import { IBaseComponentProps, BaseComponentProps } from './Components/BaseComponent';
import { BrowserRouter, withRouter, RouteComponentProps } from 'react-router-dom';

let _instance: ClassUI|undefined = undefined;

export interface IProps extends IBaseComponentProps {
	fullHeight?: boolean
	EnableRouting?: boolean
	theme?: "fb" | "green" | "flat" | "offline"
};

export interface IState {
	theme: IProps["theme"]
}
/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, IState> {

	public static History: RouteComponentProps<any> | null = null;
	public static defaultProps: IProps = {
		fullHeight: false,
		EnableRouting: false,
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
	componentWillUnmount() {
		_instance = undefined;
	}
	render() {
		let cls = classNames("classui", this.state.theme, this.props.className, {
			fullheight: this.props.fullHeight
		});

		let DummyRouter: any;
		if (this.props.EnableRouting) {
			let _DummyRouter = (props: RouteComponentProps<any>)=>{
				ClassUI.History = props;
				return null;
			}
			DummyRouter = withRouter(_DummyRouter);
		}
		let classui = <div {...BaseComponentProps(this.props)} className={cls}>
			{this.props.children}
			<Flash />
			<Drawer />
			<Feedback />
			{this.props.EnableRouting?<DummyRouter />:null}
		</div>;
		return this.props.EnableRouting?<BrowserRouter>
			{classui}
		</BrowserRouter>:classui;
	}
}