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
}

let ECheckbox = styled('label')`
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
		width: 17px;
		height: 17px;
		margin-right: 10px;
		border: 1px solid black;
		font-size: 15px;
		color: white;
		transition: 0.3s all;

		&.active{
			border: 1px solid ${p=>p.theme.colorDarker};
			background-color: ${p=>p.theme.color};
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
		return <ECheckbox className={cx({
			inline: this.props.inline
		})}>
			<input type="checkbox" checked={this.state.value} onChange={(e)=>{
				this.setState({
					value: !this.state.value
				});
			}} name={this.props.name}/>
			<div className={cx("fake", {
				active: this.state.value
			})}>✔</div>
			{this.props.children}
		</ECheckbox>;
	}
};