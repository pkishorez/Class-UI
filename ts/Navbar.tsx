import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { IBaseComponentProps, BaseComponentProps } from './Components/BaseComponent/index';
import { styled, cx } from 'classui/Emotion';

let ENavBar = styled('div')`
	position: relative;
	z-index: 10;
	top: 0px;
	left: 0px;
	width: 100%;
	padding: 3px;
	background-color: ${p=>p.theme.color};
	transition: all 1s;
`;
let EContent = styled('div')`
	max-width: 100%;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	flex-grow: 0;
	margin: auto;
	height: 100%;
	color: white;
`;
let ELogo = styled('div')`
	cursor: default;
	color: white;
	padding: 0px 5px;
	font-size: 20px;
	text-shadow: 0px 0px 15px white, 0px 0px 15px white;
	transition: all 0.3s;
	&::first-letter {
		font-size: 30px;
	}
	&:hover {
		text-shadow: 0px 0px 15px white, 0px 0px 15px white, 0px 0px 15px white;
	}
`;

export let NavbarRemain = ()=>{
	return <div style={{
		flexGrow: 1
	}}></div>
};

export interface IProps extends IBaseComponentProps {
	dummy?: boolean
	logo?: string		// Logo text if any
	width?: string|number
};
export interface IState {};

export class NavBar extends React.Component<IProps, IState> {

	public static defaultProps: IProps = {
		dummy: false,
		logo: undefined,
		width: "auto"
	};

	constructor(props: IProps, context: any) {
		super(props, context);
	}

	render() {
		let content = <EContent style={{
			width: this.props.width
		}}>
			{this.props.logo?<ELogo>{this.props.logo}</ELogo>:null}
			{this.props.children}
		</EContent>;

		let dummyNavBar = <ENavBar style={{visibility: "hidden"}} className="__navbar__">
			{content}
		</ENavBar>;

		return <>
			{(this.props.dummy)?dummyNavBar:null}
			<ENavBar {...BaseComponentProps(this.props, "__navbar__")}>
				{content}
			</ENavBar>
		</>;
	}
}