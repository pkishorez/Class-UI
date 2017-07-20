import * as React from 'react';

export interface ITextProps {
	name: string,
	send_value?: Function,
	__classui_form_capture?: boolean
};

export class Text extends React.Component<ITextProps, any> {

	static defaultProps = {
		__classui_form_capture: true
	};

	constructor() {
		super();
		this.state = {
			cls: ""
		};
		this.sendToForm = this.sendToForm.bind(this);
		this.validate = this.validate.bind(this);
	}

	sendToForm(e: React.ChangeEvent<HTMLInputElement>) {
		if (this.props.send_value){
			let json = {
				name: this.props.name,
				value: e.target.value
			};
			this.props.send_value(json);
		}
	}
	validate() {

	}

	render() {
		return <input type="text" autoComplete="off" spellCheck={false} name={this.props.name} placeholder="Enter text" onChange={this.sendToForm}/>
	}
};