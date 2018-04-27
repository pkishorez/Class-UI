import * as React from 'react';
import {IBaseComponentProps, BaseComponentProps} from './BaseComponent/index';
import { styled, PColors } from 'classui/Emotion';
import { IPColors } from 'classui/Emotion/theme';

export interface IBadgeProps extends IBaseComponentProps {
	type?: keyof(IPColors)
	children: any
}

export let Badge = (props: IBadgeProps)=>{
	let EBadge = styled('div')`
		display: inline-block;
		padding: 7px 10px;
		cursor: default;
		color: white;
		transition: all 0.4s;
		background-color: ${PColors[props.type?props.type:"success"]};
	`;
	return <EBadge {...BaseComponentProps(props)}>
		{props.children}
	</EBadge>;
}