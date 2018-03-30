import * as React from 'react';
import * as ReactDOM from "react-dom";
import { ClassUI } from "../../ClassUI";
import { css, cx } from 'classui/Emotion';

export interface IBaseComponentProps {
	card?: "0"|"1"|"2"|"3"|"4"|"5"
	style?: React.CSSProperties
	className?: string
	onClick?: (e: any)=>any
	onDblClick?: (e: any)=>any
	to?: string
	children?: any
}

export let cardStyles = {
	"0": `border: 1px solid #DDDDDD;`,
	"1": `box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);`,
	"2": `box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);`,
	"3": `box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);`,
	"4": `box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);`,
	"5": `box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);`
}

export let BaseComponentProps = (props: Partial<IBaseComponentProps>, ...className: string[]): IBaseComponentProps => {
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
				ClassUI.history.push(props.to);
			}
		},
		className: cx(props.className, props.card?cx(css`
			${cardStyles[props.card]}
		`):undefined, ...className),
		style: props.style
	}
};


