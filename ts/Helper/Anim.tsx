import * as React from 'react';
import _ = require('lodash');
import { Motion, spring } from 'react-motion';

export interface IAnimProps {
	style?: React.CSSProperties
	className?: string
}
interface IChildStatus {
	key: number | string
	kid: any
	status: "add" | "update" | "delete"
}
interface IChildStats {
	left: number
	top: number
	width: number
	height: number	
}
interface IAnimState {
	display: any
	children: IChildStatus[]
	childState: {
		[key: string]: IChildStats
	}
}
let i=0;
export class Anim extends React.Component<IAnimProps, IAnimState> {
	dummyRef: HTMLDivElement | null = null;
	shouldUpdate = true;
	
	constructor(props: IAnimProps) {
		super(props);
		this.state = {
			children: [],
			childState: {},
			display: undefined
		};
		this.addRef = this.addRef.bind(this);
	}
	addRef(r: HTMLDivElement | null) {
		this.dummyRef = r;
	}

	componentWillReceiveProps() {
		this.shouldUpdate = true;
	}
	componentDidMount() {
		this.updateChildren();
	}
	componentDidUpdate() {
		this.updateChildren();
	}
	updateChildren() {
		if (!this.dummyRef || !this.shouldUpdate)
			return;


		const curChildren = React.Children
		.toArray(this.props.children);

		const curKeys = curChildren
			.map((child: any)=>child.key);
		const prevKeys = this.state.children.map(c=>c.key);
		const allKeys = _.union(prevKeys, curKeys) as string[];

		const children: IAnimState["children"] = allKeys.map(key=>{
			const inPrev = _.includes(prevKeys, key);
			const inCur = _.includes(curKeys, key);
			const child: IChildStatus = {
				status: "add",
				kid: _.find(curChildren, (child: any)=>child.key==key)
					|| (_.find(this.state.children, (child: any)=>child.key==key) as any).kid,
				key
			};
			if (inPrev && inCur) {
				// Update
				child.status = "update";
			}
			else if (inPrev && !inCur) {
				child.status = "delete";
			}
			return child;
		})


		let child: HTMLDivElement;
		let childState: IAnimState["childState"] = {};
		for (child of this.dummyRef.children as any) {
			const key = child.getAttribute("data-key");
			if (!key) {
				console.log("Done with dummy ones")
				break;
			}

			// Update each stateChild to include information of 
			childState[key] = {
				height: child.offsetHeight,
				width: child.offsetWidth,
				left: child.offsetLeft,
				top: child.offsetTop
			};
			console.log(key, child.offsetLeft, child.offsetTop)
		}
		this.shouldUpdate = false;
		this.setState({
			childState,
			children
		})
	}
	public render() {
		const {style, className} = this.props;
		return (
			<div ref={this.addRef} style={{
				...style,
				position: "relative"
			}} className={className}>
				{/* Dummy first and content later! */}
				{React.Children.toArray(this.props.children)
					.map((child: any)=>React.cloneElement(child, {
						"data-key": child.key,
						key: child.key+"disp",
						style: {
							...child.props.style,
							visibility: "hidden",
							// backgroundColor: "red"
						}
					}))
				}
				{
					this.state.children.map(child=>{
						const stats = this.state.childState[child.key];
						return <AnimChild key={child.key}
							status={child}
							stats={stats?stats:undefined}
						/>
					})
				}
			</div>
		);
	}
}

type IAnimChildProps = {
	stats?: IChildStats
	// Any child related props go here.
	status: IChildStatus
}
interface IAnimChildState {
}
class AnimChild extends React.Component<IAnimChildProps, IAnimChildState> {
	stats: IChildStats
	defaultStyle = {
		left: 0,
		top: 0,
		height: 0,
		width: 0
	};
	constructor(props: IAnimChildProps) {
		super(props);
		this.stats = this.props.stats || this.defaultStyle;
	}

	render() {
		const {status} = this.props;
		this.stats = this.props.stats || {
			...this.stats,
			height: 0
		};
		let stats: any = {
			...this.stats,
			opacity: (status.status=="delete")?0:1
		};
		Object.keys(stats).forEach(k=>stats[k]=spring(stats[k]))

		// Check for configuration here...
		return <Motion defaultStyle={{
				...this.defaultStyle,
				opacity: 0
			}} style={{
				opacity: spring(1),
				...stats
			}}>{
			obj=>{
				return React.cloneElement(status.kid, {
					style: {
						...obj,
						// width: "100%",
						...status.kid.props.style,
						margin: 0,
						position: "absolute",
					}
				})
			}
		}</Motion>
	}
}