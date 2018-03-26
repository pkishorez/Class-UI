import {BaseComponentProps, IBaseComponentProps} from './BaseComponent/index';
import React = require('react');

export interface IDivProps extends IBaseComponentProps {
	children: any
}
export let Div = (props: IDivProps)=>{
	return <div {...BaseComponentProps(props)}>
		{props.children}
	</div>;
}