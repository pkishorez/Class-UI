import * as gsap from "gsap";
import * as React from "react";

interface ISAnimProps {
	show?: boolean;
	animTime?: number;
	onHidden?: () => void;
	mountOnHidden?: boolean;
	animStyle: {
		hide: any;
		show: any;
		autoProps: string[];
	};
}
interface ISAnimState {
	hidden: boolean;
}
export class SAnim extends React.Component<ISAnimProps, ISAnimState> {
	static defaultProps: Partial<ISAnimProps> = {
		show: true,
		// animStyle: {hide: {}, show: {}, autoProps: []},
		animTime: 0.6
	};
	get ref() {
		if (!this._ref) {
			console.error("Ref not found. Please fix.");
		}
		return this._ref;
	}
	private _ref?: any;
	private autoAnim?: gsap.TweenMax;
	private anim?: gsap.TweenMax;
	constructor(props: ISAnimProps) {
		super(props);
		this.state = {
			hidden: !!props.show
		};
	}
	componentDidMount() {
		gsap.TweenMax.set(this.ref, this.props.animStyle.hide);
		this.update();
	}
	componentDidUpdate(prevProps: ISAnimProps) {
		if (prevProps.show !== this.props.show) {
			this.update();
		}
	}
	update = () => {
		if (this.props.show) {
			this.show();
		} else {
			this.hide();
		}
	};

	show = () => {
		const {
			animTime,
			animStyle,
			animStyle: { autoProps }
		} = this.props;

		if (this.state.hidden) {
			// Reset to hidden style.
			gsap.TweenMax.set(this.ref, animStyle.hide);
		}
		this.anim && this.anim.kill();
		this.anim = gsap.TweenMax.to(this.ref, animTime!, animStyle.show);

		this.autoAnim && this.autoAnim.kill();
		gsap.TweenMax.set(
			this.ref,
			autoProps.reduce(
				(acc, prop) => ({
					...acc,
					[prop]: "auto"
				}),
				{}
			)
		);
		this.autoAnim = gsap.TweenMax.from(
			this.ref,
			animTime!,
			autoProps.reduce(
				(acc, prop) => ({
					...acc,
					[prop]: 0
				}),
				{}
			)
		);
		this.setState({
			hidden: false
		});
	};
	hidden = () => {
		if (!this.props.show) {
			this.props.onHidden && this.props.onHidden();
			!this.props.mountOnHidden && this.setState({ hidden: true });
		}
	};
	hide = () => {
		const {
			animTime,
			animStyle,
			animStyle: { autoProps }
		} = this.props;

		this.anim && this.anim.kill();
		this.anim = gsap.TweenMax.to(this.ref, animTime!, animStyle.hide);

		this.autoAnim && this.autoAnim.kill();
		this.autoAnim = gsap.TweenMax.to(
			this.ref,
			animTime!,
			autoProps.reduce(
				(acc, prop) => ({
					...acc,
					[prop]: 0
				}),
				{}
			)
		);
		this.anim.eventCallback("onComplete", this.hidden);
		this.autoAnim.eventCallback("onComplete", this.hidden);
	};

	render() {
		const child = React.cloneElement(
			React.Children.only(this.props.children as any),
			{
				ref: this.getRef
			}
		);
		return this.props.mountOnHidden
			? child
			: !this.props.show && this.state.hidden
			? null
			: child;
	}
	private getRef = (r: any) => {
		this._ref = r;
	};
}
