import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from './ClassUI';
import {NavBar} from './Navbar';

export interface IProps {
	style?: React.CSSProperties
	fullHeight?: boolean
};

export interface IState {};

export class Content extends React.Component<IProps, IState> {
	private static _ref: HTMLDivElement | null;
	public static get ref() {
		return Content._ref;
	}
	render() {
		return <div className="mainContent" ref={(ref)=>{
			Content._ref = ref;
			if (ref){
				let navbarHeight = NavBar.ref?NavBar.ref.getBoundingClientRect().height:0;
				ref.style.marginTop = navbarHeight+'px';
				if (this.props.fullHeight)
					ref.style.minHeight = `calc(100vh - ${navbarHeight}px)`;
			}
		}} style={{
			width: ClassUI.contentWidth,
			...this.props.style
		}}>
			{this.props.children}
		</div>;
	}
}