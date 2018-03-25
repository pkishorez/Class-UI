import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';
import { styled, cx } from 'classui/Emotion';

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

let ERadio = styled('label')`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	user-select: none;
	padding: 5px;

	&.inline{
		display: inline-flex;
		padding-right: 10px;
		margin-right: 5px;

	}

	&:hover{
		background-color: #F4F4F4;
	}

	& > input{
		display: none;
	}
`;

let EFake = styled('div')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 17px;
	height: 17px;
	margin-right: 10px;
	border: 1px solid black;
	border-radius: 50%;
	font-size: 15px;
	color: white;
	transition: 0.3s all;

	&.active{
		border: 1px solid ${p=>p.theme.colorDarker};
		background-color: ${p=>p.theme.color};
	}
`;

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
				return <ERadio key={cb.value} className={cx({
					inline: this.props.inline
				})}>
					<input type="radio" onChange={()=>{
						this.setState({
							value: cb.value
						}, ()=>{
							this.props.onChange && this.props.onChange(cb.value)
						});
					}} checked={this.state.value==cb.value} value={cb.value} name={this.props.name}/>
					<EFake className={cx({
						active: this.state.value==cb.value
					})}>•</EFake>
					{cb.label}
				</ERadio>
			})}
		</div>;
	}
};