import * as React from 'react';

import { storiesOf } from '@storybook/react';
import {ClassUI} from 'classui/index';
import { Flash } from 'classui/Components';

let components = storiesOf('Components.', module);

components.add("Kishore", ()=>{
	return <div>Hello</div>;
})