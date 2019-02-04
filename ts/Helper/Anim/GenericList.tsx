// tslint:disable-next-line: no-var-requires
import * as anime from "animejs";
import * as jsdiff from "diff";
import { difference } from "lodash-es";
import * as React from "react";
import { v4 } from "uuid";

(window as any).jsdiff = jsdiff;
interface ISAnimProps {
	delay?: number;
	animeProps: {
		hidden: any;
		shown: any;
	};
	style?: React.CSSProperties;
	show?: boolean;
	children: any;
	onHide?: any;
	animTime?: number;
}

export class SAnim extends React.Component<ISAnimProps> {
	ref: HTMLDivElement | null = null;
	timeline?: anime.AnimeTimelineInstance;
	autoTimeline?: gsap.TimelineLite;
	animState: "hidden"|"shown"|"in transition" = "hidden";

	get animTime() {
		return this.props.animTime || 500;
	}
	get delay() {
		return this.props.delay || 0;
	}

	componentDidMount() {
		(anime as any).set(this.ref, this.props.animeProps.hidden);
		this.animState = "in transition";
		this.timeline = anime.timeline({
			delay: this.delay,
			duration: this.animTime
		} as any);
		// SET DEFAULTS IF ANY.
		this.timeline.progress
	}
	componentDidUpdate(prevProps: ISAnimProps) {
		if (prevProps.show !== this.props.show) {
			this.update();
		}
	}
	update = () => {};
	show() {
		
	}

	getRef = (r: any) => {
		this.ref = r;
	};
	render() {
		const { children, style } = this.props;
		const cloneChild = React.Children.only(children);
		return React.cloneElement(cloneChild, {
			style: { ...style, ...cloneChild.props.style },
			ref: this.getRef
		});
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

export class GenericList extends React.Component<IListProps, IListState> {
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
	render() {
		return (
			<>
				{this.state.list.map(item => {
					return React.cloneElement(item.component, {
						...item.component.props,
						key: item.dynamicKey,
						show: item.status === "add",
						style: this.props.itemStyle,
						onHide: () => {
							this.setState(state => ({
								list: state.list.filter(
									i => i.dynamicKey !== item.dynamicKey
								)
							}));
						}
					});
					// <SAnim
					// 	style={this.props.itemStyle}
					// 	key={item.dynamicKey}
					// 	show={item.status === "add"}
					// 	onHide={() => {
					// 		this.setState(state => ({
					// 			list: state.list.filter(
					// 				i => i.dynamicKey !== item.dynamicKey
					// 			)
					// 		}));
					// 	}}
					// >
					// 	{item.component}
					// </SAnim>
				})}
			</>
		);
	}
}
