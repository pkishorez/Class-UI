import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Form, IProps as IFormProps} from '../Form/Form';
import * as PropTypes from 'prop-types';

export interface IProps extends IFormProps {
	label: string
};
export interface IState {};

export class Formlayout extends React.Component<IProps, IState> {

	render() {
		return <Form cls="form-layout" onSubmit={this.props.onSubmit}>
			<h3 style={{marginBottom: 10}}>{this.props.label}</h3>
			{this.props.children}
		</Form>;
	}
};