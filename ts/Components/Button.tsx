import * as React from 'react';
import {IBaseComponentProps, BaseComponentProps} from './BaseComponent';
import classNames = require('classnames');

export interface IButtonProps extends IBaseComponentProps {
	children?: any
	active?: boolean
	disable?: boolean
}

export let Button = (props: IButtonProps)=>{
	console.log(props);
	return <div {...BaseComponentProps(props)} className={classNames("__button", props.className, {
		active: props.active,
		disable: props.disable
	})}>
		{props.children}
	</div>;
}