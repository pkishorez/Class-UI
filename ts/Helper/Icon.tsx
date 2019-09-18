import React from "react";
import { cx } from "../styles";
import { css } from "linaria";

const icon = css`
	font-family: "Material Icons";
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	font-feature-settings: "liga";
	-webkit-font-feature-settings: "liga";
	-webkit-font-smoothing: antialiased;
`;
export const Icon = (props: {
	style?: React.CSSProperties;
	[id: string]: any;
}) => {
	return (
		<i {...props} className={cx(icon, props.className)}>
			{props.children}
		</i>
	);
};
