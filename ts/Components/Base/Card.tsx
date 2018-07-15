import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import * as React from "react";

export interface ICardProps extends IBaseComponentProps {
	card?: "1" | "2" | "3" | "4" | "5";
	children: any;
}

export let cardClasses = {
	"0": `border: 1px solid #DDDDDD;`,
	"1": `box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);`,
	"2": `box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);`,
	"3": `box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);`,
	"4": `box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);`,
	"5": `box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);`
};
export let cardStyles = {
	"0": `1px solid #DDDDDD`,
	"1": `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)`,
	"2": `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`,
	"3": `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)`,
	"4": `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`,
	"5": `0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)`
};

export const Card = (props: ICardProps) => {
	return (
		<div
			{...BaseComponentProps(props)}
			style={{
				backgroundColor: "white",
				boxShadow: cardStyles[props.card ? props.card : "1"],
				padding: 10,
				...props.style
			}}
		>
			{props.children}
		</div>
	);
};
