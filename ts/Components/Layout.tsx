import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

export interface IProps {
	width?: number|string
	inline?: boolean
	direction?: "row" | "column"
	wrap?: boolean
	justify?: "center" | "start" | "end" | "space-between" | "space-around"
	align?: "center" | "start" | "end" | "stretch"
	gutter?: number
	margin?: number
	equalWidth?: boolean
	mediaNoMatch?: IProps
	style?: React.CSSProperties
	cls?: string

	// Common Child Properties.
	c_props?: ISectionProps | undefined
};
export interface IState {};

export class Layout extends React.Component<IProps, IState> {

	public static defaultProps:IProps = {
		width: 'auto',
		inline: false,
		direction: "row",
		wrap: false,
		justify: "center",
		align: "center",
		gutter: 0,
		margin: 0,
		equalWidth: false,

		c_props: undefined
	};

	render() {
		let cls = classNames("flexbox", this.props.cls,
			"justify-"+this.props.justify,
			"align-"+this.props.align,
			{
				"eq-width": this.props.equalWidth,
				"column": this.props.direction=="column",
				"wrap": this.props.wrap
			}
		);
		let count = React.Children.count(this.props.children);
		let children = React.Children.map(this.props.children, (elem: any, i)=>{
			let style: React.CSSProperties = {};
			if (this.props.direction=="column"){
				style.marginTop = (i==0)?this.props.margin:this.props.gutter;
			}
			else{
				style.marginLeft = (i==0)?this.props.margin: this.props.gutter;
			}
			if (i==count-1) {
				if (this.props.direction=="column")
					style.marginBottom = this.props.margin;
				else
					style.marginRight = this.props.margin;
			}
			return React.cloneElement(elem, {
				...this.props.c_props,
				...elem.props,
				style: {
					...style,
					...elem.props.style
				}
			});
		});
		return <div style={{
			maxWidth: this.props.width,
			...this.props.style
		}} className={cls} >
			{
				children
			}
		</div>;
	}
}

export interface ISectionProps {
	style?: React.CSSProperties,
	width?: number|string,
	minWidth?: number|string,
	children?: any,
	card?: boolean,
	remain?: boolean
};

export let Section = (props: ISectionProps)=>{
	let cls = classNames({
		"card-0": props.card,
		"remain": props.remain
	});
	let style: React.CSSProperties = {
		backgroundColor: props.card?'white':null,
		padding: props.card?10:0,
		width: props.width,
		flexBasis: props.minWidth,
		...props.style
	};

	return <div className={cls} style={style}>
		{props.children}
	</div>;
};