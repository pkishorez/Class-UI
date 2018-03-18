import * as React from 'react';

import { storiesOf } from '@storybook/react';
import {ClassUI} from 'classui/index';
import { Flash, Button, Dropdown as DD, Badge, Drawer, Div, Feedback, Menu } from 'classui/Components';
import { MD } from 'classui/Helper/MarkDown';
import { Table } from 'classui/Components/Table';

storiesOf("Components", module).add("Index", ()=><>
<MD>{`
# Components

ClassUI is mainly composed of Components.

There are 3 types of Components.

	1. Leaf.
	2. Nodal (Intermediary Components).
	3. Behavioural.

> Hello All.

Leaf Components are the one where the DOM tree ends. And for nodal Components, the DOM tree can extend further.
`}</MD>
</>);

let leafComponents = storiesOf('Components/Leaf', module);

leafComponents.addDecorator(story=>{
	return <>
<MD>{`
`}</MD>
		{story()}
	</>;
})



.add("Button", ()=><>
<Badge>Inline</Badge>
	<MD>{`
## Buttons

~~~js
<Button>Button Text goes here.</Button>
~~~
`}</MD>


	<Button >Button.</Button>
	<Button primary>Primary Button.</Button>
	<Button disable>Disabled.</Button>
	<Button primary disable>Primary Disabled.</Button>
	<Button active>Normal Active.</Button>
	<Button primary active>Primary Active.</Button>
</>)

.add('Dropdown', ()=><>
<Badge>Inline</Badge>
<MD>{`
## Dropdown

~~~~
<Dropdown>Button Text goes here.</Dropdown>
~~~~
`}</MD>
{
	["up", "left", "right"].map((d: any)=><div><DD.Dropdown button="Dropdown" push={d}>
		<DD.DItem><i className="fa fa-trash"></i> Item1</DD.DItem>
		<DD.DItem>Item2</DD.DItem>
		<DD.DItem>Item3</DD.DItem>
		<DD.DItem>Item4</DD.DItem>
		<DD.DItem>Item5</DD.DItem>
	</DD.Dropdown></div>)
}
</>)



.add("Badge", ()=><>
<Badge>Inline</Badge>
<MD>{`
## Badges

Badge:
~~~~
<Badge>Badge Text goes here.</Badge>
~~~~
`}</MD>
<Badge>Badge</Badge>
<Badge type="carrot">Badge</Badge>
<Badge type="error">Badge</Badge>
<Badge type="sunflower">Badge</Badge>
<Badge type="grey">Badge</Badge>
</>)


.add("Menu", ()=><>
<MD language="typescript">{`
## Menu

Menu:
~~~~
~~~~
`}</MD>
<Menu.Menu>
	<Menu.MItem active>Item - 1</Menu.MItem>
	<Menu.MItem disable>Item - 2</Menu.MItem>
	<Menu.MDivider />
	<Menu.MItem>Item - 3</Menu.MItem>
	<Menu.MItem>Item - 4</Menu.MItem>
</Menu.Menu>
</>)


// Tables.


.add("Tables", ()=><>
<MD language="jsx">{`
## Tables

Table:
~~~~
<Table headerItems={["name", "age"]} defaultGroup="age" hoverable sortableItems={["name", "age"]} data={[
	{name: "Kishore", age: 25},
	{name: "Charan", age: 17},
	{name: "Person", age: 17},
	{name: "Another", age: 17},
	{name: "Jaffa", age: 55}
]}>
</Table>
~~~~
`}</MD>

<Table headerItems={["name", "age"]} defaultGroup="age" hoverable sortableItems={["name", "age"]} data={[
	{name: "Kishore", age: 25},
	{name: "Charan", age: 17},
	{name: "Person", age: 17},
	{name: "Another", age: 17},
	{name: "Jaffa", age: 55}
]}>
</Table>
</>)



let NodeComponents = storiesOf("Components/Node", module)

.add("ClassUI", ()=>{
	return <>
	</>;
})


let Behavioural = storiesOf("Components/Behavioural", module)

.add("Drawer", ()=><>
<Badge>Inline</Badge>
<MD language="typescript">{`
## Drawer

Drawer:
~~~~
Drawer.open(d=>{
	return <h1 style={{backgroundColor: 'white', padding: 10}}>
		Kishore is a good boy.
	</h1>;
});
~~~~
`}</MD>
<Button onClick={()=>{
	Drawer.open(d=>{
		return <Div style={{backgroundColor: 'white', padding: 10}} card="5">
			Kishore is a good boy.
		</Div>;
	})
}}>Drawer</Button>
</>)



.add("Feedback", ()=><>
<MD language="typescript">{`
## Feedback

Feedback:
~~~~
Feedback.show();
~~~~
`}</MD>

<Button onClick={()=>{
	Feedback.show("Success!!!");
}}>Feedback</Button>
<Button onClick={()=>{
	Feedback.show("Error!!!", "error");
}}>Error Feedback</Button>
</>)




.add("Flash", ()=><>
<MD language="typescript">{`
## Flash

Flash:
~~~~
Flash.flash();
~~~~
`}</MD>
<Button onClick={()=>{
	Flash.flash(d=>{
		return <h1 style={{
			backgroundColor: "white",
			padding: 20
		}}>Kishore is a good boy.</h1>
	}, false, "slideRight")
}}>
	Open FLash
</Button>
</>);