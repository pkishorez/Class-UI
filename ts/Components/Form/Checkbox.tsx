import {
	BaseComponentProps,
	IBaseComponentProps
} from "classui/Components/Base";
import { FormElement } from "classui/Components/Form/FormElement";
import { cx, IThemeColors, styled } from "classui/Emotion";
import * as React from "react";

export interface IProps extends IBaseComponentProps {
	name: string;
	children: any;
	inline?: boolean;
	onChange?: (value: boolean) => void;
	shouldBeChecked?: boolean;
}

export interface IState {
	error: boolean;
}

const ECheckbox = styled("label")`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	user-select: none;
	padding: 5px;

	&.error {
		color: red;
	}

	&.inline {
		display: inline-flex;
		padding-right: 10px;
		margin-right: 5px;
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
				box-shadow: 0px 0px 5px
					${(p: IThemeColors) => p.theme.colorDarker};
			}
		}
	}
	> .fake {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		width: 20px;
		height: 20px;
		border: 1px solid black;
		font-size: 15px;
		color: white;
		transition: 0.3s all;

		&.active {
			border: 1px solid ${(p: IThemeColors) => p.theme.colorDarker};
			background-color: ${(p: IThemeColors) => p.theme.color};
		}
		& > * {
			margin: auto;
		}
	}
`;

export class Checkbox extends FormElement<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.validate = this.validate.bind(this);
		this.state = {
			error: false,
			value: false
		};
	}

	validate() {
		// No Validation For Now.
		const error = this.schema
			? this.schema.validate(this.state.value)
			: null;
		if (error) {
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
			<ECheckbox
				{...BaseComponentProps(this.props)}
				className={cx({
					error: this.state.error,
					inline: !!this.props.inline
				})}
			>
				<input
					type="checkbox"
					checked={this.state.value}
					onChange={() => {
						this.setState(
							{
								value: !this.state.value
							},
							this.validate
						);
					}}
					name={this.props.name}
				/>
				<div
					className={cx("fake", {
						active: this.state.value
					})}
				>
					<span>✔</span>
				</div>
				{this.props.children}
			</ECheckbox>
		);
	}
}
