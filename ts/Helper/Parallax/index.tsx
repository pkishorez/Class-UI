import * as React from "react";
import { ParallaxItem } from "./Item";

export {ParallaxItem} from './Item';
interface IParallaxProps {
	style?: React.CSSProperties;
	height: number;
}
interface IParallaxState {
	scroll: number;
}
export class Parallax extends React.Component<IParallaxProps> {
	state: IParallaxState = {
		scroll: 0
	};
	scrollPosition = 0;
	constructor(props: IParallaxProps) {
		super(props);
		this.watch = this.watch.bind(this);
	}
	watch() {
		if (this.scrollPosition!==this.state.scroll) {
			this.setState({
				scroll: this.scrollPosition
			}, ()=>{
				requestAnimationFrame(this.watch);
			});
			return
		}
		requestAnimationFrame(this.watch);
	}
	componentDidMount() {
		this.watch();
	}
	render() {
		let itemCount = 0;
		const { height } = this.props;
		const children = React.Children.map(
			this.props.children,
			(child: any) => {
				if (child.type === ParallaxItem) {
					// Inject props.
					return React.cloneElement(child, {
						index: itemCount++,
						height: this.props.height,
						scroll: this.state.scroll
					});
				}
				return child;
			}
		);
		return (
			<div
				style={{
					position: "relative",
					height,
					overflow: "auto",
					...this.props.style
				}}
				onScroll={(e: any) => {
					this.scrollPosition = e.target.scrollTop;
				}}
			>
				<div
					style={{
						height: height * itemCount
					}}
				/>
				{children}
			</div>
		);
	}
}
