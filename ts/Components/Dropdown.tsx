import {
	BaseComponentProps,
	cardClasses,
	IBaseComponentProps
} from "classui/Components/Base";
import { Button, IButtonProps } from "classui/Components/Button";
import { css, cx, Hoverable, styled } from "classui/Emotion";
import { ISAnimProps, SAnim } from "classui/Helper/Animation";
import * as React from "react";

export interface IProps extends IBaseComponentProps {
	buttonMaxWidth?: number;
	button: string | React.ReactElement<any>;
	btnProps?: IButtonProps;
	push?: "left" | "right" | "up";
	animType?: ISAnimProps["animType"];
	children: any;
}
export interface IState {
	active: boolean;
}

const EDropdown = styled("div")`
	position: relative;
	display: inline-block;
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
		return (
			<EDropdown {...BaseComponentProps(this.props)}>
				<Button
					{...this.props.btnProps}
					active={this.state.active}
					onClick={() => {
						this.clickedWithinDropdown = true;
						this.toggle();
					}}
				>
					{typeof this.props.button === "string" ? (
						<>
							<span
								className="inline-block noTextWrap"
								style={{
									maxWidth: this.props.buttonMaxWidth
								}}
							>
								{this.props.button}
							</span>{" "}
							<i className="fa fa-angle-down" />
						</>
					) : (
						this.props.button
					)}
				</Button>
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
							${cardClasses["3"]} ${(() => {
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
										active: !this.state.active
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
	padding: 10px;
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
