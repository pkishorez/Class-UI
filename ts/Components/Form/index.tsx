import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Label} from './Label';
import {Text} from './Text';

export interface IProps {
	onSubmit?: Function,
	label: string,
};
export interface IState {};

export class Form extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.submit = this.submit.bind(this);
	}
	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (this.props.onSubmit)
			this.props.onSubmit();
	}
	render() {
		return <form className="form" onSubmit={this.submit} style={{paddingTop: 10}}>
			<h2 style={{paddingLeft: 5}}>{this.props.label}</h2>
			<hr/>
			{this.props.children}
		</form>;
	}
}

export let NumberField = (props: any) => {
	return <label className="formElement">
		<Label>{props.children}</Label>
		<input type="number"/>
	</label>;
};

export let Checkbox = (props: any) => {
	return <div className={props.inline?"inline-block":""}>
		<label className="checkbox">
			<input type='checkbox' name={props.name} defaultChecked={props.checked}/>
			<div className='fake'>✓</div>
			{props.children}
		</label>
	</div>;
};

export let Radio = (props: any) => {
	return <div className={props.inline?"inline-block":""}>
		<label className="radio">
			<input type='radio' name={props.name} checked={props.checked}/>
			<div className='fake'>•</div>
			{props.children}
		</label>
	</div>;
}

export let RadioGroup = (p: any) => {
	let {children, ...props} = p;
	children = React.Children.map(children, (elem: React.ReactElement<any>, i)=>{
		return React.cloneElement(elem, props)
	});
	return <div className="formElement">
		<Label>{props.label}</Label>
		{children}
	</div>;
}

export let Submit = (props: any) => {
	return <input type="submit" value={props.children} className="button primary" />;
};

export {Text};