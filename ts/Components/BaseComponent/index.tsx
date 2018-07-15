import * as React from "react";
export { cardClasses } from "./Card";

export interface IBaseComponentProps {
	style?: React.CSSProperties;
	className?: string;
	onClick?: (e: any) => any;
	onDblClick?: (e: any) => any;
}

export const BaseComponentProps = (props: Partial<IBaseComponentProps>) => {
	const { style, className, onClick, onDblClick } = props;
	return {
		className,
		onClick,
		onDoubleClick: onDblClick,
		style
	};
};
