import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';
import * as classNames from 'classnames';

export interface IProps {
};

export interface IState {
	show: boolean
};

let _instance: Flash | null = null;
export class Flash extends React.Component<IProps, IState> {

	private noDismiss = false;
	private noAnimation = false;
	private content_click: boolean = false;
	private content: any;

	static flash(func: (dismiss: any)=>any, noDismiss: boolean = false, noAnimation: boolean = false) {
		if (!_instance){
			console.error("Flash component should be rendered to use it.");
			return;
		}
		_instance.noAnimation = noAnimation;
		_instance.noDismiss = noDismiss;
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
		this.clickDismiss = this.clickDismiss.bind(this);
		this.dismiss = this.dismiss.bind(this);
	}

	escapeDismiss(e: KeyboardEvent) {
		if (this.noDismiss){
			return;			
		}
		if (e.key=="Escape") {
			this.dismiss();
			window.removeEventListener("keydown", this.escapeDismiss);
		}
	}
	clickDismiss() {
		if (this.noDismiss){
			return;
		}
		if (this.content_click && !this.noDismiss){
			this.content_click = false;
			return;
		}
		this.dismiss();
	}
	dismiss() {
		this.setState({show: false});
	}
	render() {
		let cls = classNames("flash", {
			"noDismiss": this.noDismiss
		});
		let content = <div className={cls} onClick={this.clickDismiss}>
			<div onClick={(e)=>{this.content_click=true}} className="content">
				{this.noDismiss?null:<div className="close" onClick={this.dismiss}>x</div>}
				{this.content}
			</div>
		</div>;

		return this.noAnimation?(this.state.show?content:null):<SAnim show={this.state.show}>
			{content}
		</SAnim>;
	}
}

export let FlashLayout = (props: any)=>{
	return <div style={{padding: 10, backgroundColor: 'white'}}>
		{props.children}
	</div>;
}