import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import {IJSONSchema, Schema} from './Schema';
import { IFormContextType } from './Form';

export interface ITextProps {
	name: string,
	type?: "text" | "password" | "area"
	autoFocus?: boolean
	schema?: IJSONSchema
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
	private input: HTMLInputElement | HTMLTextAreaElement | null = null;
	private defaultValue: string = "";
	private schema?: IJSONSchema;

	constructor(props: any, context: IFormContextType) {
		super(props, context);
		this.state = {
			cls: ""
		};

		this.schema = props.schema;
		context.initialize(props.name, this, (schema, defaultValue)=>{
			this.schema=_.merge(props.schema, schema);
			this.defaultValue = defaultValue;
		});
		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.onChange = this.onChange.bind(this);
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
			error: this.schema?Schema.validate(this.schema, this.value?this.value:""): null
		};
	}

	public validate(focus?: boolean) {
		let error = this.schema?Schema.validate(this.schema, this.value?this.value:""):null;
		if (error && focus){
			this.input?this.input.focus():null;
		}
		this.props.onError && this.props.onError(error);
	}

	private onChange() {
		this.validate();
	}

	render() {
		let props = {
			autoFocus: this.props.autoFocus,
			autoComplete: "off",
			ref: (ref: any)=>this.input = ref,
			spellCheck: false,
			name: this.props.name,
			placeholder: this.props.children?this.props.children:"Enter a value",
			onChange: this.onChange,
			defaultValue: this.defaultValue
		}
		return (this.props.type=="area")?<textarea
			{...props}>
		</textarea>:<input type={this.props.type} 
			{...props}
		/>;
	}
};