import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';
import {IPropSchema, Validate} from './Schema';

export interface ITextProps {
	name: string,
	type?: "text" | "password"
	autoFocus?: boolean
	schema?: IPropSchema
	onError?: Function
	children: string
};
export interface ITextState {
	cls: string
};

export class Text extends React.Component<ITextProps, ITextState> {

	private input: HTMLInputElement | null;
	static defaultProps = {
		autoFocus: false,
		type: "text"
	};

	static contextTypes = {
		send_value: propTypes.func,
		delete_value: propTypes.func
	}

	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			cls: ""
		};
		this.send = this.send.bind(this);
		this.sendToForm = this.sendToForm.bind(this);
	}

	send(val: string) {
		let error = this.validate(val);
		if (this.context.send_value){
			let json = {
				key: this.props.name,
				value: val,
				error: error
			};
			this.context.send_value(json);
		};
	}
	sendToForm(e: React.ChangeEvent<HTMLInputElement>) {
		this.send(e.target.value);
		(this.props.onError && this.props.onError(this.validate(e.target.value)));
	}

	validate(text: string): string | null {
		return Validate(this.props.schema, text);
	}

	componentDidMount() {
		if (this.input) {
			this.send(this.input.value)
		}
	}

	componentWillUnmount() {
		if (this.context.delete_value)
		{
			this.context.delete_value(this.props.name);
		}
	}

	render() {
		return <input type={this.props.type} 
			autoFocus={this.props.autoFocus}
			autoComplete="off"
			ref={(ref)=>{this.input=ref}}
			spellCheck={false}
			name={this.props.name}
			placeholder={this.props.children || "Enter a value"}
			onChange={this.sendToForm}
		/>;
	}
};