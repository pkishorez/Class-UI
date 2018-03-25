import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {spring, Motion} from 'react-motion';
import {SAnim, ISAnimProps} from '../Helper/Animation';
import classNames = require('classnames');
import { Button, IButtonProps } from './Button';
import { IBaseComponentProps, BaseComponentProps, cardStyles } from './BaseComponent/index';
import { styled, Hoverable, cx, IThemeColors, css } from 'classui/Emotion';
import { StyledComponent } from 'react-emotion';

export interface IProps {
	buttonMaxWidth?: number
	button: string | React.ReactElement<any>
	btnProps?: IButtonProps
	push?: "left"|"right"|"up"
	animType?: ISAnimProps["animType"]
	children: any
};
export interface IState {
	active: boolean
};

let EDropdown = styled('div')`
	position: relative;
	display: inline-block;
`;
let EContent = styled('ul')`
	position: absolute;
	background-color: white;
	color: black;
	top: 100%;

	max-width: 200px;
	min-width: 150px;
`;

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
		this.setState({
			active: false
		});
	}
	toggle(e: any) {
		this.setState({
			active: !this.state.active
		});
		e.stopPropagation();
	}
	render() {
		return <EDropdown>
			<Button {...this.props.btnProps} active={this.state.active} onClick={this.toggle}>
				{(typeof(this.props.button)=="string")?<>
					<span className="inline-block noTextWrap" style={{
						maxWidth: this.props.buttonMaxWidth
					}}>{this.props.button}</span> <i className="fa fa-angle-down"></i>
				</>:this.props.button}
			</Button>
			<SAnim show={this.state.active} animType={this.props.animType?this.props.animType:(this.props.push=="up")?"slideTop":"slideBottom"}>
				<EContent  onClick={(e)=>e.stopPropagation()} className={cx(css`
					${cardStyles["3"]}
					${()=>{
						switch(this.props.push){
							case "left":
								return `right: 0px;`
							case "right":
								return `left: 0px`;
							case "up":
								return `top: auto;bottom: 100%;`;
						}
					}}
				`)}>
					{(typeof this.props.children==="function")?this.props.children(()=>{
						this.setState({
							active: !this.state.active
						});
					}):this.props.children}
				</EContent>
			</SAnim>
		</EDropdown>;
	}
}

export interface IDropdownItemProps extends IBaseComponentProps {
	active?: boolean
	disable?: boolean
	children?: any
}

let EDItem = styled('li')`
	padding: 10px;
`;
export let DItem = (props: IDropdownItemProps)=>{
	return <EDItem {...BaseComponentProps(props)} className={cx(Hoverable({
		active: props.active,
		disable: props.disable
	}), props.className)}>
		{props.children}
	</EDItem>;
}