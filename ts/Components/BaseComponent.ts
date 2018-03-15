export interface IBaseComponentProps {
	style?: React.CSSProperties
	className?: string
	onClick?: (e: any)=>void
	inlineBlock?: boolean
}

export let BaseComponentProps = (props: any): IBaseComponentProps => {
	return {
		onClick: props.onClick,
		className: props.className,
		style: {
			display: props.inlineBlock?"inline-block":undefined,
			...props.style
		}
	}
};