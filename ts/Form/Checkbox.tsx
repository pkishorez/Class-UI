import React, { useContext, useState } from 'react';
import { FormContext } from './index';
import { cx } from '../styles';
import ajv from 'ajv';

interface ICheckboxProps {
	dataPath: string;
	label?: string;
	className?: string;
	inputProps?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
}
export const Checkbox = ({
	dataPath,
	className,
	label = '',
	inputProps,
}: ICheckboxProps) => {
	const context = useContext(FormContext);
	const ref = React.createRef<HTMLInputElement>();
	const [value, setValue] = useState();
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
		<label className={cx('mb-2 flex items-center p-2', className)}>
			<input
				{...inputProps}
				type="checkbox"
				className={cx(
					'outline-none border-2 border-solid border-gray-300 pr-2 text-gray-800'
				)}
				checked={value}
				ref={ref}
				onChange={e => {
					context.updateValue({
						dataPath,
						value: e.target.checked,
					});
				}}
			/>
			<span
				className={cx('ml-2 flex-grow select-none', {
					'text-red-700': !!error,
					'text-green-700': success,
				})}
			>
				{label}
			</span>
		</label>
	);
};
Checkbox.displayName = 'Checkbox';
