import * as _ from "lodash";
import * as React from "react";

interface ICounterProps {
	number: number;
	height?: number | string;
	pad?: number;
	style?: React.CSSProperties;
}
export class Counter extends React.Component<ICounterProps> {
	render() {
		const { height, pad = 0, style } = this.props;
		const number = this.props.number + "";
		// const height = this.props.height || 40;
		// const number = this.props.number + "";
		// const padding = this.props.padding || 0;
		const digits = (pad > number.length
			? _.padStart(number, pad, "_")
			: number
		)
			.split("")
			.map((d, i) => <Digit key={i} digit={+d} />);
		return (
			<div
				style={{
					...style,
					display: "flex",
					position: "relative",
					overflow: "hidden",
					height: "1em",
					// border: "1px solid black",
					alignItems: "stretch"
				}}
			>
				{digits}
			</div>
		);
	}
}

const list_chars = [..._.range(10), ","];
const Digit = ({ digit, hidden }: { digit: number; hidden?: boolean }) => {
	const numbers = list_chars.map(n => (
		<div
			style={{
				display: "flex",
				height: "100%",
				alignItems: "center",
				justifyContent: "center"
			}}
			key={n}
		>
			{n}
		</div>
	));
	return (
		<div
			style={{
				transition: "transform 0.2s, opacity 0.3s",
				transform: `translate(0, calc(${-100.0 * digit}%)`,
				// backgroundColor: "rgba(0,0,0,0.1)",
				opacity: isNaN(digit) ? 0 : 1
			}}
		>
			{numbers}
		</div>
	);
};
