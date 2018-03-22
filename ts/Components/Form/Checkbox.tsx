import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';
import * as classNames from 'classnames';

export interface IProps {
	name: string,
	children: any,
	inline?: boolean
	onChange?: (value: boolean)=>void
	shouldBeChecked?: boolean
};

export interface IState {
}

export class Checkbox extends FormElement<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			value: false
		};
	}

	validate(focusOnError?: boolean) {
		// No Validation For Now.
		if (this.props.shouldBeChecked) {
			// The value should be checked. Otherwise error should be shown.
		}
	}

	_render() {
		return <label className={classNames(
				"__input_checkbox",
				{
					inline: this.props.inline
				}
			)}>
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