import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';

export interface IProps {
	onSubmit?: Function,
	cls?: string
};
export interface IState {};


export class Form extends React.Component<IProps, IState> {
	private data: any = {};

	static childContextTypes = {
		send_value: propTypes.func,
		delete_value: propTypes.func
	};

	getChildContext()
	{
		return {
			send_value: (json: any)=>{
				this.data[json.key] = {
					value: json.value,
					error: json.error
				}
			},
			delete_value: (key: string) => {
				delete this.data[key];
			}
		};
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.submit = this.submit.bind(this);
		this.renderFormElements = this.renderFormElements.bind(this);
	}
	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let keys = Object.keys(this.data);
		for (let key in this.data){
			if (this.data[key].error) {
				console.error(`Error : ${this.data[key].error} on key : ${key}`);
				return;
			}
		}
		if (this.props.onSubmit)
			this.props.onSubmit(this.data);
	}

	getValue(data: any) {
		this.data[data.name] = data.value;
	}

	renderFormElements() {
		return this.props.children;
	}

	render() {
		return <form className={"form "+(this.props.cls?this.props.cls:"")} onSubmit={this.submit}>
			{this.renderFormElements()}
		</form>;
	}
}