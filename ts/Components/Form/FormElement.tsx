import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import { IFormContext, FormContext } from 'classui/Components/Form/Form';
import { IJSONSchema, Schema } from 'classui/Components/Form/Schema';

export interface IValue {
	value: string | undefined
	error: string | null
};

export abstract class FormElement<IProps, IState> extends React.Component<IProps & {
	name: string
} , {
	value: any
} & IState> {
	private unregister?: IFormContext["unregister"];

	private _schema?: IJSONSchema;
	protected schema?: Schema;

	abstract validate(focusOnError?: boolean): void;

	public getValue() {
		return {
			value: this.state.value,
			error: this.schema?this.schema.validate(this.state.value): null
		};
	}

	abstract _render(): JSX.Element;

	componentWillUnmount() {
		this.unregister && this.unregister(this.props.name);
	}

	render() {
		return <FormContext.Consumer>
			{
				(FE)=>{
					FE.register(this.props.name, this, (schema, defaultValue)=>{
						if (schema) {
							this._schema = schema;
							this.schema = new Schema(schema);	
						}
						if (defaultValue) {
							this.setState({
								value: defaultValue
							});	
						}
					});
					this.unregister = FE.unregister;
					return this._render();
				}
			}
		</FormContext.Consumer>;
	}
}