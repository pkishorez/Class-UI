import {BaseComponentProps, IBaseComponentProps} from './BaseComponent';
import classNames = require('classnames');

export interface IBaseInlineComponentProps extends IBaseComponentProps {
	block?: boolean
}

export let BaseInlineComponent = (props: Partial<IBaseInlineComponentProps>): IBaseInlineComponentProps=>{
	return {
		...BaseComponentProps(props),
		style: {
			display: props.block?"block":undefined,
			...props.style
		}
	}
}