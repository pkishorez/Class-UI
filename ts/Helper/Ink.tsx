import React, { createRef, useState, version } from "react";
import { v4 } from "uuid";
import { css } from "../Emotion/index";

console.log(version);
type IRipples = {
	id: string;
	x: number;
	y: number;
	dim: number;
}[];
const rippleCls = css`
	animation: ripple 1000ms forwards;
	position: absolute;
	opacity: 0.75;
	background-color: white;
	transform: scale(0);
	border-radius: 100%;

	@keyframes ripple {
		to {
			opacity: 0;
			transform: scale(2);
		}
	}
`;
export function Ink() {
	const [ripples, updateRipples]: [IRipples, any] = useState([]);
	const ref = createRef<HTMLDivElement>();
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflow: "hidden"
			}}
			onClick={e => {
				const r = ref.current;
				if (!r) {
					return;
				}
				const width = r.offsetWidth;
				const height = r.offsetHeight;
				const dims = r.getBoundingClientRect();
				const max = Math.max(dims.width, dims.height);
				const x = e.pageX - dims.left - max / 2;
				const y = e.pageY - dims.top - max / 2;
				const id = v4();
				updateRipples([
					...ripples,
					{
						id,
						x,
						y,
						dim: Math.max(dims.width, dims.height)
					}
				]);
			}}
		>
			{ripples.map(ripple => {
				return (
					<div
						className={rippleCls}
						key={ripple.id}
						style={{
							left: ripple.x,
							top: ripple.y,
							height: ripple.dim,
							width: ripple.dim
						}}
						onAnimationEnd={() => {
							updateRipples(
								ripples.filter(r => r.id !== ripple.id)
							);
						}}
					/>
				);
			})}
		</div>
	);
};
