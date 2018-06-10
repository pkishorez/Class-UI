import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SAnim, ISAnimProps } from 'classui/Helper/Animation';
import { Button } from 'classui/Components/Button';
import { styled, cx } from 'classui/Emotion';
import { IOverlayProps } from 'classui/Overlay';

export interface IDrawerProps {
	animation?: ISAnimProps["animType"]
	noDismiss?: boolean
	noCloseButton?: boolean
	content: any
};
export type IProps = IOverlayProps & IDrawerProps;

export interface IState {
	show: boolean
};

let EDrawer = styled('div')`
	display: flex;
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

	static defaultProps: Partial<IProps> = {
		animation: "slideLeft",
		noCloseButton: true,
		noDismiss: false
	};

	private content_click: boolean = false;

	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			show: true
		};
		this.escapeDismiss = this.escapeDismiss.bind(this);
		this.clickDismiss = this.clickDismiss.bind(this);
		this.dismiss = this.dismiss.bind(this);
		window.addEventListener("keydown", this.escapeDismiss)
	}
	componentWillUnmount() {
		_instance = null;
		window.removeEventListener("keydown", this.escapeDismiss);
	}

	escapeDismiss(e: KeyboardEvent) {
		if (e.key=="Escape") {
			this.dismiss();
			e.stopPropagation();
		}
	}
	clickDismiss() {
		if (this.props.noDismiss){
			return;
		}
		if (this.content_click){
			this.content_click = false;
			return;
		}
		this.dismiss();
	}
	dismiss() {
		this.setState({show: false});
	}
	render() {
		let content = <EContent onClick={(e)=>{this.content_click=true}} className={cx({
			noDismiss: !!this.props.noDismiss
		})}>
			{this.props.content}
		</EContent>;
		return <SAnim onRemoved={this.props.remove} animType={this.props.animation} show={this.state.show}>
			<EDrawer onClick={this.clickDismiss}>
				{content}
			</EDrawer>
		</SAnim>;
	}
}