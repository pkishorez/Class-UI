import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import { IFormContextType } from './Form';

export interface IProps {
	name: string
	options: string[]
	children?: any
};

export class Select extends FormElement<IProps, any> {
	private select: HTMLSelectElement | null;
	private defaultValue: string;

	constructor(props: IProps, context: IFormContextType) {
		super(props, context);
		context.initialize(props.name, this, (schema, defaultValue)=>{
			// Ignore Schema for now.
			this.defaultValue = defaultValue;
		})
	}

	componentWillUnmount()
	{
		this.context.delete_value(this.props.name);
	}

	public getValue() {
		return {
			value: this.select?this.select.value:null,
			error: null
		};
	}
	public validate() {
		// No Validation as of now.
	}

	render() {
		return <select defaultValue={this.defaultValue} name={this.props.name} ref={(ref)=>{this.select = ref;}}>
			{this.props.options.map((option)=>{
				return <option key={option} value={option}>{option}</option>
			})}
		</select>;
	}
};