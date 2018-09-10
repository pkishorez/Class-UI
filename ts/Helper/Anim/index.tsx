import { AnimChild, IAnimChildProps } from "classui/Helper/Anim/Child";
import _ = require("lodash");
import * as React from "react";

export interface IAnimProps {
	style?: React.CSSProperties;
	className?: string;
	children: any;
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
		this.updateChildren = _.throttle(this.updateChildren.bind(this), 100);
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
		const allKeys = _.union(oldKeys, newKeys) as string[];

		const children: IAnimState["children"] = allKeys.map(key => {
			const inPrev = _.includes(oldKeys, key);
			const inCur = _.includes(newKeys, key);

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
				kid:
					_.find(curChildren, (c: any) => c.key === key) ||
					(_.find(
						this.state.children,
						(c: any) => c.key === key
					) as any).kid,
				status: "add"
			};
			if (inPrev && inCur) {
				// Update
				child.status = "update";
			} else if (inPrev && !inCur) {
				child.status = "delete";
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
		const { style, className } = this.props;
		let delay = 0;
		return (
			<div
				ref={this.addRef}
				style={{
					...style,
					position: "relative"
				}}
				className={className}
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
				{this.state.children.map(child => {
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
							delay={d}
						/>
					);
				})}
			</div>
		);
	}
}
