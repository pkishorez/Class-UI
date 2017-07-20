import * as React from 'react';
import * as ReactDOM from 'react-dom';

export let Checkbox: React.StatelessComponent = (props: any) => {
	let change = (e: any)=>{
		if (props.send_value){
			props.send_value({
				name: props.name,
				value: e.target.value
			});
		}
	}
	return <label className={"checkbox"+(props.inline?" inline":"")}>
		<input type="checkbox" onChange={change} name={props.name}/>
		<div className="fake">✔</div>
		{props.children}
	</label>;
};

Checkbox.defaultProps = {
	__classui_form_capture: true
}