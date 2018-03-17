import * as React from 'react';
import * as ReactDOM from "react-dom";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import { ClassUI } from "../ClassUI";

let BrowserHistory: RouteComponentProps<any> | null = null;
let _Dummy = (props: RouteComponentProps<any>)=>{
	BrowserHistory = props;
	return null
}
let Dummy = withRouter(_Dummy);

export interface IBaseComponentProps {
	style?: React.CSSProperties
	className?: string
	onClick?: (e: any)=>any
	inlineBlock?: boolean
	to?: string
}

export let BaseComponentProps = (props: Partial<IBaseComponentProps>): IBaseComponentProps => {
	return {
		onClick: (e: any)=>{
			if (!props.onClick) {
				if (props.to) {
				}
				return;
			}
			let result = props.onClick(e);

			if ((result!==false) && props.to) {
				alert("Navigating..."+ props.to);
				console.log(ClassUI.History);
				ClassUI.History && ClassUI.History.history.push(props.to);
			}
		},
		className: props.className,
		style: {
			display: props.inlineBlock?"inline-block":undefined,
			...props.style
		}
	}
};


