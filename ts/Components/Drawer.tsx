import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';
import * as classNames from 'classnames';

export interface IProps {
};

export interface IState {
	show: boolean
};

let _instance: Drawer | null = null;
export class Drawer extends React.Component<IProps, IState> {

	private noDismiss = false;
	private noAnimation = false;
	private noCloseButton = true;
	private contentClass = "";
	private content_click: boolean = false;
	private content: any;

	static open(func: (dismiss: any)=>any, noDismiss: boolean = false, noAnimation: boolean = false, noCloseButton = true, contentClass = "") {
		if (!_instance){
			console.error("Drawer component should be mounted in the app to use it.");
			return;
		}
		_instance.noAnimation = noAnimation;
		_instance.noDismiss = noDismiss;
		_instance.noCloseButton = noCloseButton;
		_instance.contentClass = contentClass;
		_instance.content = func(_instance? _instance.dismiss: null);
		_instance.setState({
			show: true
		});
		window.addEventListener("keydown", _instance.escapeDismiss)
	}
	constructor(props: IProps, context: any) {
		super(props, context);
		if (_instance){
			console.error("Only one instance of Drawer component should be created...");
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
		e.stopPropagation();
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
		let cls = classNames("drawer", {
			"noDismiss": this.noDismiss
		});
		let contentCls = classNames("content", this.contentClass);
		let content = <div onClick={(e)=>{this.content_click=true}} className={contentCls}>
			{this.content}
			{(this.noDismiss || this.noCloseButton)?null:<div className="close button" onClick={this.dismiss}>x</div>}
		</div>;
		let drawer = <div className={cls} onClick={this.clickDismiss}>
			{this.noAnimation?content:<SAnim animType="slideLeft" show={this.state.show}>{content}</SAnim>}
		</div>;

		return this.state.show?drawer:null;
	}
}