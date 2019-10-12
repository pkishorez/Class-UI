import React, {
	useContext,
	useState,
	useEffect,
	useRef,
	useReducer,
} from 'react';
import { FormContext } from './index';
import { Icon } from '../Helper/Icon';
import { cx } from '../styles';
import { css } from 'linaria';

interface ISelectProps {
	dataPath: string;
	label?: any;
	defaultValue?: string;
	className?: string;
	inputProps?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
	options: { label?: string; value: string }[];
}
export const Select = ({
	dataPath,
	defaultValue,
	className,
	options,
	label,
}: ISelectProps) => {
	const context = useContext(FormContext);
	const ref = useRef<HTMLSelectElement>();
	const [value, setValue] = useState(defaultValue || '');
	const [status, setStatus] = useState<{
		error: null | boolean;
		success: boolean;
	}>({ error: null, success: false });
	const [showDropdown, toggleDropdown] = useState<boolean>(false);
	const contentClick = useRef<boolean>(false);
	useEffect(() => {
		const func = e => {
			if (!contentClick.current) {
				toggleDropdown(false);
			}
			contentClick.current = false;
		};
		window.addEventListener('click', func);
		return () => window.removeEventListener('click', func);
	}, []);
	context.register({
		ref: {
			setMeta: ({ error, focus, success }) => {
				focus && ref.current && ref.current.focus();
				setStatus({ error: !!error, success: !!success });
			},
			setValue(value) {
				setValue(value);
			},
		},
		dataPath,
	});
	return (
		<div
			className={cx(
				'relative',
				css`
					margin-bottom: 5px;
				`,
				className
			)}
		>
			<div
				onClick={e => {
					e.preventDefault();
					contentClick.current = true;
					toggleDropdown(!showDropdown);
				}}
				className={cx(
					'flex items-center px-2 py-1 rounded-sm bg-white border-2 border-solid border-gray-200 cursor-pointer hover:bg-gray-200',
					{
						'border-red-300': !!status.error,
					}
				)}
			>
				<div className="flex-grow">
					{value ? (
						label ? (
							<>
								<b>{label}</b> : {value}
							</>
						) : (
							value
						)
					) : (
						label || 'Select'
					)}
				</div>
				<Icon>expand_more</Icon>
			</div>
			<div
				onClick={e => {
					contentClick.current = true;
					e.preventDefault();
				}}
				className={cx(
					'absolute top-0 left-0 right-0 py-4 bg-white overflow-y-auto z-10 shadow-lg',
					css`
						transition: transform 0.2s, opacity 0.2s;
						border: 2px solid gray;
						border-radius: 5px;
						transform: scaleY(0);
						transform-origin: top;
						opacity: 0;
						&.active {
							opacity: 1;
							transform: scaleY(1);
						}
					`,
					{
						active: showDropdown,
					}
				)}
			>
				<h2 className="px-3 my-0 mb-2">{label || 'Select'}</h2>
				{options.map((option, i) => (
					<div
						className="px-3 py-2 hover:bg-teal-600 hover:text-white cursor-pointer"
						{...{ key: i }}
						onClick={e => {
							toggleDropdown(false);
							context.updateValue({
								dataPath,
								value: option.value,
							});
						}}
					>
						{option.label || option.value}
					</div>
				))}
			</div>
		</div>
	);
};
