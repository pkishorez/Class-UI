import * as React from 'react';
import {Label} from './Label';

export type IValidation = "email" | "url" | "number";
export interface ITextProps {
	name: string,
	validate: IValidation[] | IValidation
};

export class Text extends React.Component<ITextProps, any> {
	private errorText: string;
	private validationCriteria: IValidation[] = [];
	public static defaultProps: Partial<ITextProps> = {
		validate: []
	};

	constructor() {
		super();
		this.state = {
			cls: ""
		};
		this.validate = this.validate.bind(this);
	}
	componentDidMount() {
		this.validationCriteria = (typeof this.props.validate=="string"?[this.props.validate]:this.props.validate);
	}

	validate(e: React.ChangeEvent<HTMLInputElement>) {
		let val = e.target.value;
		let check = (criteria: IValidation[], val: string) => {
			for (let c of criteria) {
				switch(c) {
					case "email": {
						var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						this.errorText = "Enter valid Email";
						return re.test(val);
					}
					case "url": {
						this.errorText = "Enter valid URL";
						return true;
					}
					case "number": {
						this.errorText = "Enter valid Number";
						let re = /^[0-9]*$/;
						return re.test(val);
					}
				};
			}
			return true;
		}
		
		this.setState({
			cls: check(this.validationCriteria, val)?"success": "error"
		});
	}

	render() {
		return <label className={"formElement "+this.state.cls}>
			<Label message={(this.state.cls=="error")?this.errorText:null}>{this.props.children}</Label>
			<input type="text" name={this.props.name} placeholder="Enter text" onChange={(e)=>this.validate}/>
		</label>;
	}
};