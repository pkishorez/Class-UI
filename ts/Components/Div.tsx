import {BaseBlockComponent, IBaseBlockComponentProps} from './BaseComponent/index';
import React = require('react');

export interface IDivProps extends IBaseBlockComponentProps {
	children: any
}
export let Div = (props: IDivProps)=>{
	return <div {...BaseBlockComponent(props)}>
		{props.children}
	</div>;
}