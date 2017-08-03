import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

export interface IProps {
	header?: string
};
export interface IState {};

export class SideMenu extends React.Component<IProps, IState> {
	render() {
		return <div className="sidemenu">
			{this.props.header?<h3 className="header">{this.props.header}</h3>:null}
			{this.props.children}
		</div>;
	}
}

export let Item = (props: any)=>{
	let cls = classNames("item", {
		"disable": props.disable
	});
	return <div className={cls}>
		{props.children}
	</div>;
}