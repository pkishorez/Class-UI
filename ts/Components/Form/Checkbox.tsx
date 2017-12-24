import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IFormContextType } from './Form';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';

export interface IProps {
	name: string,
	children: any,
	inline?: boolean
	schema?: IJSONSchema
	onError?: any
};

export interface IState {
	value: boolean
}

export class Checkbox extends FormElement<IProps, IState> {
	private defaultValue: boolean;
	private schema?: IJSONSchema;

	constructor(props: IProps, context: IFormContextType) {
		super(props, context);
		this.schema = props.schema;
		context.initialize(props.name, this, (schema, defaultValue)=>{
			this.schema = _.merge(this.schema, schema);
			this.defaultValue = defaultValue;
		})
		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			value: this.defaultValue
		};
	}

	componentWillUnmount()
	{
		this.context.delete_value(this.props.name);
	}

	getValue() {
		return {
			value: this.state.value,
			error: null
		};
	}
	validate() {
		let error = this.schema?Schema.validate(this.schema, this.state.value):null;
		(this.props.onError && this.props.onError(error));
	}

	render() {
		return <label className={"checkbox"+(this.props.inline?" inline":"")}>
			<input type="checkbox" checked={this.state.value} onChange={(e)=>{
				this.setState({
					value: !this.state.value
				});
			}} name={this.props.name}/>
			<div className="fake">✔</div>
			{this.props.children}
		</label>;
	}
};