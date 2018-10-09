import * as React from "react";
import {
	BaseComponentProps,
	IBaseComponentProps
} from "./Components/Base";
import { css, cx } from "./Emotion";

export interface IContentProps extends IBaseComponentProps {}

const contentCls = css`
	flex-grow: 1;
`;
export class Content extends React.Component<IContentProps> {
	public static defaultProps: IContentProps = {};

	constructor(props: IContentProps, context: any) {
		super(props, context);
	}

	render() {
		return (
			<div
				{...BaseComponentProps(this.props)}
				className={cx(contentCls, this.props.className)}
			>
				{this.props.children}
			</div>
		);
	}
}
