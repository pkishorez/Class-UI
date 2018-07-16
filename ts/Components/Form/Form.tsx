import { cx } from "classui/Emotion";
import * as _ from "lodash";
import * as React from "react";
import { FormElement } from "classui/Components/Form/FormElement";
import { IJSONSchema, Schema } from "classui/Components/Form/Schema";

export type IRegisterFunc = (
	schema: IJSONSchema | undefined,
	defaultValue: any
) => void;
export interface IFormContext {
	register: (
		key: string,
		ref: FormElement<any, any>,
		register: IRegisterFunc
	) => void;
	unregister: (key: string) => void;
}

export let FormContext = React.createContext<IFormContext>({} as any);

export interface IProps {
	className?: string;
	style?: React.CSSProperties;
	onSubmit?: (json: any) => void;
	onError?: (err: any) => void;
	default?: any;
	schema?: IJSONSchema;
	autocomplete?: "on" | "off";
}

export class Form extends React.Component<IProps> {
	static defaultProps = {
		autocomplete: "off"
	};

	private schema?: Schema;
	private formElemRefs: {
		key: string;
		ref: FormElement<any, any>;
	}[] = [];

	constructor(props: any) {
		super(props);
		if (this.props.schema) {
			this.schema = new Schema(this.props.schema);
		}
		this.submit = this.submit.bind(this);
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let fErrorRef: FormElement<any, any> | null = null;

		let formData: any = {};
		for (const formElem of this.formElemRefs) {
			const key = formElem.key;
			const ref = formElem.ref;

			const data = ref.getValue();
			ref.validate();
			if (data.error) {
				if (!fErrorRef) {
					fErrorRef = ref;
					ref.validate(true);
				}
			} else {
				formData = _.set(formData, key, data.value);
			}
		}
		if (this.props.onSubmit && !fErrorRef) {
			if (this.props.schema) {
				const error = Schema.validate(this.props.schema, formData);
				if (error) {
					this.props.onError && this.props.onError(error);
					return;
				}
			}
			this.props.onSubmit(formData);
		}
	}
	register: IFormContext["register"] = (
		key: string,
		ref: FormElement<any, any>,
		elementRegister: IRegisterFunc
	) => {
		this.formElemRefs = [
			...this.formElemRefs,
			{
				key,
				ref
			}
		];
		let pschema;
		if (this.props.schema) {
			pschema = Schema.getSchema(this.props.schema, key);
		}
		const defaultValue = _.get(this.props.default, key);
		if (elementRegister) {
			elementRegister(pschema, defaultValue);
		}
	};
	unregister(key: string) {
		this.formElemRefs = this.formElemRefs.filter(fe => fe.key !== key);
	}

	render() {
		const cls = cx(this.props.className);
		return (
			<FormContext.Provider
				value={{
					register: this.register.bind(this),
					unregister: this.unregister.bind(this)
				}}
			>
				<form
					className={cls}
					style={{ ...this.props.style }}
					autoComplete={this.props.autocomplete}
					onSubmit={this.submit}
				>
					{this.props.children}
				</form>
			</FormContext.Provider>
		);
	}
}
