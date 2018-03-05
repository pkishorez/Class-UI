import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {IJSONSchema, Schema} from './Schema';
import {FormElement} from './FormElement';
import * as classNames from 'classnames';
import * as _ from 'lodash';

export interface IProps {
	cls?: string
	style?: React.CSSProperties
	onSubmit?: Function
	default?: {
		[id: string]: any
	}
	schema?: IJSONSchema
	autocomplete?: "on" | "off"
};
export interface IState {};

interface IData {
	[id: string]: {
		ref: FormElement<any, any>
	}
};

export interface IFormContextType {
	initialize: (key: string, ref: any, func: (schema: IJSONSchema, defaultValue: any)=>void)=>void,
	delete_value: (key: string)=>void
}

export class Form extends React.Component<IProps, IState> {
	private formElemRefs: IData = {};

	static defaultProps = {
		autocomplete: "off"
	}

	static childContextTypes = {
		initialize: propTypes.func,
		delete_value: propTypes.func
	};

	getChildContext(): IFormContextType
	{
		return {
			initialize: (key, ref, func)=>{
				this.formElemRefs[key] = {
					ref
				};
				let jschema_key = "properties."+key.replace(/\./g, ".properties.");
				let pschema = _.get(this.props.schema, jschema_key);
				let defaultValue = _.get(this.props.default, key);
				if (func)
					func(pschema, defaultValue);
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
		let formData: any = {};
		let hasError = false;

		for (let key in this.formElemRefs){
			let ref = this.formElemRefs[key].ref;
			ref.validate(true);
			let data = ref.getValue();
			if (data.error) {
				hasError = true;
			}
			if (data.value) {
				formData = _.set(formData, key, data.value);
			}
		}
		if (!hasError && this.props.schema) {
			let errors = Schema.validate(this.props.schema, formData);
			if (errors) {
				console.error("Serious error in FORM. Please fix it.", errors);
			}
		}
		if (this.props.onSubmit && !hasError) {
			this.props.onSubmit(formData);
		}
	}

	render() {
		let cls = classNames("form", this.props.cls);
		return <form className={cls} style={{...this.props.style}} autoComplete={this.props.autocomplete} onSubmit={this.submit}>
			{this.props.children}
		</form>;
	}
}