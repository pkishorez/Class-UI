import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Flash} from './Components/Flash';
import { Drawer } from './Components/Drawer';
import { Feedback } from './Components/Feedback';
import { BaseComponentProps, IBaseComponentProps } from './Components/BaseComponent/index';
import { BrowserRouter, withRouter, RouteComponentProps } from 'react-router-dom';
import {Themes, IThemes, IThemeColors, cx, css} from './Emotion/index';
import {ThemeProvider} from 'emotion-theming';

let _instance: ClassUI|undefined = undefined;

export interface IProps extends IBaseComponentProps {
	fullHeight?: boolean
	EnableRouting?: boolean
	theme?: keyof(IThemes)
};

export interface IState {
	theme: keyof(IThemes) | IThemeColors
}
/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, IState> {

	private static _history: RouteComponentProps<any> | null = null;
	public static defaultProps: IProps = {
		fullHeight: false,
		EnableRouting: false,
		theme: "flat"
	};

	public static get history() {
		return {
			push: (url: string)=>{
				if (ClassUI._history) {
					ClassUI._history.history.push(url);
				}
				else {
					console.error("Routing wasn't set up for Class-UI. Please look into it.");
				}
			}
		}
	}

	constructor(props: any, context: any) {
		super(props, context);
		if (_instance) {
			console.error("Only one instance of ClassUI is permitted.");
			return _instance;
		}
		this.state = {
			theme: this.props.theme?this.props.theme:"flat"
		};
		_instance = this;
	}
	public static setTheme(theme: IProps["theme"]) {
		theme && _instance && _instance.setState({
			theme: theme
		});
	}
	componentWillUnmount() {
		_instance = undefined;
	}
	render() {
		let cls = cx(css`
			background-color: #ECECEC;
			${this.props.fullHeight?`
				min-height: 100vh;
			`:undefined}
		`, this.state.theme, this.props.className);

		let DummyRouter: any;
		if (this.props.EnableRouting) {
			let _DummyRouter = (props: RouteComponentProps<any>)=>{
				ClassUI._history = props;
				return null;
			}
			DummyRouter = withRouter(_DummyRouter);
		}
		let classui = <div {...BaseComponentProps(this.props)} className={cls}>
			{this.props.children}

			<div style={{position: "absolute",top: 0, left: 0, zIndex: 30}}>
				<Flash />
				<Drawer />
				<Feedback />
			</div>
			{this.props.EnableRouting?<DummyRouter />:null}
		</div>;
		return <ThemeProvider theme={(typeof this.state.theme=="string")?Themes[this.state.theme?this.state.theme:"flat"]:this.state.theme}>{
			this.props.EnableRouting?<BrowserRouter>
				{classui}
			</BrowserRouter>:classui
		}</ThemeProvider>
	}
}