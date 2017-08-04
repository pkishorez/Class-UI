import * as React from 'react';

export interface ITextProps {
	name: string,
	send_value?: Function,
	autoFocus?: boolean
	_classui_form_capture?: boolean
};

export class Text extends React.Component<ITextProps, any> {

	private input: HTMLInputElement | null;
	static defaultProps = {
		autoFocus: false,
		_classui_form_capture: true
	};

	constructor() {
		super();
		this.state = {
			cls: ""
		};
		this.send = this.send.bind(this);
		this.sendToForm = this.sendToForm.bind(this);
	}

	send(val: string) {
		if (this.props.send_value){
			let json = {
				name: this.props.name,
				value: val
			};
			this.props.send_value(json);
		};
	}
	sendToForm(e: React.ChangeEvent<HTMLInputElement>) {
		this.send(e.target.value);
	}

	componentDidMount() {
		if (this.input) {
			this.send(this.input.value)
		}
	}

	render() {
		return <input type="text" autoFocus={this.props.autoFocus} autoComplete="off" ref={(ref)=>{this.input=ref}} spellCheck={false} name={this.props.name} placeholder="Enter text" onChange={this.sendToForm}/>
	}
};