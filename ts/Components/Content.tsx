import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ClassUI from '../ClassUI';
import NavBar from './Navbar';

export interface IProps {
	style?:JSON
};

export interface IState {};

class Content extends React.Component<IProps, IState> {
	private static _ref: HTMLDivElement | null;
	public static get ref() {
		return Content._ref;
	}
	render() {
		return <div className="mainContent card-1" ref={(ref)=>{
			Content._ref = ref;
			ClassUI.onMounted(()=>{
				if (ref) {
					ref.style.marginTop = NavBar.ref?NavBar.ref.getBoundingClientRect().height+'px':'0px';
				}
			})
		}} style={{
			...this.props.style,
			maxWidth: ClassUI.contentWidth
		}}>
			{this.props.children}
		</div>;
	}
}

export default Content;