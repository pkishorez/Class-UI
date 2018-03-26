import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim, ISAnimProps} from '../Helper/Animation';
import { Button } from './Button';
import { styled, css, cx } from 'classui/Emotion';

export interface IProps {
};

export interface IState {
	show: boolean
};

let EFlash = styled('div')`
	display: flex;
	z-index: 20;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0, 0.5);

	&.noDismiss {
		background-color: rgba(0, 0, 0, 0.8);
	}
`;
let EContent = styled('div')`
	position: relative;
	max-width: 100%;
	max-height: 100%;
	overflow: auto;
`;
let Close = css`
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 900;
	position: absolute;
	top: 0px;
	right: 0px;
	padding: 10px;
	min-width: 40px;
	min-height: 40px;
`;


let _instance: Flash | null = null;
export class Flash extends React.Component<IProps, IState> {

	private noDismiss = false;
	private animation: ISAnimProps["animType"]|undefined = undefined;
	private noCloseButton = false;
	private contentClass = "";
	private content_click: boolean = false;
	private content: any;

	static flash(func: (dismiss: any)=>any, noDismiss: boolean = false, animation: ISAnimProps["animType"] = "slideTop", noCloseButton = true, contentClass = "") {
		if (!_instance){
			console.error("Flash component should be rendered to use it.");
			return;
		}
		_instance.animation = animation;
		_instance.noDismiss = noDismiss;
		_instance.noCloseButton = noCloseButton;
		_instance.contentClass = contentClass;
		_instance.content = func(_instance? _instance.dismiss: null);
		_instance.setState({
			show: true
		});
		window.addEventListener("keydown", _instance.escapeDismiss)
	}
	componentWillUnmount() {
		_instance = null;
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

		let content = <EFlash className={cx({
			noDismiss: this.noDismiss
		})} onClick={this.clickDismiss}>
			<EContent onClick={(e)=>{this.content_click=true}} className={this.contentClass}>
				{this.content}
				{this.noCloseButton?null:<Button className={Close} onClick={this.dismiss}>x</Button>}
			</EContent>
		</EFlash>;

		return (!this.animation)?(this.state.show?content:null):<SAnim show={this.state.show} animType={this.animation}>
			{content}
		</SAnim>;
	}
}

export let FlashLayout = (props: any)=>{
	return <div style={{padding: 10, backgroundColor: 'white'}}>
		{props.children}
	</div>;
}