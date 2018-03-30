import * as React from 'react';
import {Hoverable, cx, css} from 'classui/Emotion/index';

export interface ISubmitProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	disabled?: boolean
}
export let Submit = (props: ISubmitProps)=>{
	return <input type="submit" className={cx(css`
		padding: 10px;
		background-color: #EEEEEE;
	`, Hoverable({
		disable: props.disabled
	}))}/>;
}