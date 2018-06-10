import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {FormElement} from './FormElement';
import * as propTypes from 'prop-types';
import { IJSONSchema, Schema } from './Schema/index';
import * as _ from 'lodash';
import { styled, css, cx } from 'classui/Emotion';

export interface IProps {
	name: string,
	children: any,
	inline?: boolean
	onChange?: (value: boolean)=>void
	shouldBeChecked?: boolean
};

export interface IState {
	error: boolean
}

let ECheckbox = styled('label')`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	user-select: none;
	padding: 5px;

	&.error {
		color: red;
	}

	&.inline{
		display: inline-flex;
		padding-right: 10px;
		margin-right: 5px;

	}

	&:hover{
		background-color: #F4F4F4;
	}

	& > input{
		position: fixed;
		top: 0px;
		left: 0px;
		width: 0px;
		height: 0px;
		margin: 0px;
		padding: 0px;
		&:focus {
			& ~ .fake {
				border: 1px solid ${p=>p.theme.colorDarker};
				box-shadow: 0px 0px 5px ${p=>p.theme.colorDarker};
			}
		}
	}
	>.fake {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		width: 20px;
		height: 20px;
		border: 1px solid black;
		font-size: 15px;
		color: white;
		transition: 0.3s all;

		&.active{
			border: 1px solid ${p=>p.theme.colorDarker};
			background-color: ${p=>p.theme.color};
		}
		& > * {
			margin: auto;
		}
	}
`;
let EFake = styled('div')`

`;

export class Checkbox extends FormElement<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			value: false,
			error: false
		};
	}

	validate(focusOnError?: boolean) {
		// No Validation For Now.
		let error = this.schema?this.schema.validate(this.state.value):null;
		if (error) {
			this.setState({
				error: true
			});
		}
		else {
			this.setState({
				error: false
			});
		}
	}

	Render() {
		return <ECheckbox className={cx({
			inline: !!this.props.inline,
			error: this.state.error
		})}>
			<input type="checkbox" checked={this.state.value} onChange={(e)=>{
				this.setState({
					value: !this.state.value
				}, this.validate);
			}} name={this.props.name}/>
			<div className={cx("fake", {
				active: this.state.value
			})}><span>✔</span></div>
			{this.props.children}
		</ECheckbox>;
	}
};