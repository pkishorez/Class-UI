import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {spring, Motion} from 'react-motion';
import {SAnim, ISAnimProps} from '../Helper/Animation';
import classNames = require('classnames');
import { Button } from './Button';
import { BaseBlockComponent, IBaseBlockComponentProps } from './BaseComponent/index';

export interface IProps {
	buttonMaxWidth?: number
	button: string,
	push?: "left"|"right"|"up"
	animType?: ISAnimProps["animType"]
	children: any
};
export interface IState {
	active: boolean
};

export class Dropdown extends React.Component<IProps, IState> {
	clickedWithinDropdown = false;
	static defaultProps: Partial<IProps> = {
		push: "right"
	};

	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			active: false
		};
		this.toggle = this.toggle.bind(this);
		this.dismiss = this.dismiss.bind(this);
		window.addEventListener("click", this.dismiss);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.dismiss);
	}

	dismiss() {
		if (this.clickedWithinDropdown) {
			this.clickedWithinDropdown = false;
			return;
		}
		this.setState({
			active: false
		});
	}
	toggle(e: any) {
		this.setState({
			active: !this.state.active
		});
		this.clickedWithinDropdown = true;
	}
	render() {
		console.log(this.state.active);
		return <div className={"__dropdown push-"+this.props.push}>
			<Button active={this.state.active} onClick={this.toggle}>
				<span className="inline-block noTextWrap" style={{
					maxWidth: this.props.buttonMaxWidth
				}}>{this.props.button}</span> <i className="fa fa-angle-down"></i>
			</Button>

			<SAnim show={this.state.active} animType={this.props.animType?this.props.animType:(this.props.push=="up")?"slideTop":"slideBottom"}>
				<ul onClick={()=>this.clickedWithinDropdown = true} className="__card _3">
					{typeof this.props.children==="function"?this.props.children(()=>{
						this.setState({
							active: !this.state.active
						});
					}):this.props.children}
				</ul>
			</SAnim>
		</div>;
	}
}

export interface IDropdownItemProps extends IBaseBlockComponentProps {
	active?: boolean
	disable?: boolean
	children?: any
}
export let DItem = (props: IDropdownItemProps)=>{
	let cls = classNames(props.className, {
		disable: props.disable,
		active: props.active
	});
	return <li {...BaseBlockComponent(props)} className={cls}>
		{props.children}
	</li>;
}