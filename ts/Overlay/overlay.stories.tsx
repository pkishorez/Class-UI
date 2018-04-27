import * as React from 'react';

import { storiesOf } from '@storybook/react';
import {ClassUI} from 'classui/index';
import { Overlay } from 'classui/Overlay';
import { Badge, Button } from 'classui/Components';
import { MD } from 'classui/Helper/MarkDown';


let Behavioural = storiesOf("Components/Behavioural", module)

.add("Flash", ()=><>
<MD language="typescript">{`
## Flash

Flash:
~~~~
Overlay.flash();
~~~~
`}</MD>
<Button onClick={()=>{
	Overlay.flash({
		content: <h1 style={{
			backgroundColor: "white",
			padding: 20
		}} onClick={()=>{
			Overlay.flash({
				content: <h1>THIS IS ANOTHER OVERLAY!!!</h1>
			})
		}}>Kishore is a good boy.</h1>
	})
}}>
	Open FLash
</Button>
</>)



.add("Drawer", ()=><>
<MD language="typescript">{`
## Drawer

Drawer:
~~~~
Overlay.drawer();
~~~~
`}</MD>
<Button onClick={()=>{
	Overlay.drawer({
		content: <h1 style={{
			backgroundColor: "white",
			padding: 20
		}} onClick={()=>{
			Overlay.flash({
				content: <h1>THIS IS ANOTHER OVERLAY!!!</h1>
			})
		}}>Kishore is a good boy.</h1>
	})
}}>
	Open FLash
</Button>
</>)



.add("Feedback", ()=><>
<MD language="typescript">{`
## Feedback

Feedback:
~~~~
Overlay.drawer();
~~~~
`}</MD>
<Button onClick={()=>{
	Overlay.feedback("Hey", "success");
}}>
	Open FLash
</Button>
</>);