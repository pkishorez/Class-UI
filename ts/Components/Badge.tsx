import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { css, cx, IPColors, PColors } from "classui/Emotion";
import * as React from "react";
import { HTMLProps } from "react";

export interface IBadgeProps extends IBaseComponentProps {
	type?: keyof (IPColors);
	children: any;
	extend?: HTMLProps<any>;
}

const badgeCSS = css`
	display: inline-block;
	padding: 7px 10px;
	cursor: default;
	color: white;
	transition: all 0.4s;
`;
export let Badge = (props: IBadgeProps) => {
	const { type="success", children, ...eProps } = props;
	return (
		<div
			{...BaseComponentProps(props)}
			className={cx(badgeCSS, props.className)}
			style={{
				...props.style,
				backgroundColor: PColors[type]
			}}
		>
			{children}
		</div>
	);
};
