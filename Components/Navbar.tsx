import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import ClassUI from '../ClassUI';

interface IProps {
	fixed?: boolean,	// Fixed Navbar
	logo?: string		// Logo text if any
};
interface IState {};

class NavBar extends React.Component<IProps, IState> {

	private static _ref: HTMLDivElement;
	public static defaultProps: IProps = {
		fixed: false,
		logo: null
	};

	constructor() {
		super();
		this.Scroll = _.throttle(this.Scroll.bind(this), 100);
	}

	componentDidMount() {
		if (this.props.fixed){
			window.addEventListener("scroll", this.Scroll);
		}
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.Scroll);
	}

	Scroll(e) {
		if (window.scrollY>0) {
			NavBar._ref.classList.add("light");
		}
		else {
			NavBar._ref.classList.remove("light");
		}
	}

	/**
	 * Returns navbar reference to be accessed by other Components.
	 */
	public static get ref() {
		return NavBar._ref;
	}

	render() {
		let cls = classNames("card-2", "navbar",  {
			fixed: this.props.fixed
		});
		return <div className={cls} ref={(ref)=>{NavBar._ref=ref;}}>
			<div className="content" style={{
				width: ClassUI.contentWidth
			}}>
				{
					this.props.logo?<div className="logo">{this.props.logo}</div>:null
				}

			</div>
		</div>;
	}
}

export default NavBar;