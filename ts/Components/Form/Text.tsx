import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';
import {FormElement, IValue} from './FormElement';
import {IJSONSchema, Schema} from './Schema';
import { FormContext } from 'classui/Components/Form/Form';
import { css } from 'classui/Emotion';

export interface ITextProps {
	name: string,
	type?: "text" | "password" | "area"
	autoFocus?: boolean
	schema?: IJSONSchema
	children?: string
	className?: string
	defaultValue?: string
	onChange?: (value: IValue)=>void
};

export interface ITextState {
	value?: string
};


export class Text extends FormElement<ITextProps, ITextState> {
	static defaultProps = {
		autoFocus: false,
		type: "text"
	};
	private input: HTMLInputElement | HTMLTextAreaElement | null = null;

	constructor(props: ITextProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue?this.props.defaultValue:""
		};
		this.validate = this.validate.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	public validate(focusOnError?: boolean) {
		let value = this.getValue();
		if (value.error) {
			focusOnError && this.input && this.input.focus();
		}
		this.props.onChange && this.props.onChange(value);
	}

	private onChange(e: any) {
		let value = e.target.value;
		this.setState({
			value: (value=="")?undefined: value
		}, this.validate);
	}

	_render() {
		let props = {
			autoFocus: this.props.autoFocus,
			autoComplete: this.props.name,
			ref: (ref: any)=>this.input = ref,
			spellCheck: false,
			name: this.props.name,
			placeholder: this.props.children,
			onChange: this.onChange,
			value: this.state.value?this.state.value:"",
			className: css`
				width: 100%;
				border-bottom: 2px solid grey;
				padding: 5px 0px 3px 0px;
				&:focus {
					border-bottom: 2px solid black;
				}
			`
		}
		return (this.props.type=="area")?<textarea
			{...props}>
		</textarea>:<input type={this.props.type} 
			{...props}
		/>;
	}
};