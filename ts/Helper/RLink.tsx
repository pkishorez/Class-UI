import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';

export interface IProps {
	history?: any
	to?: string
	children: React.ReactElement<any>
};
export interface IState {};

export class _RLink extends React.Component<IProps, IState> {
	constructor(props: any)
	{
		super(props);
	}
	render() {
		if (!this.props.to)
			return this.props.children;
		return React.cloneElement(this.props.children, {
			onClick: (e: any)=>{
				if (this.props.children.props.onClick)
					this.props.children.props.onClick(e)
				this.props.history.push(this.props.to)
			}
		});
	}
}




export let RLink = withRouter(_RLink);