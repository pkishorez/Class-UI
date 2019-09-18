import React, { useContext, useState, useEffect } from "react";
import { FormContext } from "./index";
import ajv from "ajv";
import { Icon } from "../Helper/Icon";
import { cx } from "../styles";
import { css } from "linaria";

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
	label
}: ISelectProps) => {
	const context = useContext(FormContext);
	const ref = React.createRef<HTMLSelectElement>();
	const [value, setValue] = useState(defaultValue || "");
	const [error, setError] = useState<ajv.ErrorObject | null>();
	const [success, setSuccess] = useState<boolean | null>(null);
	const [showDropdown, toggleDropdown] = useState<boolean>(false);
	useEffect(() => {
		const func = e => {
			console.log("CALLING");
			toggleDropdown(false);
		};
		console.log("REGISTER");
		window.addEventListener("click", func);
		return () => window.removeEventListener("click", func);
	}, []);
	context.register({
		ref: {
			setMeta: ({ error, focus, success, value }) => {
				focus && ref.current && ref.current.focus();
				setError(error);
				setSuccess(!!success);
				value && setValue(value);
			}
		},
		dataPath
	});
	return (
		<div
			className={cx(
				"relative",
				css`
					margin-bottom: 5px;
				`,
				className
			)}
		>
			<div
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					toggleDropdown(!showDropdown);
				}}
				className={cx(
					"flex items-center px-2 py-1 rounded-sm bg-white border-2 border-solid border-gray-200 cursor-pointer hover:bg-gray-200",
					{
						"border-red-300": !!error
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
						label || "Select"
					)}
				</div>
				<Icon>expand_more</Icon>
			</div>
			{showDropdown && (
				<div
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
					}}
					className="absolute top-0 left-0 right-0 bg-white border-2 border-solid border-gray-400 overflow-y-auto z-10 "
				>
					<h3 className="px-3">{label || "Select"}</h3>
					{options.map((option, i) => (
						<div
							className="px-3 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
							{...{ key: i }}
							onClick={e => {
								toggleDropdown(false);
								context.updateValue({
									dataPath,
									value: option.value
								});
							}}
						>
							{option.label || option.value}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
