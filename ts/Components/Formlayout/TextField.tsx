import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text, ITextProps} from '../Form/Text';
import {SAnim} from '../../Helper/Animation';
import * as classNames from 'classnames';
import { IValue } from 'classui/Components/Form/FormElement';
import { styled, css, cx } from 'classui/Emotion';
import { CColors } from 'classui/Emotion/_theme';

export interface IProps extends ITextProps {
	label?: string
	name: string
};

let EContainer = styled('label')`
	display: block;
	margin-bottom: 5px;
	text-align: left;

	& > .label {
		font-size: 13px;
		font-weight: 900;
	}
	> .error {
		max-height: 0px;
		overflow: hidden;
		visibility: hidden;
		padding: 5px 0px;
		font-size: 13px;
		color: #ff1744;
		transition: all 0.5s;
	}
	&.error {
		> input[type="text"], input[type='number'], input[type='password'], textarea {
			border-bottom: 2px solid ${CColors.error};
			&:focus {
				border-bottom: 2px solid darkred;
			}
		}
		> .label {
			color: ${CColors.error};
		}
		> .error {
			max-height: 50px;
		}
	}
	&.success {
		> input[type="text"], input[type='number'], input[type='password'], textarea {
			border-bottom: 2px solid ${p=>p.theme.colorDarker};
		}
		> .label {
			color: ${p=>p.theme.colorDarker};
		}
	}
`;

export class TextField extends React.Component<IProps, {error: null|string|undefined}> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			error: undefined
		};
		this.onChange=this.onChange.bind(this);
	}
	onChange(value: IValue)
	{
		this.setState({
			error: value.error
		})
	}
	render() {
		return <EContainer className={cx({
			"error": this.state.error?true:false,
			"success": (this.state.error===null)?true:false
		})}>
			{this.props.label?<div className="label">{this.props.label}</div>:null}
			<Text {...this.props} onChange={this.onChange}>{this.props.children}</Text>
			<div className="error">{this.state.error}</div>
		</EContainer>;
	}
};