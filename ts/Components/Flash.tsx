import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';

export interface IProps {};
export interface IState {
	show: boolean
};

let _instance: Flash | null = null;
export class Flash extends React.Component<IProps, IState> {

	private content_click: boolean = false;
	private content: any;

	static flash(func: Function) {
		if (!_instance){
			console.error("Flash component should be rendered to use it.");
			return;
		}
		_instance.content = func(_instance? _instance.dismiss: null);
		_instance.setState({
			show: true
		});
		window.addEventListener("keydown", _instance.escapeDismiss)
	}
	constructor() {
		super();
		if (_instance){
			console.error("Only one instance of Flash component should be created...");
			return;
		}
		_instance = this;
		this.state = {
			show: false
		};
		this.escapeDismiss = this.escapeDismiss.bind(this);
		this.dismiss = this.dismiss.bind(this);
	}

	escapeDismiss(e: KeyboardEvent) {
		if (e.key=="Escape") {
			this.dismiss();
			window.removeEventListener("keydown", this.escapeDismiss);
		}
	}
	dismiss() {
		if (this.content_click){
			this.content_click = false;
			return;
		}
		this.setState({show: false});
	}
	render() {
		return <SAnim show={this.state.show}>
			<div className="flash" onClick={this.dismiss}>
				<div onClick={(e)=>{this.content_click=true}} className="content card-5">
					{this.content}
				</div>
			</div>
		</SAnim>;
	}
}