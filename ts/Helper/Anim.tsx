import * as React from 'react';
import { cx, css } from 'emotion';
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
	shouldUpdate: boolean
	childState: {
		[key: string]: IChildStats
	}
}
let i=0;
export class Anim extends React.Component<IAnimProps, IAnimState> {
	dummyRef: HTMLDivElement | null = null;
	constructor(props: IAnimProps) {
		super(props);
		this.state = {
			children: [],
			shouldUpdate: false,
			childState: {},
			display: undefined
		};
		this.addRef = this.addRef.bind(this);
	}
	static getDerivedStateFromProps(props: any, state: IAnimState) {
		// Gather all refs of dummy ones.
		const curChildren = React.Children
			.toArray(props.children);

		const curKeys = curChildren
			.map((child: any)=>child.key);
		const prevKeys = state.children.map(c=>c.key);
		const allKeys = _.union(prevKeys, curKeys) as string[];

		const children: IAnimState["children"] = allKeys.map(key=>{
			const inPrev = _.includes(prevKeys, key);
			const inCur = _.includes(curKeys, key);
			const child: IChildStatus = {
				status: "add",
				kid: _.find(curChildren, (child: any)=>child.key==key)
					|| (_.find(state.children, (child: any)=>child.key==key) as any).kid,
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

		const display = curChildren.map((child: any)=>React.cloneElement(child, {
			"data-key": child.key,
			key: child.key+"disp",
			visibility: "hidden"
		}))
		return {
			children,
			display,
			shouldUpdate: true
		};
	}
	addRef(r: HTMLDivElement | null) {
		this.dummyRef = r;
	}


	componentDidMount() {
		if (!this.dummyRef || !this.state.shouldUpdate)
			return;
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
		this.setState({
			shouldUpdate: false,
			childState
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
				{this.state.display}
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
let AnimChild = (props: IAnimChildProps) => {
	const {kid} = props.status;
	// Check for configuration here...
	return <Motion defaultStyle={{opacity: 0, top: 0}} style={{opacity: spring(1), top: props.stats?spring(props.stats.top):0}}>{
		obj=>{
			return React.cloneElement(kid, {
				style: {
					width: "100%",
					...kid.props.style,
					opacity: obj.opacity,
					top: obj.top,
					position: "absolute"
				}
			})
		}
	}</Motion>
}