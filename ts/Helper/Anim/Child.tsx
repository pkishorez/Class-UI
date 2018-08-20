import { css, cx } from "emotion";
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
	onDelete?: (key: any) => void;
}
export interface IChildState {
	mounted: boolean;
	dimensions: IChildDimensions;
}

const defaultClass = css`
	/* width: 0px;
	height: 0px; */
	/* top: 0px;
	left: 0px; */
	position: absolute;
	margin: 0px;
	opacity: 0;
	transition: 0.5s all ease-out;
`;

export class AnimChild extends React.Component<IAnimChildProps, IChildState> {
	static getDerivedStateFromProps(
		nextProps: IAnimChildProps,
		prevState: IChildState
	): Partial<IChildState> | null {
		if (nextProps.status === "delete") {
			return null;
		}
		return {
			dimensions: nextProps.dimensions
		};
	}

	kid: React.DetailedReactHTMLElement<{ className: string }, HTMLElement>;

	constructor(props: IAnimChildProps) {
		super(props);
		this.kid = React.cloneElement(props.kid, {
			className: cx(props.kid.props.className, defaultClass)
		});
		this.state = {
			dimensions: props.dimensions,
			mounted: false
		};
	}
	componentDidMount() {
		requestAnimationFrame(() => {
			this.setState({
				mounted: true
			});
		});
	}

	render() {
		const { mounted } = this.state;
		const { kid, status, delay, onDelete } = this.props;
		if (!mounted) {
			return this.kid;
		}

		let style: React.CSSProperties = {
			...kid.props.style,
			boxSizing: "border-box",
			zIndex: status === "add" ? 10 : status === "update" ? 20 : 0,
			...this.state.dimensions
		};
		if (status === "delete") {
			style = {
				...style,
				opacity: 0
			};
		} else {
			style = {
				...style,
				opacity: 1,
				transitionDelay: `${delay ? delay * 0.01 : 0}s`
			} as React.CSSProperties;
		}

		return React.cloneElement(this.kid, {
			style
		});
	}
}
