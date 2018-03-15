import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';
import * as classNames from 'classnames';
import { Button } from './Button';

export interface IProps {
};

export interface IState {
	show: boolean
};

let _instance: Flash | null = null;
export class Flash extends React.Component<IProps, IState> {

	private noDismiss = false;
	private noAnimation = false;
	private noCloseButton = false;
	private contentClass = "";
	private content_click: boolean = false;
	private content: any;

	static flash(func: (dismiss: any)=>any, noDismiss: boolean = false, noAnimation: boolean = false, noCloseButton = true, contentClass = "") {
		if (!_instance){
			console.error("Flash component should be rendered to use it.");
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
		let cls = classNames("__flash", {
			"noDismiss": this.noDismiss
		});
		let contentCls = classNames("content", this.contentClass);
		let content = <div className={cls} onClick={this.clickDismiss}>
			<div onClick={(e)=>{this.content_click=true}} className={contentCls}>
				{this.content}
				{this.noCloseButton?null:<Button className="close" onClick={this.dismiss}>x</Button>}
			</div>
		</div>;

		return this.noAnimation?(this.state.show?content:null):<SAnim show={this.state.show} animType="slideTop">
			{content}
		</SAnim>;
	}
}

export let FlashLayout = (props: any)=>{
	return <div style={{padding: 10, backgroundColor: 'white'}}>
		{props.children}
	</div>;
}