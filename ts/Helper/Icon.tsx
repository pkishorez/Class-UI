import * as React from 'react';
import { css, cx } from '../Emotion';

const cls = css`
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 24px;  /* Preferred icon size */
	display: inline-block;
	line-height: 1;
	text-transform: none;
	letter-spacing: normal;
	word-wrap: normal;
	white-space: nowrap;
	direction: ltr;

	/* Support for all WebKit browsers. */
	-webkit-font-smoothing: antialiased;
	/* Support for Safari and Chrome. */
	text-rendering: optimizeLegibility;

	/* Support for Firefox. */
	-moz-osx-font-smoothing: grayscale;

	/* Support for IE. */
	font-feature-settings: 'liga';
`;

interface IIconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {

}
export const Icon = (props: IIconProps)=>{
	return <i {...props} className={cx(cls, props.className)}>{props.children}</i>
}