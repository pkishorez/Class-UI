import * as React from 'react';
import * as classNames from "classnames";
import {IBaseComponentProps, BaseComponentProps} from './BaseComponent';

export interface IBadgeProps extends IBaseComponentProps {
	type?: "success" | "error" | "sunflower" | "carrot" | "grey"
	children: any
}
export let Badge = (props: IBadgeProps)=>{
	return <div {...BaseComponentProps(props)} className={classNames("__badge", props.type, props.className)}>
		{props.children}
	</div>;
}