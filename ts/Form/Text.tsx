import React, { useContext, useState, useEffect, useRef } from 'react';
import { FormContext } from './index';
import ajv from 'ajv';
import { cx } from '../styles';
import { TextField } from './Components/TextField';

interface ITextProps {
	label?: string;
	dataPath: string;
	type?: 'text' | 'password';
	defaultValue?: string;
	className?: string;
	inputProps?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
}
export const Text = ({
	dataPath,
	defaultValue,
	className,
	type = 'text',
	label,
}: ITextProps) => {
	const context = useContext(FormContext);
	const ref = useRef<HTMLInputElement>();
	const [value, setValue] = useState(defaultValue || '');
	const [error, setError] = useState<ajv.ErrorObject | null>();
	const [success, setSuccess] = useState<boolean | null>(null);
	context.register({
		ref: {
			setMeta: ({ error, focus, success }) => {
				focus && ref.current && ref.current.focus();
				setError(error);
				setSuccess(!!success);
			},
			setValue(value) {
				setValue(value);
			},
		},
		dataPath,
	});
	return (
		<div className={cx('mb-2', className)}>
			{label && <div>{label}</div>}
			<TextField
				error={!!error}
				success={!!success}
				ref={ref}
				onChange={e => {
					context.updateValue({
						dataPath,
						value: e.target.value,
					});
				}}
				value={value}
				type={type}
			/>
			{error && (
				<div className="text-red-800 pt-2 text-xs">{error.message}</div>
			)}
		</div>
	);
};
