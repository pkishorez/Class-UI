import { css, cx, Hoverable } from "classui/Emotion/index";
import * as React from "react";

export interface ISubmitProps
	extends React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		> {
	disabled?: boolean;
}
export let Submit = (props: ISubmitProps) => {
	return (
		<input
			type="submit"
			className={cx(
				css`
					padding: 10px;
					background-color: #eeeeee;
				`,
				Hoverable({
					disable: props.disabled
				})
			)}
		/>
	);
};
