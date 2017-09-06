import * as React from 'react';
import * as _ from 'lodash';
import * as propTypes from 'prop-types';

export interface ITextProps {
	name: string,
	autoFocus?: boolean
	type?: "number" | "text" | "url" | "email" | RegExp | "inlist"
	inList?: string[],
	minSize?: number,
	maxSize?: number
};

export class Text extends React.Component<ITextProps, any> {

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
		if (this.context.send_value){
			let json = {
				key: this.props.name,
				value: (this.props.type=="number")?parseInt(val):val,
				error: this.validate(val)
			};
			this.context.send_value(json);
		};
	}
	sendToForm(e: React.ChangeEvent<HTMLInputElement>) {
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

	componentWillUnmount() {
		if (this.context.delete_value)
		{
			this.context.delete_value(this.props.name);
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