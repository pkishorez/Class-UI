import * as React from "react";

export interface IOverlayProps {}

export interface IOverlayState {
	overlays: {
		id: string;
		component: any;
	}[];
}

let _instance: Overlay | null = null;
export class Overlay extends React.Component<IOverlayProps, IOverlayState> {
	static getChild() {
		if (Overlay.ref) {
			// Ref is mounted. Cool :)
			const domNode = document.createElement("div");
			Overlay.ref.appendChild(domNode);
			return domNode;
		}
		return null;
	}
	static removeChild(child: any) {
		if (Overlay.ref && child) {
			Overlay.ref.removeChild(child);
		}
	}
	private static ref: HTMLDivElement | null = null;
	private static getRef = (ref: HTMLDivElement | null) => {
		Overlay.ref = ref;
		console.log("OVERLAY REF : ", ref);
	};

	constructor(props: IOverlayProps) {
		super(props);
		if (_instance) {
			console.error("Overlay component should be rendered only once.");
			return;
		}
		_instance = this;
	}
	render() {
		return <div ref={Overlay.getRef} />;
	}
}
