import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import { SAnim } from '../../Helper/Animation';
import * as _ from 'lodash';
import { styled, cx, css } from 'classui/Emotion';

export interface IProps {
	name: string
	options: string[]
	children?: any
	top?: boolean
	nonEditable?: boolean
	defaultValue?: string
};

export interface IState {
	showSuggestions: boolean
}

let ESelect = styled('label')`
	position: relative;
	display: block;
	border: 1px solid #C4C4C4;
	display: flex;
	align-items: center;
	&:hover {
		background-color: #F4F4F4;
	}
	margin-bottom: 10px;
`;
let ESuggestions = styled('ul')`
	position: absolute;
	top: -2px;
	bottom: auto;
	left: -2px;
	padding: 10px 0px;
	background-color: white;
	width: calc(100% + 4px);
	max-height: 300px;
	overflow: auto;
	box-shadow: 0px 0px 3px grey;
`;
let ESuggestionItem = styled('li')`
	display: block;
	cursor: pointer;
	padding: 7px 10px;
	&:hover{
		background-color: ${p=>p.theme.color};
		color: white;
	}
	&.active {
		&, &:hover {
			background-color: inherit;
			color: ${p=>p.theme.color};
			cursor: default;	
		}
	}
`;

export class Select extends FormElement<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue?this.props.defaultValue:"",
			showSuggestions: false
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
	}

	public validate(focusOnError?: boolean) {
		// No Validation as of now.
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (this.props.nonEditable) {
			this.setState({
				showSuggestions: true
			});
			return;
		}
		this.setState({
			value: e.target.value,
			showSuggestions: true
		});
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO
		if (e.key=="ArrowDown") {
			this.setState({
				showSuggestions: true
			});
		}
	}
	private getSuggestions() {
		let options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		return options.filter((option)=>{
			let value = this.state.value?this.state.value:"";
			if (option.toLowerCase().indexOf(value.toLowerCase())!=-1)
				return option;
		});
	}
	_render() {
		return <ESelect>
			<input spellCheck={false} className={css`
				color: transparent;
				text-shadow: 0px 0px 0px #000;
				cursor: pointer;
				padding: 10px 5px;
				background-color: inherit;
				flex-grow: 1;
			`} autoComplete={this.props.name} type="text" onClick={()=>{
				this.setState({
					showSuggestions: true
				})
			}} onFocus={()=>{
				this.setState({
					showSuggestions: true
				});
			}} value={this.state.value}
				name={this.props.name}
				onKeyDown={this.suggestions}
				onChange={this.onChange}
				onBlur={()=>{
				setTimeout(()=>this.setState({
					showSuggestions: false
				}), 100);
			}}/>
			<i className="fa fa-angle-down" style={{marginRight: 15}}></i>
			<SAnim show={this.state.showSuggestions && (this.getSuggestions().length>0)} animType={this.props.top?"slideTop":"slideBottom"}>
				<ESuggestions>
					{this.getSuggestions().map((option)=>{
						return <ESuggestionItem key={option} className={cx({
								active: option==this.state.value
							})} onClick={()=>{
							this.setState({
								value: option,
								showSuggestions: false
							})
						}}>{option}</ESuggestionItem>
					})}
				</ESuggestions>
			</SAnim>
		</ESelect>
	}
};