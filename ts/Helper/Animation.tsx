import * as _ from "lodash";
import * as React from "react";
import { Motion, presets, spring } from "react-motion";

export interface ISAnimProps {
	show: boolean;
	children: React.ReactElement<any>;
	animType?:
		| "appear"
		| "opacity"
		| "slideLeft"
		| "slideRight"
		| "slideBottom"
		| "slideTop"
		| "none";
	onRemoved?: () => void;
}

const Animate = (value: number, type: ISAnimProps["animType"]) => {
	switch (type) {
		case "appear":
			return {
				opacity: value,
				transform: `scale(${value}, ${value})`,
				transformOrigin: "middle"
			};
		case "opacity": {
			return {
				opacity: value
			};
		}
		case "slideBottom":
			return {
				opacity: value,
				transform: `scaleY(${value})`,
				transformOrigin: "top"
			};
		case "slideTop":
			return {
				opacity: value,
				transform: `scaleY(${value})`,
				transformOrigin: "bottom"
			};
		case "slideLeft":
			return {
				opacity: value,
				transform: `scaleX(${value})`,
				transformOrigin: "right"
			};
		case "slideRight":
			return {
				transform: `scaleX(${value})`,
				transformOrigin: "left"
			};
	}
};

export class SAnim extends React.Component<ISAnimProps, any> {
	public static defaultProps: Partial<ISAnimProps> = {
		animType: "appear"
	};
	private rested: boolean = false;
	constructor(props: ISAnimProps, context: any) {
		super(props, context);
		this.onRest = this.onRest.bind(this);
	}
	public onRest() {
		this.rested = true;
		const { onRemoved } = this.props;
		if (!this.props.show && onRemoved) {
			onRemoved();
		}
		this.forceUpdate();
	}
	public render() {
		if (this.rested && !this.props.show) {
			return null;
		}
		this.rested = false;
		if (this.props.animType === "none") {
			return this.props.children;
		}
		return (
			<Motion
				defaultStyle={{ opac: 0 }}
				style={{ opac: spring(this.props.show ? 1 : 0, presets.stiff) }}
				onRest={this.onRest}
			>
				{obj => {
					const props = {
						style: Animate(obj.opac, this.props.animType)
					};
					return React.cloneElement(this.props.children, {
						...props
					});
				}}
			</Motion>
		);
	}
}

interface IMAnimProps {
	data: {
		id: number;
		data: any;
	}[];
	childRenderer: (props: any) => any;
}
interface IMAnimState {
	data: {
		id: number;
		data: any;
		height?: number;
	}[];
}

export class MAnim extends React.Component<IMAnimProps, IMAnimState> {
	public dummy: HTMLDivElement | null = null;
	constructor(props: IMAnimProps, context: any) {
		super(props, context);
		this.state = {
			data: this.props.data
		};
	}
	public componentDidMount() {}
	public render() {
		const children = this.state.data.map(d => {
			const child = this.props.childRenderer(d);
			if (d.height) {
				return (
					<Motion
						key={d.id}
						defaultStyle={{ opac: 0, height: 0 }}
						style={{ opac: spring(1), height: spring(d.height) }}
					>
						{obj => {
							return (
								<div
									style={{
										height: obj.height,
										paddingBottom: 20,
										overflow: "hidden",
										opacity: obj.opac
									}}
								>
									{child}
								</div>
							);
						}}
					</Motion>
				);
			} else {
				const currentID = d.id;
				return (
					<div
						key={currentID}
						ref={r => {
							if (r) {
								const height = r.getBoundingClientRect().height;
								this.setState({
									data: this.state.data.map(
										d =>
											d.id === currentID
												? {
														...d,
														height
												  }
												: d
									)
								});
							}
						}}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							paddingBottom: 20,
							visibility: "hidden"
						}}
					>
						{child}
					</div>
				);
			}
		});
		return (
			<div
				style={{
					position: "relative"
				}}
			>
				{children}
			</div>
		);
	}
}

interface IHAnimProps {}
interface IChild {
	key: any;
	child: any;
	status: "delete" | "visible";
}
interface IHAnimState {
	children: IChild[];
}

export class HAnim extends React.Component<IHAnimProps, IHAnimState> {
	public dummy: HTMLDivElement | null = null;
	constructor(props: IHAnimProps, context: any) {
		super(props, context);
		this.state = {
			children: []
		};
	}
	public static getDerivedStateFromProps(
		props: IHAnimProps & { children: any },
		state: IHAnimState
	) {
		const update: any = React.Children.toArray(props.children)
			.map(u => {
				const key = _.get(u, "key");
				if (key) {
					return {
						child: u,
						key,
						status: "visible"
					};
				}
			})
			.filter(u => u && u.key);

		let ui = 0,
			ci = 0,
			view = [];
		while (true) {
			if (ci >= state.children.length || ui >= update.length) {
				for (; ci < state.children.length; ci++) {
					view.push({
						...state.children[ci],
						status: "delete"
					});
				}
				for (; ui < update.length; ui++) {
					const found = _.find(
						state.children,
						c => c.key === update[ui].key
					);
					if (found) {
						view.push({
							...found,
							status: "visible"
						});
					} else {
						view.push(update[ui]);
					}
				}

				break;
			}
			if (state.children[ci].key === update[ui].key) {
				view.push({
					...state.children[ci],
					status: "visible"
				});
				ci += 1;
				ui += 1;
				continue;
			}
			const found = _.find(update, u => u.key === state.children[ci].key);
			if (found) {
				ci += 1;
			} else {
				// Obviously this was deleted!!!
				view.push({
					...state.children[ci],
					status: "delete" // Delete this child.
				});
				ci += 1;
			}
		}
		return {
			children: view
		};
	}
	public render() {
		return (
			<div
				style={{
					position: "relative",
					overflow: "hidden"
				}}
			>
				{JSON.stringify(this.state.children.map(c => c.key))}
				{this.state.children.map(child => {
					return (
						<HChild
							key={child.key}
							child={child}
							delChild={(key: any) => {
								this.setState({
									children: this.state.children.filter(
										c => c.key !== key
									)
								});
							}}
						/>
					);
				})}
			</div>
		);
	}
}

interface IHChildProps {
	child: IChild;
	delChild: any;
}
interface IHChildState {
	height?: number;
	status: IChild["status"];
}
class HChild extends React.Component<IHChildProps, IHChildState> {
	public hidden = true;
	constructor(props: IHChildProps, context: any) {
		super(props, context);
		this.state = {
			height: undefined,
			status: props.child.status
		};
		console.log("Constructor", props.child.key);
	}
	public static getDerivedStateFromProps(props: IHChildProps) {
		return {
			status: props.child.status
		};
	}
	public render() {
		const { child, status, key } = this.props.child;
		const height = this.state.height;
		if (height === undefined) {
			return (
				<div
					key={key}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						visibility: "hidden",
						overflow: "hidden"
					}}
					ref={r => {
						if (!r) {
							return;
						}
						const height = r.getBoundingClientRect().height;
						// alert(height);
						this.setState({
							height
						});
					}}
				>
					{child}
				</div>
			);
		}
		return (
			<Motion
				key={key}
				defaultStyle={{
					height: 0,
					opacity: 0
				}}
				style={{
					height: spring(status === "delete" ? -1 : height),
					opacity: spring(status === "delete" ? 0 : 1)
				}}
				onRest={() => {
					// Do something on rest.
					if (status === "delete") {
						this.props.delChild(key);
					}
				}}
			>
				{obj => {
					return (
						<div
							style={{
								height: obj.height,
								opacity: obj.opacity,
								overflow: "hidden"
							}}
							key={key}
						>
							{child}
						</div>
					);
				}}
			</Motion>
		);
	}
}
