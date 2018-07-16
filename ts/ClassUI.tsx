// Reset CSS Styles.
import { IBaseComponentProps } from "classui/Components/Base";
import { css, cx, IThemeColors, IThemes, Themes } from "classui/Emotion";
import "classui/Emotion/reset";
import { Overlay } from "classui/Overlay";
import { Feedback } from "classui/Overlay/_Feedback";
import { ThemeProvider } from "emotion-theming";
import * as React from "react";
import {
	BrowserRouter,
	RouteComponentProps,
	withRouter
} from "react-router-dom";

let instance: ClassUI | undefined;

export interface IProps extends IBaseComponentProps {
	fullHeight?: boolean;
	enableRouting?: boolean;
	theme?: keyof (IThemes);
}

export interface IState {
	theme: keyof (IThemes) | IThemeColors;
}
/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, IState> {
	public static defaultProps: IProps = {
		enableRouting: false,
		fullHeight: false,
		theme: "flat"
	};
	public static setTheme(theme: IProps["theme"]) {
		if (theme && instance) {
			instance.setState({
				theme
			});
		}
	}
	private static h: RouteComponentProps<any> | null = null;

	public static get history() {
		return {
			push: (url: string) => {
				if (ClassUI.h) {
					ClassUI.h.history.push(url);
				} else {
					throw new Error("Routing not enabled.");
				}
			}
		};
	}

	constructor(props: any, context: any) {
		super(props, context);
		if (instance) {
			throw new Error("Only one instance of ClassUI is permitted.");
		}
		this.state = {
			theme: this.props.theme ? this.props.theme : "flat"
		};
		instance = this;
	}

	componentWillUnmount() {
		instance = undefined;
	}
	render() {
		const cls = cx(
			css`
				background-color: #ececec;
				${this.props.fullHeight ? `min-height: 100vh;` : null};
			`,
			this.state.theme,
			this.props.className
		);

		let DummyRouter: any;
		if (this.props.enableRouting) {
			DummyRouter = (props: RouteComponentProps<any>) => {
				ClassUI.h = props;
				return null;
			};
			DummyRouter = withRouter(DummyRouter);
		}
		const classui = (
			<div className={cls}>
				{this.props.children}

				<div
					style={{
						left: 0,
						position: "absolute",
						top: 0,
						zIndex: 1000
					}}
				>
					<Overlay />
				</div>
				<Feedback />
				{this.props.enableRouting ? <DummyRouter /> : null}
			</div>
		);
		return (
			<ThemeProvider
				theme={
					typeof this.state.theme === "string"
						? Themes[this.state.theme ? this.state.theme : "flat"]
						: this.state.theme
				}
			>
				{this.props.enableRouting ? (
					<BrowserRouter>{classui}</BrowserRouter>
				) : (
					classui
				)}
			</ThemeProvider>
		);
	}
}
