import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {Motion, spring, TransitionMotion, OpaqueConfig, TransitionProps, presets} from 'react-motion';

export interface ISAnimProps {
	show: boolean,
	children: React.ReactElement<any>
	animType?: "appear" | "slideLeft" | "slideRight" | "slideBottom" | "slideTop"
};

let Animate = (value: number, type: ISAnimProps["animType"])=>{
	switch(type) {
		case "appear":
			return {
				transform: `scale(${value}, ${value})`,
				transformOrigin: 'middle',
				opacity: value
			}
		case "slideBottom":
			return {
				transform: `scaleY(${value})`,
				transformOrigin: 'top',
				opacity: value
			}
		case "slideTop":
			return {
				transform: `scaleY(${value})`,
				transformOrigin: 'bottom',
				opacity: value
			}
		case "slideLeft":
			return {
				transform: `scaleX(${value})`,
				transformOrigin: 'right',
				opacity: value
			}
		case "slideRight":
			return {
				transform: `scaleX(${value})`,
				transformOrigin: 'left'
			}
	}
}

export class SAnim extends React.Component<ISAnimProps, any> {
	private rested: boolean = true;
	static defaultProps: Partial<ISAnimProps> = {
		animType: "appear"
	};
	constructor(props: ISAnimProps, context: any)
	{
		super(props, context);
		this.onRest = this.onRest.bind(this);
	}
	onRest()
	{
		this.rested = true;
		this.forceUpdate();
	}
	render() {
		if (this.rested && !this.props.show){
			return null;
		}
		this.rested = false;
		return <Motion defaultStyle={{opac: 0}} style={{opac: spring(this.props.show?1:0, presets.stiff)}} onRest={this.onRest}>{
			(obj)=>{
				let props = {
					style: Animate(obj.opac, this.props.animType)
				};
				return React.cloneElement(this.props.children, {
					...props
				});
			}
		}</Motion>
	}
}