import React, { useState, useEffect, useRef } from 'react';
import { IJSONSchema, Schema } from './Schema';
import ajv from 'ajv';
import jsonptr from 'json-ptr';
import cloneDeep from 'lodash-es/cloneDeep';

interface IFormElement {
	setMeta: (
		val: Partial<{
			isTouched: boolean;
			error: ajv.ErrorObject | null;
			success: boolean;
			focus: boolean;
		}>
	) => void;
	setValue: (val: any) => void;
}

interface IFormContext {
	updateValue: (val: { dataPath: string; value: any }) => void;
	register: (val: { ref: IFormElement; dataPath: string }) => void;
}
export const FormContext = React.createContext<IFormContext>({
	updateValue: ({}) => ({}),
	register: ({}) => {},
});

export interface IFormProps {
	schema: IJSONSchema;
	autoComplete?: string;
	className?: string;
	defaultValue?: any;
	value?: any;
	onChange?: (data: IFormData) => void;
	onSubmit?: (data: IFormData) => void;
	onError?: (errors: ajv.ErrorObject[]) => void;
	formProps?: any;
	formRef?: any;
}
interface IFormData {
	[key: string]: string | number;
}
export class Form extends React.Component<IFormProps, any> {
	compiledSchema?: Schema;
	formData: any = {};
	elementRefs: {
		[dataPath: string]:
			| { ref: IFormElement; isTouched: boolean }
			| undefined;
	} = {};
	constructor(props) {
		super(props);
		this.formData = props.defaultValue || {};
	}
	componentDidMount() {
		this.compiledSchema = new Schema(this.props.schema);
		this.compiledSchema.validate(this.formData);
		Object.keys(this.elementRefs).forEach(dataPath => {
			const elemRef = this.elementRefs[dataPath];
			elemRef &&
				elemRef.ref.setMeta({
					isTouched: false,
					focus: false,
					error: null,
					success: false,
				});
		});
		this.refreshForm();
	}
	componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			this.refreshForm();
		}
	}
	refreshForm() {
		const formData = this.isControlledComponent
			? this.props.value
			: this.formData;
		const errors =
			this.compiledSchema && this.compiledSchema.validate(formData);

		// Reset all elements.
		Object.keys(this.elementRefs).forEach(key => {
			const elemRef = this.elementRefs[key];
			elemRef &&
				(elemRef.ref.setValue(jsonptr.get(formData, key)),
				elemRef.isTouched &&
					elemRef.ref.setMeta({
						error: null,
						success: true,
						focus: false,
					}));
		});
		if (errors) {
			// Broadcast errors to all elements.
			console.log('ERRORS : ', errors);
			errors.forEach(error => {
				const elemRef = this.elementRefs[error.dataPath];
				elemRef &&
					elemRef.isTouched &&
					elemRef.ref.setMeta({
						error,
						success: false,
						focus: false,
					});
			});
		}
	}

	get isControlledComponent() {
		const { value } = this.props;
		if (value === undefined) {
			return false;
		}
		return true;
	}
	get providerValue(): IFormContext {
		const { value, onChange } = this.props;
		return {
			updateValue: ({ dataPath, value: v }) => {
				const { onChange } = this.props;
				if (!this.isControlledComponent) {
					jsonptr.set(this.formData, dataPath, v, true);
					onChange && onChange(this.formData);
				} else {
					const clone = cloneDeep(value);
					jsonptr.set(clone, dataPath, v, true);
					onChange && onChange(clone);
				}
				const elemRef = this.elementRefs[dataPath];
				elemRef && (elemRef.isTouched = true);
				if (!this.isControlledComponent) {
					this.refreshForm();
				}
			},
			register: ({ ref, dataPath }) => {
				this.elementRefs[dataPath] = { ref, isTouched: false };
			},
		};
	}

	validate = (error: ajv.ErrorObject, focus = true) => {
		const elRef = this.elementRefs[error.dataPath];
		elRef &&
			elRef.ref.setMeta({
				error,
				focus,
				success: false,
			});
	};
	validateAll = (focus = true) => {
		const errors =
			this.compiledSchema && this.compiledSchema.validate(this.formData);
		let focussed = false;
		if (errors) {
			if (focus) {
				errors.forEach(err => {
					this.validate(err, !focussed && true);
					focussed = true;
				});
			}
			return errors;
		} else {
			return null;
		}
	};
	onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const { onError, onSubmit, value } = this.props;
		e.preventDefault();
		const errors = this.validateAll(true);
		if (errors) {
			onError && onError(errors);
		} else {
			onSubmit &&
				onSubmit(this.isControlledComponent ? value : this.formData);
		}
	};
	render() {
		const { formProps, className, autoComplete, children } = this.props;
		return (
			<form
				{...formProps}
				className={className}
				onSubmit={this.onSubmit}
				autoComplete={autoComplete}
			>
				<FormContext.Provider value={this.providerValue}>
					{children}
				</FormContext.Provider>
			</form>
		);
	}
}
