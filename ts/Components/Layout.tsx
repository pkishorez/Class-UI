import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

export interface IProps {
	basis?: number|string
	inline?: boolean
	column?: boolean
	wrap?: boolean
	justify?: "center" | "start" | "end" | "space-between" | "space-around"
	align?: "center" | "start" | "end" | "stretch"
	gutter?: number
	margin?: number
	spread?: boolean
	mediaNoMatch?: IProps
	style?: React.CSSProperties
	className?: string

	// Common Child Properties.
	c_props?: ISectionProps
	children?: any
};
export interface IState {};

export class Layout extends React.Component<IProps, IState> {

	public static defaultProps:IProps = {
		basis: 'auto',
		inline: false,
		column: false,
		wrap: false,
		justify: "center",
		align: "center",
		gutter: 0,
		margin: 0,
		spread: true,

		c_props: undefined
	};

	render() {
		let cls = classNames("flexbox", this.props.className,
			"justify-"+this.props.justify,
			"align-"+this.props.align,
			{
				"eq-width": this.props.spread,
				"column": this.props.column,
				"wrap": this.props.wrap
			}
		);
		let count = React.Children.count(this.props.children);
		let children = React.Children.map(this.props.children, (elem: any, i)=>{
			if (!elem || ((elem.type!==Section) && (elem.type!==LSection))) {
				console.error("Unknown type child passed.");
				return;
			}

			let style: React.CSSProperties = {};
			if (this.props.column) {
				style.width = "100%";
				style.marginTop = (i==0)?this.props.margin:this.props.gutter;
			}
			else{
				style.marginLeft = (i==0)?this.props.margin: this.props.gutter;
			}
			if (i==count-1) {
				if (this.props.column)
					style.marginBottom = this.props.margin;
				else
					style.marginRight = this.props.margin;
			}
			return React.cloneElement(elem, {
				...this.props.c_props,
				...elem.props,
				style: {
					...(this.props.c_props?this.props.c_props.style:undefined),
					...style,
					...elem.props.style
				}
			});
		});
		return <div style={{
			[this.props.column?"height":"width"]: this.props.basis,
			...this.props.style
		}} className={cls} >
			{
				children
			}
		</div>;
	}
}

export type ISectionProps = {
	card?: boolean
	style?: React.CSSProperties,
	className?: string
	basis?: number|string,
	children?: any,
	remain?: boolean
}

/**
 * Section is an extendable ClassUI Component.
 */
export let Section = (props: ISectionProps)=>{
	let cls = classNames({
		"remain": props.remain,
		"card-1": props.card
	});
	cls = props.className?cls+" "+props.className:cls;
	let style: React.CSSProperties = {
		flexBasis: props.basis,
		backgroundColor: props.card?"white":undefined,
		padding: props.card?10:undefined,
		...props.style
	};

	return <div className={cls} style={style}>
		{props.children}
	</div>;
};


export type ILSProps = IProps & {
	SProps?: ISectionProps
	children: any
}

export let LSection = (props: ILSProps)=>{
	return <Section {...props.SProps}>
		<Layout {...props}>
			{props.children}
		</Layout>
	</Section>
}
