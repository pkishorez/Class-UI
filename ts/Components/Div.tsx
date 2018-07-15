import React = require("react");
import { IBaseComponentProps } from "./BaseComponent/index";

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
