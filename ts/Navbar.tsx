import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import { IBaseComponentProps, BaseComponentProps } from './Components/BaseComponent';

export interface IProps extends IBaseComponentProps {
	dummy?: boolean
	logo?: string		// Logo text if any
	width?: string|number
};
export interface IState {};

export class NavBar extends React.Component<IProps, IState> {

	public static defaultProps: IProps = {
		dummy: false,
		logo: undefined,
		width: "auto"
	};

	constructor(props: IProps, context: any) {
		super(props, context);
	}

	render() {
		let content = <div className="content" style={{
			width: this.props.width
		}}>
			{this.props.logo?<div className="logo">{this.props.logo}</div>:null}
			{this.props.children}
		</div>;

		let dummyNavBar = <div className={classNames("__navbar", "dummy")}>
			{content}
		</div>;

		return <>
			{(this.props.dummy)?dummyNavBar:null}
			<div {...BaseComponentProps(this.props)} className={classNames("card-2", "__navbar", this.props.className)}>
				{content}
			</div>
		</>;
	}
}

export let NavbarRemain = ()=>{
	return <div className="remain"></div>;
};