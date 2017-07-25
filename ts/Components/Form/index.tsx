import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
	onSubmit?: Function,
	cls?: string
};
export interface IState {};

let FormElements = [Text];

export class Form extends React.Component<IProps, IState> {
	private data: any = {};
	constructor() {
		super();
		this.submit = this.submit.bind(this);
		this.renderFormElements = this.renderFormElements.bind(this);
	}
	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(this.data);
		if (this.props.onSubmit)
			this.props.onSubmit(this.data);
	}

	getValue(data: any) {
		this.data[data.name] = data.value;
	}

	renderFormElements() {
		let render = (children: React.ReactNode): React.ReactNode => {
			return React.Children.map(children, (child: React.ReactChild)=>{
				if (typeof child=="object") {
					if (child.props._classui_form_capture) {
						let clone = React.cloneElement(child, {
							send_value: (data: any)=> {
								this.getValue(data);
							}
						});
						return clone;
					}
					return React.cloneElement(child, {
						children: render(child.props.children)
					});
				}
				return child;
			});
		}
		return render(this.props.children);
	}

	render() {
		return <form className={"form "+(this.props.cls?this.props.cls:"")} onSubmit={this.submit}>
			{this.renderFormElements()}
		</form>;
	}
}