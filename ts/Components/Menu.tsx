import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/BaseComponent";
import { css, cx, Hoverable, styled } from "classui/Emotion";
import * as React from "react";

export interface IProps extends IBaseComponentProps {
	header?: string;
	children: any;
}

const ESideMenu = styled("div")`
	border: 1px solid #dddddd;
	background-color: white;
	padding: 10px 0px;

	& > h3 {
		padding: 0px 10px;
	}
`;

export class Menu extends React.Component<IProps> {
	render() {
		const { header, children, ...props } = this.props;
		return (
			<ESideMenu {...props}>
				{header ? <h3>{header}</h3> : null}
				{children}
			</ESideMenu>
		);
	}
}

export interface IItemProps extends IBaseComponentProps {
	disable?: boolean;
	active?: boolean;
	children: any;
}

export let MDivider = () => {
	return (
		<div
			className={css`
				border-top: 1px solid grey;
				margin: 10px 5px;
			`}
		/>
	);
};

const EItem = styled("div")`
	padding: 7px 10px;
	min-height: 48px;
`;
export let MItem = (props: IItemProps) => {
	return (
		<EItem
			{...BaseComponentProps(props)}
			className={cx(
				props.className,
				Hoverable({
					active: props.active,
					disable: props.disable
				})
			)}
		>
			{props.children}
		</EItem>
	);
};
