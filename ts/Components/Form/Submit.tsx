import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { css, cx, Hoverable } from "classui/Emotion";
import * as React from "react";

export interface ISubmitProps extends IBaseComponentProps {
	disabled?: boolean;
	value?: string;
}
export let Submit = (props: ISubmitProps) => {
	return (
		<input
			type="submit"
			{...BaseComponentProps(props)}
			className={cx(
				css`
					padding: 10px;
					background-color: #eeeeee;
				`,
				Hoverable({
					disable: props.disabled
				}),
				props.className
			)}
			value={props.value}
		/>
	);
};
