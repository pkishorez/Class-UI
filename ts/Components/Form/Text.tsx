import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import {IPropSchema, PropSchema} from './Schema';

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
	private schema?: IPropSchema;

	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			cls: ""
		};
		this.schema = this.props.schema;
		this.context.initialize(this.props.name, this, (schema: any)=>{
			this.schema=_.merge(this.props.schema, schema);
		});
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
			error: PropSchema.validate(this.schema, this.value?this.value:"")
		};
	}

	public validate() {
		let error = PropSchema.validate(this.schema, this.value?this.value:"");
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
			value={this.props.schema?this.props.schema.$defaultValue:""}
		/>;
	}
};