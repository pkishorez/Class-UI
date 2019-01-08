// tslint:disable-next-line: no-var-requires
import * as jsdiff from "diff";
import { TweenMax } from "gsap";
import { omit } from "lodash-es";
import * as React from "react";
import { ResizeObserver } from "resize-observer";
import { v4 } from "uuid";

(window as any).jsdiff = jsdiff;
interface ISAnimProps {
	show?: boolean;
	children: any;
	onHide?: any;
	animTime?: number;
	hideAnim: any;
	autoAnim?: string[];
	dimensionAnimation?: boolean;
	showAnim: {
		[id: string]: any;
	};
}

export class SAnim extends React.Component<ISAnimProps> {
	static defaultProps: Partial<ISAnimProps> = {
		animTime: 0.4,
		show: true,
		autoAnim: []
	};
	animRef: any;
	tween?: gsap.TweenMax;
	contentRef: any;
	dynamicTween?: TweenMax;
	observer: any;
	dynamicDims = { height: 0 };
	autoAnimTween?: TweenMax;

	constructor(props: ISAnimProps) {
		super(props);
	}

	updateDimensions = () => {
		if (!this.props.dimensionAnimation) {
			return;
		}
		const contentHeight = this.contentRef.getBoundingClientRect().height;
		if (this.props.show && contentHeight === this.dynamicDims.height) {
			// NO CHANGE. IGNORE UPDATE.
			return;
		}
		if (!this.props.show) {
			this.dynamicDims = { height: 0 };
		} else {
			this.dynamicDims = {
				height: this.contentRef.getBoundingClientRect().height
			};
		}
		this.dynamicTween && this.dynamicTween.kill();
		this.dynamicTween = TweenMax.to(
			this.animRef,
			this.props.animTime!,
			this.dynamicDims
		);
		this.dynamicTween.eventCallback("onComplete", () => {
			if (!this.props.show) {
				this.props.onHide();
				return;
			}
			// this.updateDimensions();
		});
	};
	componentDidMount() {
		if (ResizeObserver && this.props.dimensionAnimation) {
			TweenMax.set(this.animRef, {
				height: 0
			});

			this.observer = new ResizeObserver(() => {
				setTimeout(this.updateDimensions, 100);
			});
			this.observer.observe(this.contentRef);
		}
		TweenMax.set(this.animRef, this.props.hideAnim);
		TweenMax.set(
			this.animRef,
			this.props.autoAnim!.reduce(
				(acc, a) => ({
					...acc,
					[a]: "auto"
				}),
				{}
			)
		);
		this.autoAnimTween = TweenMax.from(
			this.animRef,
			this.props.animTime!,
			this.props.autoAnim!.reduce(
				(acc, a) => ({
					...acc,
					[a]: 0
				}),
				{}
			)
		);
		this.update();
	}
	componentWillUnmount() {
		this.observer && this.observer.disconnect();
		this.tween && this.tween.kill();
		this.dynamicTween && this.dynamicTween.kill();
	}
	componentDidUpdate() {
		this.update();
	}
	update() {
		this.updateDimensions();
		this.tween && this.tween.kill();
		if (!this.props.show) {
			TweenMax.set(
				this.animRef,
				this.props.autoAnim!.reduce(
					(acc, a) => ({
						...acc,
						[a]: "auto"
					}),
					{}
				)
			);
			this.autoAnimTween && this.autoAnimTween.kill();
			this.tween = TweenMax.to(this.animRef, this.props.animTime!, {
				...this.props.hideAnim,
				...this.props.autoAnim!.reduce(
					(acc, a) => ({
						...acc,
						[a]: 0
					}),
					{}
				)
			});
		} else {
			this.tween = TweenMax.to(
				this.animRef,
				this.props.animTime!,
				this.props.show
					? this.props.showAnim
					: {
							css: {
								...this.props.hideAnim,
								...this.props.autoAnim!.reduce(
									(acc, a) => ({
										...acc,
										[a]: 0
									}),
									{}
								)
							}
					  }
			);
		}
		this.tween.eventCallback("onComplete", () => {
			if (!this.props.show && !this.props.dimensionAnimation) {
				this.props.onHide();
			}
		});
	}

	getAnimRef = (r: any) => {
		this.animRef = r;
	};
	getContentRef = (r: any) => {
		this.contentRef = r;
	};
	render() {
		const child = React.Children.only(this.props.children);
		const dimensionAnimation = !!this.props.dimensionAnimation;
		return dimensionAnimation ? (
			<div ref={this.getAnimRef}>
				{React.cloneElement(child, {
					ref: this.getContentRef
				})}
			</div>
		) : (
			React.cloneElement(child, {
				ref: this.getAnimRef
			})
		);
	}
}

interface IGenericListProps {
	children: any;
	itemProps?: Partial<ISAnimProps>;
}
interface IGenericListState {
	list: {
		component: any;
		dynamicKey: string | number;
		key: string | number;
		status: "delete" | "add";
	}[];
}

export class GenericList extends React.Component<
	IGenericListProps,
	IGenericListState
> {
	private map: any = {};
	constructor(props: IGenericListProps) {
		super(props);
		this.state = {
			list: []
		};
	}
	componentDidMount() {
		this.updateList();
	}
	componentDidUpdate(prevProps: IGenericListProps) {
		if (prevProps.children !== this.props.children) {
			// console.log("UPDATING LIST...");
			this.updateList();
		}
	}
	updateList() {
		const oldItems = this.state.list.map(
			({ component, key, dynamicKey }) => ({
				component,
				key,
				dynamicKey
			})
		);
		const newItems = React.Children.toArray(this.props.children).map(
			(ch: any) => ({
				key: ch.key,
				dynamicKey: this.map[ch.key] || ch.key,
				component: ch
			})
		);
		// console.log("NEW ITEM", newItems);
		const diff = jsdiff.diffArrays(oldItems, newItems, {
			comparator: (o, n) => o.dynamicKey === n.dynamicKey
		});
		const update: IGenericListState["list"] = [];
		diff.forEach(con => {
			if (con.added) {
				// Just add. No deal.
				con.value.forEach(val => {
					const id = v4();
					this.map[val.key] = id;
					update.push({
						component: val.component,
						dynamicKey: id,
						key: val.key,
						status: "add"
					});
				});
			} else if (con.removed) {
				con.value.forEach(val => {
					update.push({
						key: val.key,
						dynamicKey: val.dynamicKey,
						component: val.component,
						status: "delete"
					});
				});
			} else {
				con.value.forEach(val => {
					update.push({
						key: val.key,
						dynamicKey: val.dynamicKey,
						component: val.component,
						status: "add"
					});
				});
			}
		});
		this.setState({
			list: update
		});
	}
	render() {
		const render = this.state.list.map(item => {
			return React.cloneElement(item.component, {
				...this.props.itemProps,
				show: item.status === "add",
				key: item.dynamicKey,
				onHide: () => {
					this.setState(state => ({
						list: state.list.filter(
							i => i.dynamicKey !== item.dynamicKey
						)
					}));
				}
			});
		});
		// console.log("RENDER : ", render, this.state.list);
		return render;
	}
}
