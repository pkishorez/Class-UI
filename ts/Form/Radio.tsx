import React, { useContext, useState } from 'react';
import { FormContext } from './index';
import ajv from 'ajv';
import { cx } from '../styles';
import { Radio as RadioComponent } from './Components/Radio';

interface IRadioProps {
	dataPath: string;
	label?: string;
	className?: string;
	optClassName?: string;
	inputProps?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
	options: { label?: string; value: string }[];
}
export const Radio = ({
	dataPath,
	className,
	optClassName,
	label = '',
	inputProps,
	options,
}: IRadioProps) => {
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
		<div className={className}>
			{label ?? <div>label</div>}
			{options.map((option, i) => (
				<label
					className={cx('flex items-center p-2 w-full', optClassName)}
					{...{ key: i }}
				>
					<RadioComponent
						className={cx(
							'outline-none border-2 border-solid border-gray-300 pr-2 text-gray-800'
						)}
						value={option.value}
						checked={value === option.value}
						ref={ref}
						onChange={e => {
							context.updateValue({
								dataPath,
								value: option.value,
							});
						}}
					/>
					<span
						className={cx('ml-2 flex-grow select-none', {
							'text-green-700': success && value === option.value,
						})}
					>
						{option.label}
					</span>
				</label>
			))}
		</div>
	);
};
Radio.displayName = 'Radio';
