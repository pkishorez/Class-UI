import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TransitionMotion} from 'react-motion';
import {RLink} from '../Helper/RLink';
import { styled, cx, Hoverable, css } from 'classui/Emotion';
import { IBaseComponentProps, BaseComponentProps } from 'classui/Components/BaseComponent';

export interface IProps {
	header?: string
	children: any
};
export interface IState {};

let ESideMenu = styled('div')`
	border: 1px solid #DDDDDD;
	background-color: white;
	padding: 10px 0px;

	& > h3 {
		padding: 0px 10px;
	}
`;

export class Menu extends React.Component<IProps, IState> {
	render() {
		return <ESideMenu>
			{this.props.header?<h3>{this.props.header}</h3>:null}
			{this.props.children}
		</ESideMenu>;
	}
}


export interface IItemProps extends IBaseComponentProps {
	disable?: boolean
	active?: boolean
	children: any
};

export let MDivider = ()=>{
	return <div className={css`
		border-top: 1px solid grey;
		margin: 10px 5px;
	`}>
	</div>
}

let EItem = styled('div')`
	padding: 7px 10px;
`;
export let MItem = (props: IItemProps)=>{

	return <EItem {...BaseComponentProps(props)} className={cx(props.className, Hoverable({
		disable: props.disable,
		active: props.active
	}))}>
		{props.children}
	</EItem>;
}