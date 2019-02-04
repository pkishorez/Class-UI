// tslint:disable-next-line: no-var-requires
import * as jsdiff from "diff";
import { TimelineLite, TweenLite } from "gsap";
import * as React from "react";
import { v4 } from "uuid";
import { ISAnimProps, SAnim } from "./SAnim";

interface ILAnimProps {
	children: any;
	SAnimProps?: ISAnimProps;
}
interface ILAnimState {
	list: {
		component: any;
		dynamicKey: string | number;
		key: string | number;
		status: "delete" | "add";
	}[];
}

export class LAnim extends React.Component<ILAnimProps, ILAnimState> {
	private map: any = {};
	constructor(props: ILAnimProps) {
		super(props);
		this.state = {
			list: []
		};
	}
	componentDidMount() {
		this.updateList();
	}
	componentDidUpdate(prevProps: ILAnimProps) {
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
		const update: ILAnimState["list"] = [];
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
		const { SAnimProps } = this.props;
		return (
			<>
				{this.state.list.map(item => {
					return (
						<SAnim
							{...SAnimProps}
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
