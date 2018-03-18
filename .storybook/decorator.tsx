import * as React from 'react';
import {ClassUI, NavBar, NavbarRemain} from 'classui/index';
import {Button, Div, Dropdown as DD} from 'classui/Components';
import {addDecorator} from '@storybook/react';

export let AddDecorator = ()=>{
	return addDecorator(story=>{
		return <ClassUI EnableRouting fullHeight style={{
			display: "flex",
			flexDirection: "column"
		}}>
			<NavBar logo="Class-UI" style={{position: "fixed"}} dummy>
				<NavbarRemain />
				<DD.Dropdown push="left" button="Theme">
					{
						(d: any)=>{
							return ["fb", "flat", "offline", "gcolor"].map(c=>
								<DD.DItem key={c} onClick={()=>{
									ClassUI.setTheme(c as any);
									d();
								}}>{c.toUpperCase()}</DD.DItem>
							)
						}
					}
				</DD.Dropdown>
			</NavBar>
			<Div style={{
				flexGrow: 1,
				display: 'flex',
				justifyContent: "center",
				alignItems: "flex-start"
			}}>
				<Div card="2" style={{
					backgroundColor: "white",
					padding: 20,
					margin: 10,
					width: "100%",
					maxWidth: 800
				}}>
					{story()}
				</Div>
			</Div>
		</ClassUI>
	})
};
