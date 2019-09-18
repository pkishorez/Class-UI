import * as React from "react";

export interface IProps {
	fullHeight?: boolean;
	enableRouting?: boolean;
}

export interface IState {}
/**
 * Wrapper Component for the whole of Class-UI.
 */
export class ClassUI extends React.Component<IProps, IState> {
	render() {
		return <div>{this.props.children}</div>;
	}
}
