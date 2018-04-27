import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import { SAnim } from '../../Helper/Animation';
import * as _ from 'lodash';
import { styled, cx, css } from 'classui/Emotion';

export interface IProps {
	name: string
	options: (string|number)[]
	inline?: boolean
	width?: number|string
	children?: any
	label?: string
	top?: boolean
	nonEditable?: boolean
	defaultValue?: string
};

export interface IState {
	hover: number
	showSuggestions: boolean
	suggestions: IProps["options"]
	error: boolean
}

let ESelect = styled('label')`
	cursor: pointer;
	border: 1px solid #C4C4C4;
	&.error {
		border: 1px solid red;
	}
	display: flex;
	align-items: center;
	&:hover {
		background-color: #F4F4F4;
	}
`;
let ESuggestions = styled('ul')`
	position: absolute;
	background-color: white;
	max-height: 300px;
	overflow: auto;
	box-shadow: 0px 0px 3px grey;
`;
let ESuggestionItem = styled('li')`
	display: block;
	cursor: pointer;
	padding: 7px 10px;
	&.active {
		&, &:hover {
			background-color: inherit;
			color: ${p=>p.theme.color};
			cursor: default;
		}
	}
	&.hover{
		background-color: ${p=>p.theme.color};
		color: ${p=>p.theme.contrast};
	}
`;

export class Select extends FormElement<IProps, IState> {
	select: HTMLLabelElement | null = null;
	suggestions_cache?: IProps["options"];
	constructor(props: IProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue,
			error: false,
			hover: -1,
			suggestions: this.props.options,
			showSuggestions: false
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.setSuggestions = this.setSuggestions.bind(this);
	}

	public validate(focusOnError?: boolean) {
		let error = this.schema?this.schema.validate(this.state.value):null;
		if (error) {
			this.setState({
				error: true
			});
		}
		else {
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
		this.setState({
			value: e.target.value
		}, this.validate);
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO
		let suggestions = this.state.suggestions;
		let hover = this.state.hover;

		let sIndexes = suggestions.map((s,i)=>i).filter(i=>suggestions[i]!=this.state.value);
		let length = sIndexes.length;

		let move = {
			down: ()=>{
				hover = sIndexes.indexOf(hover);
				hover = (hover==-1)?0:hover+1;
				hover = (hover>=length)?0:hover;
				hover = sIndexes[hover];
				this.setState({
					hover,
					showSuggestions: true
				});
			},
			up: ()=>{
				hover = sIndexes.indexOf(hover);
				hover -= 1;
				hover = (hover<0)?length-1:hover;
				hover = sIndexes[hover];
				this.setState({
					hover,
					showSuggestions: true
				});
			}
		}

		if (e.key=="ArrowDown") {
			move.down();
		}
		else if (e.key=="ArrowUp") {
			move.up();
		}
		else if (e.key=="Enter") {
			if (hover!=-1) {
				this.setState({
					value: suggestions[hover],
					hover: -1,
					showSuggestions: false
				});
				e.preventDefault();
				e.stopPropagation();
			}
		}
		else if (e.key=="Escape") {
			this.setState({
				hover: -1,
				showSuggestions: false
			});
		}
		console.log(e.key);
	}
	private setSuggestions() {
		let options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		let suggestions = options.filter((option)=>{
			let value = this.state.value?this.state.value:"";
			value = value+"";
			option = option+"";
			if (option.toLowerCase().indexOf(value.toLowerCase())!=-1)
				return option;
		});
		return this.setState({
			suggestions: suggestions
		});
	}
	Render() {
		let width = (typeof this.props.width=="string")?this.props.width:this.props.width+"px";
		return <div className={css`
			position: relative;
			margin-bottom: 10px;
			${this.props.inline?`display: inline-block;`:undefined}
			${this.props.width?`width: ${width}`:undefined};
		`}>
			<ESelect innerRef={ref=>this.select = ref} className={cx({
				error: this.state.error
			})}>
				<input spellCheck={false} readOnly={this.props.nonEditable?true:false} className={css`
					color: ${this.props.nonEditable?'transparent':'black'};
					cursor: ${this.props.nonEditable?'pointer':'inherit'};
					width: 0;
					text-shadow: 0px 0px 0px #000;
					padding: 10px 7px;
					background-color: inherit;
					flex-grow: 1;
					transition: 0.3s padding;
					&:focus, &:hover {
						color: darkgreen;
					}
				`} autoComplete="off" type="text" onClick={()=>{
					this.showSuggestions();
				}} onFocus={()=>{
					this.showSuggestions();
				}} value={this.state.value?this.state.value:""}
					name={this.props.name}
					onKeyDown={this.suggestions}
					onChange={this.onChange}
					onBlur={()=>{
						setTimeout(()=>{
							this.hideSuggestions();
						}, 100);
					}}
				/>
				<i className="fa fa-angle-down" style={{marginRight: 15}}></i>
			</ESelect>
			<SAnim show={this.state.showSuggestions && (this.state.suggestions.length>0)} animType={this.props.top?"slideTop":"slideBottom"}>
				<ESuggestions className={css`
					position: absolute;
					${this.props.top?`
						bottom: ${this.props.nonEditable?"0px":"100%"};
						top: auto;
					`:`
						top: ${this.props.nonEditable?"0px":"100%"};
						bottom: auto;
					`}
					left: -2px;
					width: calc(100% + 4px);
					z-index: 1;
					${this.props.nonEditable?`padding: 7px 0px;`:`padding: 0px 0px 7px 0px;`}
				`}>
					{this.props.label?<h3 style={{
						cursor: "default",
						paddingLeft: 10
					}}>{this.props.label}</h3>:undefined}
					{this.state.suggestions.map((option, i)=>{
						return <ESuggestionItem onMouseOver={()=>{
							if (this.state.value!=this.state.suggestions[i])
								this.setState({hover: i});
						}} key={option} className={cx({
								active: option==this.state.value,
								hover: i==this.state.hover
							})} onClick={()=>{
							this.setState({
								value: option
							}, this.validate);
							this.hideSuggestions();
						}}>{highlight(option, this.state.value)}</ESuggestionItem>
					})}
				</ESuggestions>
			</SAnim>
		</div>;
	}
};

let highlight = (option: string|number, highlight="")=>{
	option = option+"";
	highlight = highlight+"";
	let index = option.indexOf(highlight);
	if (index==-1)
		return option;
	return <>
		{option.substring(0, index)}
		<span style={{
			color: "green"
		}}>{option.substring(index, index+highlight.length)}</span>
		{option.substring(index+highlight.length)}
	</>;
}
