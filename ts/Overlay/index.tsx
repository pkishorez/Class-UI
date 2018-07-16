import { Drawer, IDrawerProps } from "classui/Overlay/_Drawer";
import { Feedback } from "classui/Overlay/_Feedback";
import { Flash, IFlashProps } from "classui/Overlay/_Flash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { v4 } from "uuid";

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
		let id = v4();
		let fref: any;
		_instance.overlay(
			id,
			<Flash
				{...options}
				key={id}
				ref={r => (fref = r)}
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
		let id = v4();
		let dref: any;
		_instance.overlay(
			id,
			<Drawer
				{...options}
				key={id}
				ref={r => (dref = r)}
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
	removeOverlay(id: string) {
		this.setState({
			overlays: this.state.overlays.filter(o => o.id != id)
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
	constructor(props: IProps, context: any) {
		super(props, context);
		_instance = this;
		this.state = {
			overlays: []
		};
	}

	render() {
		// Render all child Overlay components here.
		return <>{this.state.overlays.map(o => o.component)}</>;
	}
}
