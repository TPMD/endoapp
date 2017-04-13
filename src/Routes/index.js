import React from 'react';
import { Route} from 'react-router';
import { HomeContainer } from '../Containers/HomeContainer'



export default () => [
  (<Route path='/' component={HomeContainer} key='home'/>)]
