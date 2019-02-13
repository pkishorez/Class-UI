import * as React from "react";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { cx, IThemeColors, styled } from "../Emotion";
import { BaseComponentProps, IBaseComponentProps } from "./Base";

export interface IButtonProps extends IBaseComponentProps {
	children?: any;
	active?: boolean;
	disable?: boolean;
	primary?: boolean;
	flat?: boolean;
}
const EButton = styled("div")`
	user-select: none;
	padding: 10px;
	cursor: pointer;
	display: flex;
	align-items: center;
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
			cursor: default;
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
	&.flat {
		background-color: inherit;
		color: inherit;
		&.active,
		&:active,
		&:hover {
			background-color: #dddddd;
			/* color: ${(p: IThemeColors)=>p.theme.color} */
		}
	}

	${(p: { theme: IThemeColors }) => `
	&.primary {
		background-color: ${p.theme.color};
		color: ${p.theme.contrast};
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
				primary: !!props.primary,
				disable: !!props.disable,
				flat: !!props.flat
			})}
		>
			{props.children}
		</EButton>
	);
};
const _NavButton = (
	props: IButtonProps & RouteComponentProps<any> & { to: string }
) => {
	const match = matchPath(props.location.pathname, {
		path: props.to
	});
	return (
		<Button
			{...props}
			active={!!(match && match.isExact)}
			onClick={(e: any) => {
				props.onClick && props.onClick(e);
				props.history.push(props.to);
			}}
		>
			{props.children}
		</Button>
	);
};

export const NavButton = withRouter(_NavButton);
