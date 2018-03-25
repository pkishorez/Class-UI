import emotionStyled, {ThemedReactEmotionInterface, css} from 'react-emotion';
import { IThemeColors } from 'classui/Emotion/_theme';
export {Themes, IThemes, IThemeColors, PColors} from './_theme';

import './_reset';
export let styled = emotionStyled as ThemedReactEmotionInterface<IThemeColors>
export {cx, css} from 'react-emotion';

interface IHoverable {
	active?: boolean
	disable?: boolean
}
export let Hoverable = (props?: IHoverable)=>css`
	cursor: pointer;
	&:hover {
		background-color: #DDDDDD;
	}
	${props && props.active?`
		&, &:hover {
			background-color: #DDDDDD;
		}`:undefined}
	${props && props.disable?`
		&, :hover{
			background-color: inherit;
			cursor: default;
			color: grey;
		}`:undefined}
`;