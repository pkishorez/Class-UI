import React, { useState, useEffect, useRef } from "react";
import { IJSONSchema, Schema } from "./Schema";
import ajv from "ajv";
import jsonptr from "json-ptr";

interface IFormElement {
	setMeta: (
		val: Partial<{
			isTouched: boolean;
			error: ajv.ErrorObject | null;
			success: boolean;
			focus: boolean;
			value?: any;
		}>
	) => void;
}

interface IFormContext {
	updateValue: (val: { dataPath: string; value: any }) => void;
	register: (val: { ref: IFormElement; dataPath: string }) => void;
}
export const FormContext = React.createContext<IFormContext>({
	updateValue: ({}) => ({}),
	register: ({}) => {}
});

export interface IFormProps {
	schema: IJSONSchema;
	autoComplete?: string;
	className?: string;
	defaultValue?: any;
	onChange?: (data: IFormData) => void;
	onSubmit?: (data: IFormData) => void;
	onError?: (errors: ajv.ErrorObject[]) => void;
	formProps?: any;
}
interface IFormData {
	[key: string]: string | number;
}
export const Form: React.SFC<IFormProps> = props => {
	let compiledSchema = useRef<Schema>();
	let formData = useRef<{}>(props.defaultValue || {});
	const elementRefs = useRef<{
		[dataPath: string]:
			| { ref: IFormElement; isTouched: boolean }
			| undefined;
	}>({});

	useEffect(() => {
		compiledSchema.current = new Schema(props.schema);
		compiledSchema.current.validate(formData.current);
		Object.keys(elementRefs.current).forEach(dataPath => {
			const elemRef = elementRefs.current[dataPath];
			elemRef &&
				elemRef.ref.setMeta({
					isTouched: false,
					focus: false,
					error: null,
					success: false,
					value: jsonptr.get(formData.current, dataPath)
				});
		});
	}, []);

	const providerValue: IFormContext = {
		updateValue({ dataPath, value }) {
			jsonptr.set(formData.current, dataPath, value, true);
			const errors =
				compiledSchema.current &&
				compiledSchema.current.validate(formData.current);
			const elemRef = elementRefs.current[dataPath];
			elemRef && (elemRef.isTouched = true);
			elemRef &&
				elemRef.ref.setMeta({
					error: null,
					success: true,
					focus: false,
					value
				});

			props.onChange &&
				formData.current &&
				props.onChange(formData.current);

			Object.keys(elementRefs.current).forEach(key => {
				const elemRef = elementRefs.current[key];
				elemRef &&
					elemRef.isTouched &&
					elemRef.ref.setMeta({
						error: null,
						success: true
					});
			});
			if (errors) {
				// Broadcast errors to all elements.
				console.log("ERRORS : ", errors);
				errors.forEach(error => {
					const elemRef = elementRefs.current[error.dataPath];
					elemRef &&
						elemRef.isTouched &&
						elemRef.ref.setMeta({
							error,
							success: false,
							focus: false
						});
				});
			}
		},
		register({ ref, dataPath }) {
			elementRefs.current[dataPath] = { ref, isTouched: false };
		}
	};
	const validate = (error: ajv.ErrorObject, focus = true) => {
		const elRef = elementRefs.current[error.dataPath];
		console.log(error, focus, elRef);
		elRef &&
			elRef.ref.setMeta({
				error,
				focus,
				success: false,
				value: jsonptr.get(formData.current, error.dataPath)
			});
	};

	const validateAll = (focus = true) => {
		const errors =
			compiledSchema.current &&
			compiledSchema.current.validate(formData.current);
		let focussed = false;
		if (errors) {
			if (focus) {
				errors.forEach(err => {
					validate(err, !focussed && true);
					focussed = true;
				});
			}
			return errors;
		} else {
			return null;
		}
	};
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errors = validateAll(true);
		if (errors) {
			props.onError && props.onError(errors);
		} else {
			props.onSubmit &&
				formData.current &&
				props.onSubmit(formData.current);
		}
	};
	return (
		<form
			{...props.formProps}
			className={props.className}
			onSubmit={onSubmit}
			autoComplete={props.autoComplete}
		>
			<FormContext.Provider value={providerValue}>
				{props.children}
			</FormContext.Provider>
		</form>
	);
};
