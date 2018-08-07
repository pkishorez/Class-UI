import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { cardClasses } from "classui/Components/Base/Card";
import { css, cx, IThemeColors, styled } from "classui/Emotion";
import * as React from "react";

const ENavBar = styled("div")`
	position: relative;
	z-index: 10;
	top: 0px;
	left: 0px;
	width: 100%;
	padding: 3px;
	background-color: ${(p: IThemeColors) => p.theme.color};
	transition: all 1s;
`;
const EContent = styled("div")`
	max-width: 100%;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	flex-grow: 0;
	margin: auto;
	height: 100%;
	color: white;
`;
const ELogo = styled("div")`
	cursor: default;
	color: white;
	padding: 0px 5px;
	font-size: 20px;
	text-shadow: 0px 0px 15px white, 0px 0px 15px white;
	transition: all 0.3s;
	&::first-letter {
		font-size: 30px;
	}
	&:hover {
		text-shadow: 0px 0px 15px white, 0px 0px 15px white, 0px 0px 15px white;
	}
`;

export let NavbarRemain = () => {
	return (
		<div
			style={{
				flexGrow: 1
			}}
		/>
	);
};

export interface IProps extends IBaseComponentProps {
	dummy?: boolean;
	logo?: string; // Logo text if any
	width?: string | number;
	fixed?: boolean;
}

export class NavBar extends React.Component<IProps> {
	public static defaultProps: IProps = {
		dummy: false,
		logo: undefined,
		width: "auto"
	};

	constructor(props: IProps, context: any) {
		super(props, context);
	}

	render() {
		const content = (
			<EContent
				style={{
					width: this.props.width
				}}
			>
				{this.props.logo ? <ELogo>{this.props.logo}</ELogo> : null}
				{this.props.children}
			</EContent>
		);

		const dummyNavBar = (
			<ENavBar
				{...BaseComponentProps(this.props)}
				style={{ ...this.props.style, visibility: "hidden" }}
				className="__navbar__"
			>
				{content}
			</ENavBar>
		);

		return (
			<>
				{this.props.dummy ? dummyNavBar : null}
				<ENavBar
					{...BaseComponentProps(this.props)}
					style={{
						...this.props.style,
						position: this.props.fixed ? "fixed" : undefined
					}}
					className={cx(
						"__navbar__",
						css`
							${cardClasses["2"]};
						`
					)}
				>
					{content}
				</ENavBar>
			</>
		);
	}
}
