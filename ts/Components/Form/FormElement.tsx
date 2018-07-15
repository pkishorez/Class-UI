import { FormContext, IFormContext } from "classui/Components/Form/Form";
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

	render() {
		return (
			<FormContext.Consumer>
				{FE => {
					FE.register(
						this.props.name,
						this,
						(schema, defaultValue) => {
							if (schema) {
								this._schema = schema;
								this.schema = new Schema(schema);
							}
							if (defaultValue) {
								this.setState({
									value: defaultValue
								});
							}
						}
					);
					this.unregister = FE.unregister;
					return this.Render();
				}}
			</FormContext.Consumer>
		);
	}
}
