import * as React from 'react';
import * as classNames from "classnames";
import {IBaseComponentProps, BaseComponentProps} from './BaseComponent/index';
import { styled, PColors } from 'classui/Emotion';
import { IPColors } from 'classui/Emotion/_theme';

export interface IBadgeProps extends IBaseComponentProps {
	type?: keyof(IPColors)
	children: any
}

export let Badge = (props: IBadgeProps)=>{
	let EBadge = styled('div')`
		padding: 7px 10px;
		cursor: default;
		color: white;
		transition: all 0.4s;

		${props.type?`background-color: ${PColors[props.type]};`:undefined}
	`;
	return <EBadge {...BaseComponentProps(props)}>
		{props.children}
	</EBadge>;
}