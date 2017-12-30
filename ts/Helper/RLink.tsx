import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

export interface IProps {
	to?: string
	children: React.ReactElement<any>
};
export interface IState {};

let _RLink = (props: IProps & RouteComponentProps<any>) => {
	if (props.to) {
		return React.cloneElement(props.children, {
			onClick: (e: any)=>{
				if (props.children.props.onClick)
					props.children.props.onClick(e)
				props.history.push(props.to as string)
			}
		});
	}
	return props.children;
}

export let RLink = withRouter<IProps & RouteComponentProps<any>>(_RLink);