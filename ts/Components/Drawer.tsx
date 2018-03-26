import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';
import { Button } from './Button';
import { styled, cx } from 'classui/Emotion';

export interface IProps {
};

export interface IState {
	show: boolean
};

let EDrawer = styled('div')`
	display: flex;
	z-index: 20;
	align-items: center;
	justify-content: flex-end;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0, 0.3);

	&.nodismiss {
		background-color: rgba(0, 0, 0, 0.8);
	}
`;
let EContent = styled('div')`
	position: relative;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
`;


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
	componentWillUnmount() {
		_instance = null;
	}

	escapeDismiss(e: KeyboardEvent) {
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
		let content = <EContent onClick={(e)=>{this.content_click=true}} className={cx(this.contentClass,{
			noDismiss: this.noDismiss
		})}>
			{this.content}
		</EContent>;
		let drawer = <EDrawer onClick={this.clickDismiss}>
			{this.noAnimation?content:<SAnim animType="slideLeft" show={this.state.show}>{content}</SAnim>}
		</EDrawer>;
		return this.state.show?drawer:null;
	}
}