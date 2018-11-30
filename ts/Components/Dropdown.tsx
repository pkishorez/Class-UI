import * as React from "react";
import { css, cx, Hoverable, styled } from "../Emotion";
import { ISAnimProps, SAnim } from "../Helper/Animation";
import { Icon } from "../Helper/Icon";
import { BaseComponentProps, cardClasses, IBaseComponentProps } from "./Base";
import { Button, IButtonProps } from "./Button";

export interface IProps extends IBaseComponentProps {
	button: string | React.ReactElement<any>;
	customButton?: React.StatelessComponent<{active: boolean, text: string}>;
	push?: "left" | "right" | "up";
	animType?: ISAnimProps["animType"];
	children: any;
}
export interface IState {
	active: boolean;
}

const EDropdown = styled("div")`
	position: relative;
	display: flex;
`;
const EContent = styled("ul")`
	position: absolute;
	background-color: white;
	color: black;
	top: 100%;
	z-index: 1;

	max-width: 200px;
	min-width: 150px;
`;

const DefaultButton = ({ active, text }: any) => {
	return (
		<Button active={active}>
			<span className="inline-block noTextWrap">{text}</span>{" "}
			<Icon>expand_more</Icon>
		</Button>
	);
};

export class Dropdown extends React.Component<IProps, IState> {
	static defaultProps: Partial<IProps> = {
		push: "right"
	};
	clickedWithinDropdown = false;

	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			active: false
		};
		this.toggle = this.toggle.bind(this);
		this.windowDismiss = this.windowDismiss.bind(this);
		window.addEventListener("click", this.windowDismiss);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.windowDismiss);
	}

	windowDismiss() {
		if (this.clickedWithinDropdown) {
			this.clickedWithinDropdown = false;
			return;
		}
		this.setState({
			active: false
		});
	}
	toggle() {
		this.setState({
			active: !this.state.active
		});
	}
	render() {
		const Btn = this.props.customButton || DefaultButton;
		return (
			<EDropdown {...BaseComponentProps(this.props)}>
				<div
					onClick={() => {
						this.clickedWithinDropdown = true;
						this.toggle();
					}}
					style={{display: "flex"}}
				>
					<Btn active={this.state.active} text={this.props.button}/>
					{/* <CustomButton active={this.state.active}/> */}
				</div>
				<SAnim
					show={this.state.active}
					animType={
						this.props.animType
							? this.props.animType
							: this.props.push === "up"
							? "slideTop"
							: "slideBottom"
					}
				>
					<EContent
						onClick={() => {
							this.clickedWithinDropdown = true;
						}}
						className={cx(css`
							${cardClasses["3"]};
							${(() => {
								switch (this.props.push) {
									case "left":
										return `right: 0px;`;
									case "right":
										return `left: 0px`;
									case "up":
										return `top: auto;bottom: 100%;`;
								}
							})()};
						`)}
					>
						{typeof this.props.children === "function"
							? this.props.children(() => {
									this.setState({
										active: false
									});
							  })
							: this.props.children}
					</EContent>
				</SAnim>
			</EDropdown>
		);
	}
}

export interface IDropdownItemProps extends IBaseComponentProps {
	active?: boolean;
	disable?: boolean;
	children?: any;
}

const EDItem = styled("li")`
	display: flex;
	align-items: center;
	min-height: 40px;
	padding: 7px;
`;
export let DItem = (props: IDropdownItemProps) => {
	return (
		<EDItem
			{...BaseComponentProps(props)}
			className={cx(
				Hoverable({
					active: props.active,
					disable: props.disable
				}),
				props.className
			)}
		>
			{props.children}
		</EDItem>
	);
};
