import { Button } from "classui/Components/Button";
import { css, cx, styled } from "classui/Emotion";
import { ISAnimProps, SAnim } from "classui/Helper/Animation";
import { IOverlayProps } from "classui/Overlay";
import * as React from "react";

export interface IFlashProps {
	noDismiss?: boolean;
	animation?: ISAnimProps["animType"];
	noCloseButton?: boolean;
	content: any;
}

export type IProps = IFlashProps & IOverlayProps;

export interface IState {
	show: boolean;
}

let EFlash = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);

	&.noDismiss {
		background-color: rgba(0, 0, 0, 0.8);
	}
`;
let EContent = styled("div")`
	position: relative;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
`;
let Close = css`
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 900;
	position: absolute;
	top: 0px;
	right: 0px;
	padding: 10px;
	min-width: 40px;
	min-height: 40px;
`;

export class Flash extends React.Component<IProps, IState> {
	static defaultProps: Partial<IFlashProps> = {
		noDismiss: false,
		noCloseButton: true,
		animation: "slideRight"
	};
	private content_click: boolean = false;

	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			show: true
		};
		this.escapeDismiss = this.escapeDismiss.bind(this);
		this.clickDismiss = this.clickDismiss.bind(this);
		this.dismiss = this.dismiss.bind(this);
		window.addEventListener("keydown", this.escapeDismiss);
	}

	escapeDismiss(e: KeyboardEvent) {
		if (this.props.noDismiss) {
			return;
		}
		if (e.key == "Escape") {
			this.dismiss();
			window.removeEventListener("keydown", this.escapeDismiss);
		}
	}
	clickDismiss() {
		if (this.props.noDismiss) {
			// DO NOT Dismiss.
			return;
		}
		if (this.content_click) {
			this.content_click = false;
			return;
		}
		this.dismiss();
	}
	dismiss() {
		this.setState({ show: false });
	}
	render() {
		let content = (
			<EFlash
				className={cx({ noDismiss: !!this.props.noDismiss })}
				onClick={this.clickDismiss}
			>
				<EContent
					onClick={() => {
						this.content_click = true;
					}}
				>
					{this.props.content}
					{this.props.noCloseButton ? null : (
						<Button className={Close} onClick={this.dismiss}>
							x
						</Button>
					)}
				</EContent>
			</EFlash>
		);

		return !this.props.animation ? (
			this.state.show ? (
				content
			) : null
		) : (
			<SAnim
				show={this.state.show}
				animType={this.props.animation}
				onRemoved={this.props.remove}
			>
				{content}
			</SAnim>
		);
	}
}
