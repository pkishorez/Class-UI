import * as React from "react";

interface IExternal {
	scroll: number;
	index: number;
	height: number;
}
interface IParallaxItemProps {
	children: React.ReactElement<any>
}

type IParallaxItem = new (props: IParallaxItemProps)=> React.Component<any, any>;

class ParallaxItemm extends React.Component<IParallaxItemProps & IExternal, any> {
	render() {
		const {scroll, height, index} = this.props;
		const diff = (scroll - height*index);
		const top = height*index;

		let fadeOut = 1;
		if (diff>0) {
			fadeOut = 1 - diff/height;
			fadeOut = fadeOut<0?0:fadeOut;
		}
		return React.cloneElement(this.props.children, {
			style: {
				...this.props.children.props.style,
				height: this.props.height,
				width: "100%",
				position: "absolute",
				top,
				transform: `scale(${fadeOut}, ${fadeOut})`,
				opacity: fadeOut
			}
		});
	}
}

export const ParallaxItem = ParallaxItemm as any as IParallaxItem;