import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';

export interface IProps {
	cls?: string
	onSubmit?: Function	
	autocomplete?: "on" | "off"
};
export interface IState {};

interface IData {
	[id: string]: {
		ref: FormElement<any, any>
	}
};
export class Form extends React.Component<IProps, IState> {
	private formElemRefs: IData = {};

	static defaultProps = {
		autocomplete: "off"
	}

	static childContextTypes = {
		initialize: propTypes.func,
		delete_value: propTypes.func
	};

	getChildContext()
	{
		return {
			initialize: (key: string, ref: any)=>{
				this.formElemRefs[key] = {
					ref
				};
			},
			delete_value: (key: string) => {
				delete this.formElemRefs[key];
			}
		};
	}

	constructor(props: any, context: any) {
		super(props, context);
		this.submit = this.submit.bind(this);
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let keys = Object.keys(this.formElemRefs);
		let formData: any = {};
		let hasError = false;

		for (let key in this.formElemRefs){
			let ref = this.formElemRefs[key].ref;
			ref.validate();
			let data = ref.getValue();
			if (data.error) {
				hasError = true;
			}
			if (data.value || data.value=="")
				formData[key]=data.value;
		}
		if (this.props.onSubmit && !hasError)
			this.props.onSubmit(formData);
	}

	render() {
		return <form className={"form "+(this.props.cls?this.props.cls:"")} autoComplete={this.props.autocomplete} onSubmit={this.submit}>
			{this.props.children}
		</form>;
	}
}