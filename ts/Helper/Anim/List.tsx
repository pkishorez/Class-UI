// tslint:disable-next-line: no-var-requires
import * as jsdiff from "diff";
import { Power0, TimelineLite, TweenLite, Power1, Power4 } from "gsap";
import * as React from "react";
import { v4 } from "uuid";

interface ISAnimProps {
	show: boolean;
	initProps: any;
	animProps: string[];
	animTime: number;
	autoHeight: boolean;
	children: any;
	onHide?: any;
	unMountOnHide: boolean;
}
interface ISAnimState {
	show: boolean;
}

const ease = Power4;
export class SAnim extends React.Component<ISAnimProps, ISAnimState> {
	static defaultProps = {
		animTime: 0.4,
		show: true,
		initProps: {
			transformOrigin: "center top"
		},
		autoHeight: false,
		unMountOnHide: true,
		animProps: ["scaleY", "opacity"]
	};
	ref: HTMLDivElement | null = null;
	tween!: gsap.TweenLite;
	autoTween: any;
	state = {
		show: true
	};

	constructor(props: ISAnimProps) {
		super(props);
	}
	animProps(show: boolean) {
		return this.props.animProps.reduce(
			(agg, key) => ({
				...agg,
				[key]: show ? 1 : 0
			}),
			{}
		);
	}
	componentDidMount() {
		TweenLite.set(this.ref, this.props.initProps);
		if (!this.props.show) {
			TweenLite.set(this.ref, this.animProps(true));
		} else {
			TweenLite.set(this.ref, this.animProps(false));
		}
		this.props.autoHeight && TweenLite.set(this.ref, { height: 0 });
		this.update();
	}
	onHide() {
		this.props.onHide && this.props.onHide();
		if (this.props.unMountOnHide) {
			this.setState({
				show: false
			});
		}
	}
	componentWillUnmount() {
		this.tween.kill();
	}
	componentDidUpdate(prevProps: ISAnimProps) {
		if (prevProps.show !== this.props.show) {
			this.update();
		}
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
		this.tween && this.tween.kill();
		this.tween = TweenLite.to(this.ref, this.props.animTime, {
			...this.animProps(true),
			ease: ease.easeOut
		});

		if (this.props.autoHeight) {
			this.autoTween && this.autoTween.kill();
			// Get current height;
			const height = this.ref.clientHeight;
			TweenLite.set(this.ref, { height: "auto" });
			this.autoTween = TweenLite.from(this.ref, this.props.animTime, {
				height,
				ease: ease.easeOut
			});
		}
	}
	hide() {
		this.tween && this.tween.kill();
		this.tween = TweenLite.to(this.ref, this.props.animTime, {
			...this.animProps(false),
			ease: ease.easeOut
		});
		this.tween.eventCallback("onComplete", () => {
			if (!this.props.show && this.props.onHide) {
				this.props.onHide();
			}
		});
		if (this.props.autoHeight) {
			this.autoTween && this.autoTween.kill();
			this.autoTween = TweenLite.to(this.ref, this.props.animTime, {
				height: 0,
				ease: ease.easeOut
			});
		}
	}

	getRef = (r: any) => {
		this.ref = r;
	};
	render() {
		const { children } = this.props;
		return this.state.show
			? React.cloneElement(children, {
					ref: this.getRef
			  })
			: null;
	}
}

interface IListProps {
	children: any;
	animProps?: Partial<ISAnimProps>
}
interface IListItem {
	component: any;
	dynamicKey: string | number;
	key: string | number;
	status: "delete" | "add";
}
interface IListState {
	list: IListItem[];
}

export class List extends React.Component<IListProps, IListState> {
	private map: any = {};
	constructor(props: IListProps) {
		super(props);
		this.state = {
			list: []
		};
	}
	componentDidMount() {
		this.updateList();
	}
	componentDidUpdate(prevProps: IListProps) {
		if (prevProps.children !== this.props.children) {
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
		const diff = jsdiff.diffArrays(oldItems, newItems, {
			comparator: (o, n) => o.dynamicKey === n.dynamicKey
		});
		const update: IListState["list"] = [];
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
	removeItem = (item: IListItem) => (e: any) => {
		this.setState(state => ({
			list: state.list.filter(i => i.dynamicKey !== item.dynamicKey)
		}));
	};
	render() {
		return (
			<>
				{this.state.list.map(item => {
					console.log("LIST ITEM ", item.component);
					if (item.component.name !== "SAnim") {
						// Create SAnim here.
						return (
							<SAnim
								{...this.props.animProps}
								show={item.status === "add"}
								onHide={this.removeItem(item)}
								key={item.dynamicKey}
							>
								{item.component}
							</SAnim>
						);
					}
					return React.cloneElement(item.component, {
						key: item.dynamicKey,
						show: item.status === "add",
						onHide: this.removeItem(item)
					});
				})}
			</>
		);
	}
}
