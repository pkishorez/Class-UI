export interface IBaseComponentProps {
	style?: React.CSSProperties
	className?: string
	onClick?: (e: any)=>void
}

export let BaseComponentProps = (props: any): IBaseComponentProps => {
	return {
		onClick: props.onClick,
		className: props.className,
		style: props.style
	}
};