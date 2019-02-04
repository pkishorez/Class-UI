import * as React from "react";
import * as ReactDOM from "react-dom";
import { css } from "../Emotion";
import { SAnim } from "../Helper/SAnim";
import { Overlay } from "./index";

export interface IFeedbackProps {
	show: boolean;
	hide: () => void;
	children: any;
}

export interface IFeedbackState {
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

export class Flash extends React.Component<IFeedbackProps, IFeedbackState> {
	static defaultProps: Partial<IFeedbackProps> = {
		show: false
	};
	private content_click: boolean = false;

	constructor(props: IFeedbackProps, context: any) {
		super(props, context);
		this.state = {
			overlayPortal: null
		};
	}
	componentDidMount() {
		this.setState({
			overlayPortal: Overlay.getChild()
		});
	}
	componentWillUnmount() {
		Overlay.removeChild(this.state.overlayPortal);
	}

	render() {
		const { overlayPortal } = this.state;
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
