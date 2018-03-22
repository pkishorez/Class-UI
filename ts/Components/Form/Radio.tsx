import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';

export interface IProps {
	name: string
	values: {
		label: string
		value: string
	}[]
	inline?: boolean
	defaultValue?: string
	onChange?: (value: string)=>void
};

export interface IState {
}

export class Radio extends FormElement<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			value: this.props.defaultValue
		}
	}

	validate() {
		let error = this.schema?this.schema.validate(this.state.value):null;
		if (error) {
			// Do something here.
		}
	}

	_render() {
		return <div>
			{this.props.values.map((cb)=>{
				return <label key={cb.value} className={"__input_radio"+(this.props.inline?" inline":"")}>
					<input type="radio" onChange={()=>{
						this.setState({
							value: cb.value
						}, ()=>{
							this.props.onChange && this.props.onChange(cb.value)
						});
					}} checked={this.state.value==cb.value} value={cb.value} name={this.props.name}/>
					<div className="fake">•</div>
					{cb.label}
				</label>
			})}
		</div>;
	}
};