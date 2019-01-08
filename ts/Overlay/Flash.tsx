import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "../Emotion";
import { SAnim } from "../Helper/SAnim";
import { Overlay } from "./index";

export interface IFlashProps {
	noDismiss?: boolean;
	show: boolean;
	hide: () => void;
	children: any;
}

export interface IFlashState {
	overlayPortal: HTMLDivElement | null;
}

const EFlash = css`
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);

	&.noDismiss {
		background-color: rgba(0, 0, 0, 0.8);
	}
`;
const EContent = css`
	position: relative;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
`;

export class Flash extends React.Component<IFlashProps, IFlashState> {
	static defaultProps: Partial<IFlashProps> = {
		noDismiss: false,
		show: false
	};
	private content_click: boolean = false;

	constructor(props: IFlashProps, context: any) {
		super(props, context);
		this.state = {
			overlayPortal: null
		};
		this.escapeDismiss = this.escapeDismiss.bind(this);
		this.clickDismiss = this.clickDismiss.bind(this);
		window.addEventListener("keydown", this.escapeDismiss);
	}
	componentDidMount() {
		this.setState({
			overlayPortal: Overlay.getChild()
		});
	}
	componentWillUnmount() {
		window.removeEventListener("keydown", this.escapeDismiss);
		Overlay.removeChild(this.state.overlayPortal);
	}

	escapeDismiss(e: KeyboardEvent) {
		if (this.props.noDismiss) {
			return;
		}
		if (e.key === "Escape") {
			this.props.hide();
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
		this.props.hide();
	}
	render() {
		const { overlayPortal } = this.state;
		console.log("OVERLAY : ", overlayPortal);
		if (!overlayPortal) {
			return null;
		}
		return ReactDOM.createPortal(
			<SAnim
				show={this.props.show}
				animStyle={{
					hide: { opacity: 0 },
					show: { opacity: 1 },
					autoProps: []
				}}
				onHidden={this.props.hide}
			>
				<div
					className={EFlash}
					style={{
						pointerEvents: this.props.show ? undefined : "none"
					}}
					onClick={this.clickDismiss}
				>
					<div
						className={EContent}
						onClick={(e: any) => {
							e.stopPropagation();
						}}
					>
						{this.props.children}
					</div>
				</div>
			</SAnim>,
			overlayPortal
		);
	}
}
