import {
	FormContext,
	IFormContext,
	IRegisterFunc
} from "classui/Components/Form/Form";
import { Schema } from "classui/Components/Form/Schema";
import * as React from "react";

export interface IValue {
	value: any;
	error: string | null;
}

export abstract class FormElement<IProps, IState> extends React.Component<
	IProps & {
		name: string;
	},
	{
		value: any;
	} & IState
> {
	_schema: any;
	register!: (
		key: string,
		ref: FormElement<any, any>,
		register: IRegisterFunc
	) => void;

	protected schema?: Schema;
	private unregister?: IFormContext["unregister"];
	// tslint:disable-next-line:variable-name

	abstract validate(focusOnError?: boolean): void;

	public getValue() {
		return {
			error: this.schema ? this.schema.validate(this.state.value) : null,
			value: this.state.value
		};
	}

	abstract Render(): JSX.Element;

	componentWillUnmount() {
		this.unregister && this.unregister(this.props.name);
	}
	componentDidMount() {
		this.register(this.props.name, this, (schema, defaultValue) => {
			this._schema = schema;
			schema && (this.schema = new Schema(schema));
			defaultValue &&
				this.setState({
					value: defaultValue
				});
		});
	}

	render() {
		return (
			<FormContext.Consumer>
				{FE => {
					this.register = FE.register;
					this.unregister = FE.unregister;
					return this.Render();
				}}
			</FormContext.Consumer>
		);
	}
}
