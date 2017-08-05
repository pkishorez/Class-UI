import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text} from './Text';
import {Checkbox} from './Checkbox';
import {Select} from './Select';

export interface IProps {
	onSubmit?: Function,
	cls?: string
};
export interface IState {};


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
					if (child.props.classui_form_capture || child.type==Text || child.type==Checkbox || child.type==Select) {
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


export function FormHOC(Component: any): any {
	return class InjectProps extends Component {
		static defaultProps = {
			classui_form_capture: true
		};
		render() {
			let render = (children: React.ReactNode): any => {
				return React.Children.map(children, (child: React.ReactChild)=>{
					if (child && typeof child=="object") {
						if ((typeof child.type)=="function")
							return child;
						if (child.type==Text || child.type==Checkbox || child.type==Select) {
							let clone = React.cloneElement(child, {
								send_value: (data: any)=> {
									this.props.send_value(data);
								}
							});
							return clone;
						}
						return React.cloneElement(child, {
							...child.props,
							children: render(child.props.children)
						});
					}
					return child;
				});
			}
			let children = render(super.render())[0];
			return children;
		}
	}
}