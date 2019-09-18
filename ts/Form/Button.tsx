import React from "react";
import cx from "../styles";
import { css } from "linaria";

interface IButtonProps {
	className?: string;
	submit?: true;
}
export const Button: React.SFC<IButtonProps> = ({
	className,
	children,
	submit
}) => {
	return (
		<button
			type={submit ? "submit" : "button"}
			className={cx(
				"px-2 border-transparent focus:bg-gray-700 focus:text-white focus:outline-none hover:border-gray-900 border-2 border-solid focus:border-transparent border-gray-500",
				css`
					padding: 5px 7px;
				`,
				className
			)}
		>
			{children || "Submit"}
		</button>
	);
};
