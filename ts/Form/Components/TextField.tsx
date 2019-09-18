import React, { forwardRef } from "react";
import { cx } from "classui/styles";

type IInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & { error?: boolean; success?: boolean };

export const TextField = forwardRef(
	({ error, success, className, ...props }: IInputProps, ref: any) => {
		return (
			<input
				{...props}
				ref={ref}
				className={cx(
					"outline-none border-b-2 border-solid pt-2 pb-1 w-full text-sm",
					{
						"border-red-700 focus:border-red-700": !!error,
						"border-green-700 focus:border-green-700": success,
						"border-gray-400 focus:border-gray-900": !!!error
					},
					className
				)}
			/>
		);
	}
);
