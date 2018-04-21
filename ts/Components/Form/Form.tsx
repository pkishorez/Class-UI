import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {IJSONSchema, Schema} from './Schema';
import {FormElement} from './FormElement';
import * as _ from 'lodash';
import {cx} from 'classui/Emotion/index';

type IRegisterFunc = (schema: IJSONSchema|undefined, defaultValue: any)=>void;
export interface IFormContext {
	register: (key: string, ref: FormElement<any, any>, register: IRegisterFunc)=>void,
	unregister: (key: string)=>void
}

export let FormContext = React.createContext<IFormContext>({} as any);

export interface IProps {
	className?: string
	style?: React.CSSProperties
	onSubmit?: Function
	onError?: Function
	default?: any
	schema?: IJSONSchema
	autocomplete?: "on" | "off"
};
export interface IState {};

export class Form extends React.Component<IProps, IState> {
	private schema?: Schema;
	private formElemRefs: {
		key: string,
		ref: FormElement<any, any>
	}[] = [];

	static defaultProps = {
		autocomplete: "off"
	}

	constructor(props: any) {
		super(props);
		if (this.props.schema)
			this.schema = new Schema(this.props.schema);
		this.submit = this.submit.bind(this);
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let formData: any = {};

		let fErrorRef: FormElement<any, any>|undefined = undefined;

		for (let formElem of this.formElemRefs){
			let key = formElem.key;
			let ref = formElem.ref;

			let data = ref.getValue();
			ref.validate();
			if (data.error) {
				if (!fErrorRef) {
					fErrorRef = ref;
					ref.validate(true);
				}
			}
			else {
				formData = _.set(formData, key, data.value);
			}
		}
		if (this.props.onSubmit && !fErrorRef) {
			if (this.props.schema){
				let error = Schema.validate(this.props.schema, formData);
				if (error) {
					this.props.onError && this.props.onError(error);
					return;
				}
			}
			this.props.onSubmit(formData);
		}
	}
	register: IFormContext["register"] = (key: string, ref: FormElement<any, any>, elementRegister: IRegisterFunc) => {
		this.formElemRefs = [
			...this.formElemRefs, {
				key: key,
				ref: ref
			}
		];
		let pschema = undefined;
		if (this.props.schema) {
			pschema = Schema.getSchema(this.props.schema?this.props.schema:{}, key);
		}
		let defaultValue = _.get(this.props.default, key);
		if (elementRegister)
			elementRegister(pschema, defaultValue);
	}
	unregister(key: string) {
		this.formElemRefs = this.formElemRefs.filter(fe=>fe.key!=key);
	}

	render() {
		let cls = cx(this.props.className);
		return <FormContext.Provider value={{
			register: this.register.bind(this),
			unregister: this.unregister.bind(this)
		}}>
			<form className={cls} style={{...this.props.style}} autoComplete={this.props.autocomplete} onSubmit={this.submit}>
				{this.props.children}
			</form>
		</FormContext.Provider>;
	}
}