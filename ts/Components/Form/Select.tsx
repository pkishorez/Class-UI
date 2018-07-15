import { css, cx, styled } from "classui/Emotion";
import * as _ from "lodash";
import * as React from "react";
import { SAnim } from "../../Helper/Animation";
import { FormElement } from "./FormElement";

export interface IProps {
	name: string;
	options: (string | number)[];
	inline?: boolean;
	width?: number | string;
	children?: any;
	label?: string;
	top?: boolean;
	nonEditable?: boolean;
	defaultValue?: string;
}

export interface IState {
	hover: number;
	showSuggestions: boolean;
	suggestions: IProps["options"];
	error: boolean;
}

const ESelect = styled("label")`
	cursor: pointer;
	border: 1px solid #c4c4c4;
	&.error {
		border: 1px solid red;
	}
	display: flex;
	align-items: center;
	&:hover {
		background-color: #f4f4f4;
	}
`;
const ESuggestions = styled("ul")`
	position: absolute;
	background-color: white;
	max-height: 300px;
	overflow: auto;
	box-shadow: 0px 0px 3px grey;
`;
const ESuggestionItem = styled("li")`
	display: block;
	cursor: pointer;
	padding: 7px 10px;
	&.active {
		&,
		&:hover {
			background-color: inherit;
			color: ${p => p.theme.color};
			cursor: default;
		}
	}
	&.hover {
		background-color: ${p => p.theme.color};
		color: ${p => p.theme.contrast};
	}
`;

export class Select extends FormElement<IProps, IState> {
	select: HTMLLabelElement | null = null;
	suggestions_cache?: IProps["options"];
	constructor(props: IProps) {
		super(props);
		this.state = {
			error: false,
			hover: -1,
			showSuggestions: false,
			suggestions: this.props.options,
			value: this.props.defaultValue
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.setSuggestions = this.setSuggestions.bind(this);
	}
	Render() {
		const width =
			typeof this.props.width === "string"
				? this.props.width
				: this.props.width + "px";
		return (
			<div
				className={css`
					position: relative;
					margin-bottom: 10px;
					${this.props.inline
						? `display: inline-block;`
						: undefined} ${this.props.width
						? `width: ${width}`
						: undefined};
				`}
			>
				<ESelect
					innerRef={ref => (this.select = ref)}
					className={cx({
						error: this.state.error
					})}
				>
					<input
						spellCheck={false}
						readOnly={this.props.nonEditable ? true : false}
						className={css`
							color: ${this.props.nonEditable
								? "transparent"
								: "black"};
							cursor: ${this.props.nonEditable
								? "pointer"
								: "inherit"};
							width: 0;
							text-shadow: 0px 0px 0px #000;
							padding: 10px 7px;
							background-color: inherit;
							flex-grow: 1;
							transition: 0.3s padding;
							&:focus,
							&:hover {
								color: darkgreen;
							}
						`}
						autoComplete="off"
						type="text"
						onClick={() => {
							this.showSuggestions();
						}}
						onFocus={() => {
							this.showSuggestions();
						}}
						value={this.state.value ? this.state.value : ""}
						name={this.props.name}
						onKeyDown={this.suggestions}
						onChange={this.onChange}
						onBlur={() => {
							setTimeout(() => {
								this.hideSuggestions();
							}, 100);
						}}
					/>
					<i
						className="fa fa-angle-down"
						style={{ marginRight: 15 }}
					/>
				</ESelect>
				<SAnim
					show={
						this.state.showSuggestions &&
						this.state.suggestions.length > 0
					}
					animType={this.props.top ? "slideTop" : "slideBottom"}
				>
					<ESuggestions
						className={css`
							position: absolute;
							${this.props.top
								? `
						bottom: ${this.props.nonEditable ? "0px" : "100%"};
						top: auto;
					`
								: `
						top: ${this.props.nonEditable ? "0px" : "100%"};
						bottom: auto;
					`} left: -2px;
							width: calc(100% + 4px);
							z-index: 1;
							padding: 7px 0px;
						`}
					>
						{this.props.label ? (
							<h3
								style={{
									cursor: "default",
									paddingLeft: 10
								}}
							>
								{this.props.label}
							</h3>
						) : (
							undefined
						)}
						{this.state.suggestions.map((option, i) => {
							return (
								<ESuggestionItem
									onMouseOver={() => {
										if (
											this.state.value !==
											this.state.suggestions[i]
										) {
											this.setState({ hover: i });
										}
									}}
									key={option}
									className={cx({
										active: option === this.state.value,
										hover: i === this.state.hover
									})}
									onClick={() => {
										this.setState(
											{
												value: option
											},
											this.validate
										);
										this.hideSuggestions();
									}}
								>
									{highlight(option, this.state.value)}
								</ESuggestionItem>
							);
						})}
					</ESuggestions>
				</SAnim>
			</div>
		);
	}
	public validate() {
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

	private showSuggestions() {
		this.setState({
			showSuggestions: true
		});
	}
	private hideSuggestions() {
		this.setState({
			hover: -1,
			showSuggestions: false
		});
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.showSuggestions();
		if (this.props.nonEditable) {
			return;
		}
		this.setState(
			{
				value: e.target.value
			},
			this.validate
		);
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO
		const { suggestions, hover } = this.state;
		let dHover = hover;

		const sIndexes = suggestions.filter(
			(i: any) => suggestions[i] !== this.state.value
		);
		const length = sIndexes.length;

		const move = {
			down: () => {
				dHover = sIndexes.indexOf(dHover);
				dHover = dHover === -1 ? 0 : dHover + 1;
				dHover = dHover >= length ? 0 : dHover;
				dHover = sIndexes[dHover] as number;
				this.setState({
					hover: dHover,
					showSuggestions: true
				});
			},
			up: () => {
				dHover = sIndexes.indexOf(dHover);
				dHover -= 1;
				dHover = dHover < 0 ? length - 1 : dHover;
				dHover = sIndexes[dHover] as number;
				this.setState({
					hover: dHover,
					showSuggestions: true
				});
			}
		};

		if (e.key === "ArrowDown") {
			move.down();
		} else if (e.key === "ArrowUp") {
			move.up();
		} else if (e.key === "Enter") {
			if (dHover !== -1) {
				this.setState({
					hover: -1,
					showSuggestions: false,
					value: suggestions[dHover]
				});
				e.preventDefault();
				e.stopPropagation();
			}
		} else if (e.key === "Escape") {
			this.setState({
				hover: -1,
				showSuggestions: false
			});
		}
	}
	private setSuggestions() {
		const options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		const suggestions = options.filter(option => {
			let value = this.state.value ? this.state.value : "";
			value = value + "";
			option = option + "";
			if (option.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
				return option;
			}
		});
		return this.setState({
			suggestions
		});
	}
}

const highlight = (option: string | number, hLight = "") => {
	option = option + "";
	hLight = hLight + "";
	const index = option.indexOf(hLight);
	if (index === -1) {
		return option;
	}
	return (
		<>
			{option.substring(0, index)}
			<span
				style={{
					color: "green"
				}}
			>
				{option.substring(index, index + hLight.length)}
			</span>
			{option.substring(index + hLight.length)}
		</>
	);
};
