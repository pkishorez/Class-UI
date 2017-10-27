import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';

export interface IProps {
	name: string,
	children: any,
	inline?: boolean
};

export class Checkbox extends FormElement<IProps, any> {
	private checkbox: HTMLInputElement | null;
	constructor(props: any, context: any) {
		super(props, context);
	}

	componentWillUnmount()
	{
		this.context.delete_value(this.props.name);
	}

	getValue() {
		return {
			value: this.checkbox?this.checkbox.value:null,
			error: null
		};
	}
	validate() {
		// Validation not present for now.
	}

	render() {
		return <label className={"checkbox"+(this.props.inline?" inline":"")}>
			<input type="checkbox" ref={(ref)=>{this.checkbox=ref;}} value="true" name={this.props.name}/>
			<div className="fake">✔</div>
			{this.props.children}
		</label>;
	}
};