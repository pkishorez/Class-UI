import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IFormContextType } from './Form';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';

export interface IProps {
	name: string
	values: {
		label: string
		value: string
	}[]
	inline?: boolean
	schema?: IJSONSchema
	onError?: any
};

export interface IState {
	value?: string
}

export class Radio extends FormElement<IProps, IState> {
	private schema?: IJSONSchema;
	private defaultValue: any;

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
		}
	}

	componentWillUnmount()
	{
		this.context.delete_value(this.props.name);
	}

	change() {

	}
	private get value() {
		return this.state.value?this.state.value:null;
	}
	getValue() {
		return {
			value: this.value,
			error: null
		};
	}
	validate() {
		let error = this.schema?Schema.validate(this.schema, this.value):null;
		(this.props.onError && this.props.onError(error));
	}

	render() {
		return <div>
			{this.props.values.map((value)=>{
				return <label key={value.value} className={"radio"+(this.props.inline?" inline":"")}>
					<input type="radio" onChange={()=>{
						this.setState({
							value: value.value
						});
					}} checked={this.state.value==value.value} value={value.value} name={this.props.name}/>
					<div className="fake">•</div>
					{value.label}
				</label>
			})}
		</div>;
	}
};