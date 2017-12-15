import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {Motion, spring, TransitionMotion, OpaqueConfig, TransitionProps, presets} from 'react-motion';

export interface IProps {
	show: boolean,
	children: React.ReactElement<any>
	animType?: "appear" | "slideLeft" | "slideRight" | "slideBottom" | "slideTop"
};

let Animate = (value: number, type: IProps["animType"])=>{
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

export class SAnim extends React.Component<IProps, any> {
	private rested: boolean = true;
	static defaultProps: Partial<IProps> = {
		animType: "appear"
	};
	constructor(props: IProps, context: any)
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

export interface IManimProps {
	defaultStyle?: any
	style?: {
		[id: string]: number
	},
	willLeave?: {
		[id: string]: number
	},
	willEnter?: {
		[id: string]: number
	}
}

export let MAnim = {
	opacity: (items: {[id: string]: any}): TransitionProps =>{
		return {
			willLeave: ()=>{
				return {
					opacity: spring(0)
				}
			},
			willEnter: ()=>{
				return {
					opacity: 0
				}
			},
			styles: ()=>{
				return Object.keys(items).map((item)=>{
					return {
						key: item,
						style: {
							opacity: spring(1)
						},
						data: items[item]
					}
				});
			}
		}
	}
}