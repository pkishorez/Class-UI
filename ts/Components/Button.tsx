import * as React from 'react';
import {BaseComponentProps, IBaseComponentProps} from './BaseComponent/index';
import classNames = require('classnames');
import {styled, cx, css} from 'classui/Emotion/index';

export interface IButtonProps extends IBaseComponentProps {
	children?: any
	active?: boolean
	disable?: boolean
	primary?: boolean
}

export let Button = (props: IButtonProps)=>{
	let EButton = styled('div')`
		user-select: none;
		padding: 10px;
		cursor: pointer;

		// Default Styles goes here..
		background-color: #EEEEEE;
		&:hover {
			background-color: #DDDDDD;
		}
		&:active {
			background-color: #CCCCCC;
		}
		${p=>props.active?`
			&, &:hover {
				background-color: #DDDDDD;
			}`:undefined}
		${p=>props.disable?`
			&, :hover{
				cursor: default;
				color: grey;
			}`:undefined}


		// Primary styles goes here :)
		${p=>(props.primary)?`
			background-color: ${p.theme.color};
			color: ${p.theme.contrast};
			&:hover {
				background-color: ${p.theme.colorLight};
			}
			${props.active?`
			&, &:hover {
				background-color: ${p.theme.colorLight};
			}`:undefined}
			${props.disable?`
			&, :hover{
				cursor: default;
				background-color: ${p.theme.colorLight}
			}`:undefined}
		`:undefined}

		// Buttons in navbar styles goes here...
		.__navbar__ & {
			background-color: inherit;
			&:hover {
				background-color: ${p=>p.theme.colorDark};
			}
			${p=>props.active?`
				background-color: ${p.theme.colorDark};
			`:undefined}
		}
	`;
	return <EButton {...BaseComponentProps(props)}>
		{props.children}
	</EButton>;
}