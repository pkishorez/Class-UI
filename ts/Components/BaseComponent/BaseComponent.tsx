import * as React from 'react';
import * as ReactDOM from "react-dom";
import { ClassUI } from "classui/index";
import * as classNames from 'classnames';

export interface IBaseComponentProps {
	card?: "0"|"1"|"2"|"3"|"4"|"5"
	style?: React.CSSProperties
	className?: string
	onClick?: (e: any)=>any
	to?: string
	children?: any
}

export let BaseComponentProps = (props: Partial<IBaseComponentProps>): IBaseComponentProps => {
	return {
		onClick: (e: any)=>{
			if (!props.onClick) {
				if (props.to) {
					ClassUI.history.push(props.to);
				}
				return;
			}
			let result = props.onClick(e);

			if ((result!==false) && props.to) {
				alert("Navigating..."+ props.to);
				ClassUI.history.push(props.to);
			}
		},
		className: classNames(props.className, props.card?classNames("__card", "_"+props.card):undefined),
		style: props.style
	}
};


