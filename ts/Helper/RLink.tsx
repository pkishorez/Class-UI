import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';

export interface IProps {
	history?: any
	to?: string
	children: React.ReactElement<any>
};
export interface IState {};

let _RLink = (props: IProps) => {
	return props.to?React.cloneElement(props.children, {
		onClick: (e: any)=>{
			if (props.children.props.onClick)
				props.children.props.onClick(e)
			props.history.push(props.to)
		}
	}):props.children;
}

export let RLink = withRouter<IProps>(_RLink);