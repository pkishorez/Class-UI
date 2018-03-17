import * as React from 'react';
import {IBaseInlineComponentProps, BaseInlineComponent} from './BaseComponent/index';
import classNames = require('classnames');

export interface IButtonProps extends IBaseInlineComponentProps {
	children?: any
	active?: boolean
	disable?: boolean
}

export let Button = (props: IButtonProps)=>{
	return <div {...BaseInlineComponent(props)} className={classNames("__button", props.className, {
		active: props.active,
		disable: props.disable
	})}>
		{props.children}
	</div>;
}