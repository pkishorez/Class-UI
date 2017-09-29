import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import {IPropSchema, Validate} from './Schema';

export interface ITextProps {
	name: string,
	type?: "text" | "password"
	autoFocus?: boolean
	schema?: IPropSchema
	onError?: Function
	children: string
};
export interface ITextState {
	cls: string
};

export class Text extends FormElement<ITextProps, ITextState> {
	static defaultProps = {
		autoFocus: false,
		type: "text"
	};
	private input: HTMLInputElement | null;

	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			cls: ""
		};
		this.context.initialize(this.props.name, this);
		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
	}

	componentWillUnmount() {
		this.context.delete_value(this.props.name);
	}

	private get value(){
		return this.input?this.input.value:null;
	}

	public getValue() {
		return {
			value: this.value,
			error: Validate(this.props.schema, this.value?this.value:"")
		};
	}

	public validate() {
		let error = Validate(this.props.schema, this.value?this.value:"");
		(this.props.onError && this.props.onError(error));
	}

	render() {
		return <input type={this.props.type} 
			autoFocus={this.props.autoFocus}
			autoComplete="off"
			ref={(ref)=>this.input = ref}
			spellCheck={false}
			name={this.props.name}
			placeholder={this.props.children || "Enter a value"}
			onChange={this.validate}
		/>;
	}
};