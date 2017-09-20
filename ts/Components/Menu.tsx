import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import {TransitionMotion} from 'react-motion';
import {MAnim} from '../Helper/Animation';
import {RLink} from '../Helper/RLink';

export interface IProps {
	header?: string
	children: any
};
export interface IState {};

export class Menu extends React.Component<IProps, IState> {
	render() {
		return <TransitionMotion {...MAnim.opacity(this.props.children)}>{
			(styles)=>{
				return <div className="sidemenu">{
					this.props.header?<h3 className="header">{this.props.header}</h3>:null
				}{this.props.children}</div>;
		}}</TransitionMotion>;
	}
}


export type IItemProps = {
	disable?: boolean
	active?: boolean
	children: any
	style?: React.CSSProperties
	badge?: string
	to?: string
};

export let Divider = ()=> {
	return <div className="divider"></div>;
}

export let Item = (props: IItemProps)=>{
	let cls = classNames("item", {
		disable: props.disable,
		active: props.active
	});
	return <RLink to={props.to}><div className={cls} style={props.style}>
		{props.children} {props.badge?<span className="badge">{props.badge}</span>:null}
	</div></RLink>;
}