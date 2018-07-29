import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { cx, IThemeColors, styled } from "classui/Emotion";
import * as React from "react";

export interface IButtonProps extends IBaseComponentProps {
	children?: any;
	active?: boolean;
	disable?: boolean;
	primary?: boolean;
}
const EButton = styled("div")`
	user-select: none;
	padding: 10px;
	cursor: pointer;
	display: inline-block;
	background-color: #eeeeee;
	&:hover {
		background-color: #dddddd;
	}
	&:active {
		background-color: #cccccc;
	}
	&.active {
		&,
		&:hover {
			background-color: #dddddd;
		}
	}
	&.disable {
		&,
		&:hover,
		&:active {
			cursor: default;
			color: grey;
			background-color: #eeeeee;
		}
	}
	.__navbar__ & {
		background-color: inherit;
		&:hover {
			background-color: ${(p: IThemeColors) => p.theme.colorDark};
		}
		&.active,
		&:active {
			background-color: ${(p: IThemeColors) => p.theme.colorDark};
		}
	}

	${(p: IThemeColors) => `
	&.primary {
		//background-color: ${p.theme.color};
		//color: black;
		&:hover {
			color: ${p.theme.contrast};
			background-color: ${p.theme.colorLight};
		}
		&:active, &.active {
			color: ${p.theme.contrast};
			background-color: ${p.theme.color};
		}
		&.disable {
			&, &:hover, &:active{
			cursor: default;
			color: grey;
			background-color: ${p.theme.colorLight}
		}
	}`};
`;

export const Button = (props: IButtonProps) => {
	return (
		<EButton
			{...BaseComponentProps(props)}
			className={cx(props.className, {
				active: !!props.active,
				disable: !!props.disable
			})}
		>
			{props.children}
		</EButton>
	);
};
