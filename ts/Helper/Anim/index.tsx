import { find, includes, throttle, union } from "lodash-es";
import * as React from "react";
import { BaseComponentProps, IBaseComponentProps } from "../../Components/Base";
import { AnimChild, IAnimChildProps } from "./Child";

export interface IAnimProps extends IBaseComponentProps {
	style?: React.CSSProperties;
	className?: string;
	children: any;
	stagger?: boolean;
}
interface IAnimState {
	children: IAnimChildProps[];
}
export class Anim extends React.Component<IAnimProps, IAnimState> {
	public dummyRef: HTMLDivElement | null = null;

	constructor(props: IAnimProps) {
		super(props);
		this.state = {
			children: []
		};
		this.addRef = this.addRef.bind(this);
		this.updateChildren = throttle(this.updateChildren.bind(this), 100);
		window.addEventListener("resize", this.updateChildren);
	}
	public addRef(r: HTMLDivElement | null) {
		this.dummyRef = r;
	}
	public componentDidMount() {
		this.updateChildren();
	}
	public componentDidUpdate(prevProps: IAnimProps) {
		if (prevProps.children !== this.props.children) {
			this.updateChildren();
		}
	}
	public updateChildren() {
		if (!this.dummyRef) {
			return;
		}

		const curChildren = React.Children.toArray(this.props.children);

		const newKeys = curChildren.map((c: any) => c.key);
		const oldKeys = this.state.children.map(c => c.key);
		const allKeys = union(oldKeys, newKeys) as string[];

		const children: IAnimState["children"] = allKeys.map(key => {
			const inPrev = includes(oldKeys, key);
			const inCur = includes(newKeys, key);

			let childRef: any = null;
			if (this.dummyRef && this.dummyRef.children) {
				for (const ref of this.dummyRef.children as any) {
					if (ref.getAttribute("data-key") === key) {
						childRef = ref;
					}
				}
			}

			const child: IAnimChildProps = {
				dimensions: {
					height: childRef ? childRef.offsetHeight : 0,
					left: childRef ? childRef.offsetLeft : 0,
					top: childRef ? childRef.offsetTop : 0,
					width: childRef ? childRef.offsetWidth : 0
				},
				key,
				kid: find(curChildren, (c: any) => c.key === key),
				status: "add"
			};
			if (inPrev && inCur) {
				// Update
				child.status = "update";
			} else if (inPrev && !inCur) {
				child.status = "delete";
				child.kid = (find(
					this.state.children,
					(c: any) => c.key === key
				) as any).kid;
			} else {
				child.status = "add";
			}
			return child;
		});
		this.setState({
			children
		});
	}
	public render() {
		const { style } = this.props;
		let delay = 0;
		return (
			<div
				ref={this.addRef}
				{...BaseComponentProps(this.props)}
				style={{
					...style,
					position: "relative"
				}}
			>
				{/* Dummy first and content later! */}
				{React.Children.toArray(this.props.children).map((child: any) =>
					React.cloneElement(child, {
						"data-key": child.key,
						key: child.key + "disp",
						style: {
							...child.props.style,
							visibility: "hidden"
							// backgroundColor: "red"
						}
					})
				)}
				{this.state.children.map((child, i) => {
					const d = child.status === "add" ? delay++ : undefined;
					return (
						<AnimChild
							key={child.key}
							status={child.status}
							dimensions={child.dimensions}
							kid={React.cloneElement(child.kid, {
								style: {
									...child.kid.props.style,
									marginLeft: 0,
									marginTop: 0,
									marginRight: 0,
									marginBottom: 0
								}
							})}
							delay={this.props.stagger ? i / 10 : 0}
							onDelete={() => {
								this.setState({
									children: this.state.children.filter(
										c => c.key !== child.key
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

interface ISChildProps extends IBaseComponentProps {
	show: boolean;
	children?: any;
	onHide?: () => void;
}
export class SChild extends React.Component<ISChildProps> {
	render() {
		const { show, onHide, children, ...props } = this.props;
		return (
			<div
				{...BaseComponentProps(this.props)}
				onTransitionEnd={() => {
					if (!show) {
						onHide && onHide();
					}
				}}
				style={{
					...this.props.style,
					transition: "all 0.5s",
					opacity: show ? 1 : 0
				}}
			>
				{children}
			</div>
		);
	}
}
