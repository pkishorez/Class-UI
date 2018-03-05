import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {IFormContextType} from './Form';

export interface IValue {
	value: any | null
	error: string | null
};

export abstract class FormElement<IProps, IState> extends React.Component<IProps, IState> {
	static contextTypes = {
		initialize: propTypes.func,
		delete_value: propTypes.func
	}
	context: IFormContextType = {
		delete_value: ()=>{},
		initialize: ()=>{}
	};

	constructor(props: any, context: IFormContextType) {
		super(props, context);
	}

	abstract getValue(): IValue;
	abstract validate(focus?:boolean): void;
}