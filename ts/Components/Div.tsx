import React from "react";
import { IBaseComponentProps } from "./Base";

export interface IDivProps extends IBaseComponentProps {
	children: any;
	others?: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>;
}
export let Div = (props: IDivProps) => {
	return <div>{props.children}</div>;
};
