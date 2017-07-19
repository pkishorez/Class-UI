import * as React from 'react';

export let Label = (props: any) => {
	return <h5 className="label">
		{props.children} {props.message?`(${props.message})`: null}
	</h5>;
};