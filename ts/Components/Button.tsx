import * as React from 'react';
import {BaseComponentProps, IBaseComponentProps} from './BaseComponent/index';
import {styled, cx, css} from 'classui/Emotion/index';

export interface IButtonProps extends IBaseComponentProps {
	children?: any
	active?: boolean
	disable?: boolean
	primary?: boolean
}

let EButton = styled('div')`
	user-select: none;
	padding: 10px;
	cursor: pointer;
	${props=>props.color}

	// Default Styles goes here..
	background-color: #EEEEEE;
	&:hover {
		background-color: #DDDDDD;
	}
	&:active {
		background-color: #CCCCCC;
	}
	&.active{
		&, &:hover {
			background-color: #DDDDDD;
		}
	}
	&.disable {
		&, &:hover{
			cursor: default;
			color: grey;
		}
	}
	.__navbar__ & {
		background-color: inherit;
		&:hover {
			background-color: ${p=>p.theme.colorDark};
		}
		&.active, &:active {
			background-color: ${p=>p.theme.colorDark};
		}
	}

	${p=>`
	&.primary {
		//background-color: ${p.theme.color};
		//color: black;
		&:hover, &.active {
			color: ${p.theme.contrast};
			background-color: ${p.theme.colorLight};
		}
		&.disable {
			&, :hover{
			cursor: default;
			background-color: ${p.theme.colorLight}
		}
	}`}
`;

export let Button = (props: IButtonProps)=>{
	return <EButton {...BaseComponentProps(props)} className={cx({
		primary: props.primary,
		active: props.active,
		disable: props.disable
	})}>
		{props.children}
	</EButton>;
}