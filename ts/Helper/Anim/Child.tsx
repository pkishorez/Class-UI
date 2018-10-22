import { css, cx, keyframes } from "emotion";
import React = require("react");

export interface IChildDimensions {
	left?: number | string;
	top?: number | string;
	width?: number | string;
	height?: number | string;
}

export interface IAnimChildProps {
	key: number | string;
	kid: any;
	status: "add" | "update" | "delete";
	dimensions: IChildDimensions;
	delay?: number;
	onDelete?: () => void;
}
export interface IChildState {
}

const showAnimation = keyframes`
	from {
		opacity: 0;
		transform: translateY(-50px);
	}
	to {
		transform: translateY(0px);
		opacity: 1;
	}
`;
const hideAnimation = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`

const defaultClass = css`
	position: absolute;
	margin: 0px;
	/* opacity: 0; */
	transition: 0.5s all ease;
	box-sizing: border-box;

	/* Animation is for entry style animation... */
	animation-duration: 0.5s;
	animation-timing-function: ease;
	animation-fill-mode: both;
`;

export class AnimChild extends React.Component<IAnimChildProps, IChildState> {
	style: React.CSSProperties = {};
	constructor(props: IAnimChildProps) {
		super(props);
	}

	render() {
		const {  } = this.state;
		const { kid, status, delay, onDelete, dimensions } = this.props;

		this.style = {
			...this.style,
			...kid.props.style,
			zIndex: status === "add" ? 10 : status === "update" ? 20 : 0,
			animationDelay: delay?`${delay}s`:undefined,
			animationName: showAnimation
		};
		if (status !== "delete") {
			this.style={
				...this.style,
				...dimensions,
				
			}
		}
		else {
			this.style={
				...this.style,
				animationDelay: "0s",
				animationName: hideAnimation
			}
		}
		return React.cloneElement(kid, {
			"data-child": this.props.kid.key,
			className: cx(defaultClass, kid.props.className),
			style: this.style,
			onAnimationEnd: ()=>{
				if (this.props.status==="delete") {
					onDelete && onDelete();
				}
			}
		});
	}
}
