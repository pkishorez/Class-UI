import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

export interface IProps {
	minWidth?: number,
	maxWidth?: number
};
export interface IState {
	range: boolean
};

/**
 * Component to change layout responsively based on requirements.
 * Accepts minWidth and maxWidth without which the layout changes
 * as per the "data-nprops" properties.
 * 
 * data-populate is used for the child elements also to change
 * if layout changes. Only immediate children are allowed for now.
 */
class MediaQuery extends React.Component<IProps, IState> {

	static defaultProps: IProps = {
		minWidth: 0,
		maxWidth: 100000
	};
	constructor() {
		super();
		this.state = {
			range: false
		};
		this.Event = _.throttle(this.Event.bind(this), 200);
		this.analizeWidth = this.analizeWidth.bind(this);
	}

	Event() {
		this.setState({
			range: this.analizeWidth()
		})
	}
    componentDidMount() {
		window.addEventListener("resize", this.Event);
    }

    componentWillUnmount() {
		window.removeEventListener("resize", this.Event);
    }
	analizeWidth() {
		let document_width = document.body.clientWidth;
		if ((document_width>(this.props.minWidth || 0)) && (document_width<(this.props.maxWidth || 10000))){
			return true;
		}
		return false;
	}
	render() {
		let children = React.Children.map(this.props.children, (elem: any)=>{
			if (elem.props['data-populate']) {
				let children = React.Children.map(elem.props.children, (el: any)=>{
					let props = this.analizeWidth()?null:el.props['data-nprops'];
					return React.cloneElement(el, {
						...props
					});
				});
				elem = React.cloneElement(elem, {
					children
				});
			}
			let props = this.analizeWidth()?null:elem.props['data-nprops'];
			return React.cloneElement(elem, {...props});
		});
		return <div>
			{children}
		</div>;
	}
}

export default MediaQuery;