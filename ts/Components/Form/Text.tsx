import * as React from 'react';
import * as _ from 'lodash';

export interface ITextProps {
	name: string,
	autoFocus?: boolean
	type?: "number" | "text" | "url" | "email" | RegExp | "inlist"
	inList?: string[],
	minSize?: number,
	maxSize?: number

	send_value?: Function
	report?: Function
};

export class Text extends React.Component<ITextProps, any> {

	private input: HTMLInputElement | null;
	static defaultProps = {
		autoFocus: false,
		type: "text"
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
				value: (this.props.type=="number")?parseInt(val):val,
				error: this.validate(val)
			};
			this.props.send_value(json);
		};
	}
	sendToForm(e: React.ChangeEvent<HTMLInputElement>) {
		if (this.props.report) {
			this.props.report({
				error: this.validate(e.target.value)
			});
		}
		this.send(e.target.value);
	}

	validate(text: string): string | null {
		switch(this.props.type) {
			case "email": {
				let regex = "";
				break;
			}
			case "number": {
				break;
			}
			case "inlist": {
				if (!_.includes(this.props.inList, text)){
					return `Should be one of (${this.props.inList})`;
				}
				break;
			}
		}
		if ((this.props.minSize && text.length<this.props.minSize) || (this.props.maxSize && text.length>this.props.maxSize)) {
			return `Len : (${this.props.minSize?this.props.minSize:0} and ${this.props.maxSize?this.props.maxSize:'any'})`;
		}
		return null;
	}

	componentDidMount() {
		if (this.input) {
			this.send(this.input.value)
		}
	}

	render() {
		return <input type="text" 
			autoFocus={this.props.autoFocus}
			autoComplete="off"
			ref={(ref)=>{this.input=ref}}
			spellCheck={false}
			name={this.props.name}
			placeholder="Enter a value"
			onChange={this.sendToForm}
		/>;
	}
};