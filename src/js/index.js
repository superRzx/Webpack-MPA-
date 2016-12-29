require('../scss/index.scss');
import React from 'react';
import { render } from 'react-dom';
import Main from './jsx/index/Main.jsx';

render(
  <Main/>, 
  document.querySelector('#app')
);


