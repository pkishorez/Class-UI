import { styled } from "classui/Emotion";
import { SAnim } from "classui/Helper/Animation";
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IProps {}

export interface IState {
	content?: any;
	type: "success" | "error";
	show: boolean;
}

let EFeedBack = styled("div")`
	position: fixed;
	top: 0px;
	left: 50%;
	z-index: 2000;
`;
let EContent = styled("div")`
	display: inline-block;
	position: relative;
	right: 50%;
	padding: 15px;
	min-width: 200px;
	text-align: center;

	&.error {
		background-color: rgb(255, 223, 223);
		color: rgb(201, 0, 0);
		font-weight: 900;
	}
	&.success {
		background-color: rgb(212, 255, 212);
		color: rgb(0, 119, 0);
		font-weight: 900;
	}
`;

let _instance: Feedback | null = null;
export class Feedback extends React.Component<IProps, IState> {
	static timeout: any = null;
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			show: false,
			type: "success"
		};
		_instance = this;
		this.hide = this.hide.bind(this);
	}
	componentWillUnmount() {
		_instance = null;
	}
	static show(
		content: string,
		type: IState["type"] = "success",
		timeout: number = 2
	) {
		if (!_instance) {
			console.error("Feedback component not found.");
			return;
		}
		_instance.setState({
			content,
			type,
			show: true
		});
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.timeout = setTimeout(_instance.hide, timeout * 1000);
	}
	hide() {
		this.setState({
			show: false
		});
	}
	render() {
		return (
			<SAnim animType="slideBottom" show={this.state.show}>
				<EFeedBack>
					<EContent className={this.state.type}>
						{this.state.content}
					</EContent>
				</EFeedBack>
			</SAnim>
		);
	}
}
