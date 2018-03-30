import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {styled} from 'classui/Emotion/index';

export interface IFloaterProps {};
export interface IFloaterState {
	children?: ()=>JSX.Element
};

let EFloater = styled('div')`
	position: fixed;
	top: 0px;
	left: 0px;
`;

let _instance: Floater|undefined = undefined;

let FloaterRef: HTMLDivElement | null;
export class Floater extends React.Component<IFloaterProps, IFloaterState> {
	static _render: boolean;
	static children: IFloaterState["children"];
	constructor(props: IFloaterProps) {
		super(props);
		_instance = this;
		this.state = {
			children: undefined
		};
	}
	static float(children: IFloaterState["children"]) {
		this._render = true;
		this.children = children;
		this.keepRendering();
	}
	static remove() {
		this.children = undefined;
		if (_instance) {
			_instance.setState({
				children: undefined
			});
		}
		this._render = false;
	}
	private static keepRendering() {
		if (!this._render) {
			return;
		}
		if (FloaterRef) {
			if (_instance) {
				_instance.setState({
					children: this.children
				});
			}
		}
		requestAnimationFrame(()=>{
			setTimeout(this.keepRendering.bind(this), 100);
		});
	}
	render() {
		return <EFloater innerRef={(ref)=>FloaterRef=ref}>
			{this.state.children?this.state.children():undefined}
		</EFloater>;
	}
}