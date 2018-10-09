import * as React from "react";
import { cx, IThemeColors, styled } from "../../Emotion";
import {
	BaseComponentProps,
	IBaseComponentProps
} from "../Base";
import { FormElement } from "./FormElement";

export interface IProps extends IBaseComponentProps {
	name: string;
	values: {
		label: string;
		value: string;
	}[];
	inline?: boolean;
	defaultValue?: string;
	onChange?: (value: string) => void;
}

export interface IState {
	error: boolean;
}

const ERadio = styled("label")`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	user-select: none;
	padding: 5px;

	&.inline {
		display: inline-flex;
		padding-right: 10px;
		margin-right: 5px;
	}
	&.error {
		color: red;
	}

	&:hover {
		background-color: #f4f4f4;
	}

	& > input {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 0px;
		height: 0px;
		margin: 0px;
		padding: 0px;

		&:focus {
			& ~ .fake {
				border: 1px solid ${(p: IThemeColors) => p.theme.colorDarker};
				box-shadow: 0px 0px 10px
					${(p: IThemeColors) => p.theme.colorDarker};
			}
		}
	}
	& > .fake {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		margin-right: 10px;
		border: 1px solid black;
		border-radius: 50%;
		font-size: 15px;
		color: white;
		transition: 0.3s all;

		&.active {
			border: 1px solid ${(p: IThemeColors) => p.theme.colorDarker};
			background-color: ${(p: IThemeColors) => p.theme.color};
		}
		> span {
			margin: auto;
		}
	}
`;

export class Radio extends FormElement<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			error: false,
			value: this.props.defaultValue
		};
	}

	validate() {
		const error = this.schema
			? this.schema.validate(this.state.value)
			: null;
		if (error) {
			// Do something here.
			this.setState({
				error: true
			});
		} else {
			this.setState({
				error: false
			});
		}
	}

	Render() {
		return (
			<div {...BaseComponentProps(this.props)}>
				{this.props.values.map(cb => {
					return (
						<ERadio
							key={cb.value}
							className={cx({
								error: this.state.error,
								inline: !!this.props.inline
							})}
						>
							<input
								type="radio"
								onChange={() => {
									this.setState(
										{
											value: cb.value
										},
										() => {
											this.props.onChange &&
												this.props.onChange(cb.value);
											this.validate();
										}
									);
								}}
								checked={this.state.value === cb.value}
								value={cb.value}
								name={this.props.name}
							/>
							<div
								className={cx("fake", {
									active: this.state.value === cb.value
								})}
							>
								<span>•</span>
							</div>
							{cb.label}
						</ERadio>
					);
				})}
			</div>
		);
	}
}
