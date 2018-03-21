import {BaseComponentProps, IBaseComponentProps} from './BaseComponent';
import classNames = require('classnames');

export interface IBaseBlockComponentProps extends IBaseComponentProps {
	inlineBlock?: boolean
}

export let BaseBlockComponent = (props: Partial<IBaseBlockComponentProps>): IBaseBlockComponentProps=>{
	return {
		...BaseComponentProps(props),
		style: {
			display: props.inlineBlock?"inline-block":undefined,
			...props.style
		}
	}
}