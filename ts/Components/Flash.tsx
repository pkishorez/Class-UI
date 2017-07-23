import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {};
export interface IState {
	content: React.ReactElement<any> | null
};

let _instance: Flash | null = null;
export class Flash extends React.Component<IProps, IState> {

	static flash(func: Function) {
		let content = func(_instance? _instance.dismiss: null);
		if (!_instance){
			console.error("Flash component should be rendered to use it.");
			return;
		}
		_instance.setState({
			content
		});
		window.addEventListener("keydown", _instance.escapeDismiss)
	}
	constructor() {
		if (_instance){
			console.error("Only one instance of Flash component should be created...");
			return;
		}
		super();
		_instance = this;
		this.state = {
			content: null
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
		this.setState({content: null});
	}
	render() {
		return this.state.content?<div className="flash" onClick={this.dismiss}>
			<div onClick={(e)=>{e.stopPropagation();}} className="content card-5">
				{this.state.content}
			</div>
		</div>: null;
	}
}