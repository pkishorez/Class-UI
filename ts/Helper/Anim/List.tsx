// tslint:disable-next-line: no-var-requires
import * as jsdiff from "diff";
import { TimelineLite, TweenLite } from "gsap";
import * as React from "react";
import { v4 } from "uuid";

(window as any).jsdiff = jsdiff;
interface ISAnimProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	> {
	show?: boolean;
	children: any;
	onHide?: any;
}

export class SAnim extends React.Component<ISAnimProps> {
	ref: HTMLDivElement | null = null;
	timeline!: gsap.TimelineLite;

	componentDidMount() {
		this.update();
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
		this.timeline && this.timeline.kill();
		this.timeline = new TimelineLite();
		this.timeline.set(this.ref as any, {
			height: "auto",
			scaleY: 1,
			transformOrigin: "center top"
		});
		this.timeline.from(this.ref as any, 0.4, {
			height: 0,
			scaleY: 0
		});
	}
	hide() {
		this.timeline.kill();
		this.timeline = new TimelineLite();
		this.timeline
			.to(this.ref as any, 0.4, { height: 0, scaleY: 0 })
			.eventCallback("onComplete", this.props.onHide);
	}

	getRef = (r: any) => {
		this.ref = r;
	};
	render() {
		const { children, show, onHide, ...props } = this.props;
		return (
			<div
				{...props}
				style={{ ...props.style, boxSizing: "border-box" }}
				ref={this.getRef}
			>
				{children}
			</div>
		);
	}
}

interface IListProps {
	children: any;
	itemStyle?: React.CSSProperties;
}
interface IListState {
	list: {
		component: any;
		dynamicKey: string | number;
		key: string | number;
		status: "delete" | "add";
	}[];
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
		console.log("UPDATE", update);
		this.setState({
			list: update
		});
	}
	render() {
		return (
			<>
				{this.state.list.map(item => {
					return (
						<SAnim
							style={this.props.itemStyle}
							key={item.dynamicKey}
							show={item.status === "add"}
							onHide={() => {
								this.setState(state => ({
									list: state.list.filter(
										i => i.dynamicKey !== item.dynamicKey
									)
								}));
							}}
						>
							{item.component}
						</SAnim>
					);
				})}
			</>
		);
	}
}
