import { IBaseComponentProps } from "classui/Components/Base";
import React = require("react");

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
