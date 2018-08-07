import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { IValue } from "classui/Components/Form/FormElement";
import { ITextProps, Text } from "classui/Components/Form/Text";
import { cx, styled } from "classui/Emotion";
import { CColors, IThemeColors } from "classui/Emotion/theme";
import * as React from "react";

export interface IProps extends ITextProps, IBaseComponentProps {
	label?: string;
	name: string;
	containerStyle?: React.CSSProperties;
}

const EContainer = styled("label")`
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
		padding: 5px 0px;
		font-size: 13px;
		color: #ff1744;
		transition: all 0.5s;
	}
	&.error {
		> input[type="text"],
		input[type="number"],
		input[type="password"],
		textarea {
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
		> input[type="text"],
		input[type="number"],
		input[type="password"],
		textarea {
			border-bottom: 2px solid ${(p: IThemeColors) => p.theme.colorDarker};
		}
		> .label {
			color: ${(p: IThemeColors) => p.theme.colorDarker};
		}
	}
`;

export class TextField extends React.Component<
	IProps,
	{ error: null | string | undefined }
> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			error: undefined
		};
		this.onChange = this.onChange.bind(this);
	}
	onChange(value: IValue) {
		this.setState({
			error: value.error
		});
	}
	render() {
		return (
			<EContainer
				{...BaseComponentProps(this.props)}
				className={cx({
					error: this.state.error ? true : false,
					success: this.state.error === null ? true : false
				})}
				style={this.props.containerStyle}
			>
				{this.props.label ? (
					<div className="label">{this.props.label}</div>
				) : null}
				<Text {...this.props} onChange={this.onChange}>
					{this.props.children}
				</Text>
				<div className="error">{this.state.error}</div>
			</EContainer>
		);
	}
}
