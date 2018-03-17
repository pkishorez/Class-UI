import * as React from 'react';
import * as classNames from "classnames";
import {IBaseInlineComponentProps, BaseInlineComponent} from './BaseComponent/index';

export interface IBadgeProps extends IBaseInlineComponentProps {
	type?: "success" | "error" | "sunflower" | "carrot" | "grey"
	children: any
}
export let Badge = (props: IBadgeProps)=>{
	return <div {...BaseInlineComponent(props)} className={classNames("__badge", props.type, props.className)}>
		{props.children}
	</div>;
}