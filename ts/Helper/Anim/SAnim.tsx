import { css } from "emotion";
import * as React from "react";

export interface ISAnimProps {
	show: boolean;
	animTime: number;
	animHeight: {
		paddingTop?: number;
		paddingBottom?: number;
		marginTop?: number;
		marginBottom?: number;
	};
	hideOnMount: boolean;
	anim: {
		hideClass: string;
		showClass: string;
	};
	children: any;
	onHide?: any;
}
export class SAnim extends React.Component<ISAnimProps> {
	static defaultProps = {
		hideOnMount: true,
		animHeight: true,
		animTime: 0.4,
		anim: {
			showClass: css`
				opacity: 1;
			`,
			hideClass: css`
				opacity: 0;
			`
		}
	};
	ref: HTMLDivElement | null = null;
	baseStyle: string;
	currentHeight!: number | "auto";

	constructor(props: ISAnimProps) {
		super(props);
		this.baseStyle = css`
			transition: all ${props.animTime}s;
			box-sizing: border-box;
			overflow: hidden;
		`;
	}
	componentDidMount() {
		if (!this.ref) {
			return;
		}
		const {
			show,
			hideOnMount
		} = this.props;
		if (hideOnMount && show) {
			this.hide();
			requestAnimationFrame(() => {
				this.show();
			});
		} else {
			this.update();
		}
	}
	componentDidUpdate() {
		this.update();
	}
	update() {
		if (this.props.show) {
			this.show();
		} else {
			this.hide();
		}
	}
	show() {
		if (!this.ref) {
			return;
		}
		const {
			anim: { hideClass, showClass },
			animHeight
		} = this.props;
		if (animHeight) {
			if (this.currentHeight === "auto") {
				// Ignore.
				return;
			}
			this.ref.style.height = `${this.currentHeight}px`;
		}
		this.ref.classList.remove(hideClass);
		this.ref.classList.add(showClass);
	}
	hide() {
		if (!this.ref) {
			return;
		}
		const {
			anim: { hideClass, showClass },
			animHeight
		} = this.props;
		if (animHeight) {
			if (this.currentHeight === "auto") {
				this.currentHeight = this.ref.clientHeight;
				this.ref.style.height = `${this.currentHeight}px`;
				console.log("SET HEIGHT : ", this.currentHeight);
			}
			requestAnimationFrame(()=>{
				if (!this.ref) {
					return;
				}
				this.ref.style.height = "0px";
			})
		}
		this.ref.classList.add(hideClass);
		this.ref.classList.remove(showClass);
	}

	getRef = (r: any) => {
		this.ref = r;
		if (!this.ref) {
			return;
		}
		this.currentHeight = this.ref.clientHeight;
		this.ref.classList.add(this.baseStyle);
		this.ref.addEventListener("transitionend", ev => {
			if (!this.ref) {
				return;
			}
			const { show, animHeight, onHide } = this.props;
			if (show) {
				// Reset auto set fields.
				if (animHeight) {
					this.ref.style.height = "auto";
					this.currentHeight = "auto";
				}
			} else {
				onHide && onHide();
			}
		});
	};
	render() {
		const { children } = this.props;
		const child = React.Children.only(children);
		return React.cloneElement(child, {
			ref: this.getRef
		});
	}
}
