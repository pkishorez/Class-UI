import * as React from "react";
import { v4 } from "uuid";
import { Drawer, IDrawerProps } from "./_Drawer";
import { Feedback } from "./_Feedback";
import { Flash, IFlashProps } from "./_Flash";

export interface IProps {}

export interface IState {
	overlays: {
		id: string;
		component: any;
	}[];
}

export interface IOverlayProps {
	remove: () => void;
}

let _instance: Overlay | null = null;
export class Overlay extends React.Component<IProps, IState> {
	static flash(options: IFlashProps) {
		if (!_instance) {
			console.error("Overlay component should be rendered to use it.");
			return;
		}
		const id = v4();
		_instance.overlay(
			id,
			<Flash
				{...options}
				key={id}
				ref={r => (r = r)}
				remove={() => {
					Overlay.removeOverlay(id);
				}}
			/>
		);
	}
	static drawer(options: IDrawerProps) {
		if (!_instance) {
			console.error("Overlay component should be rendered to use it.");
			return;
		}
		const id = v4();
		_instance.overlay(
			id,
			<Drawer
				{...options}
				key={id}
				ref={r => (r = r)}
				remove={() => {
					Overlay.removeOverlay(id);
				}}
			/>
		);
	}

	static feedback: typeof Feedback["show"] = (
		content: string,
		type = "success",
		timeout = 2
	) => {
		Feedback.show(content, type, timeout);
	};

	private static removeOverlay(id: string) {
		if (!_instance) {
			return;
		}
		_instance.removeOverlay(id);
	}
	constructor(props: IProps, context: any) {
		super(props, context);
		_instance = this;
		this.state = {
			overlays: []
		};
	}
	removeOverlay(id: string) {
		this.setState({
			overlays: this.state.overlays.filter(o => o.id !== id)
		});
	}
	overlay(id: string, component: any) {
		this.setState({
			overlays: [
				...this.state.overlays,
				{
					id,
					component
				}
			]
		});
	}
	componentWillUnmount() {
		_instance = null;
	}

	render() {
		// Render all child Overlay components here.
		return <>{this.state.overlays.map(o => o.component)}</>;
	}
}
