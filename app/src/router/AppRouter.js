import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from '../components/Layout/Header/Header'
import HomePage from '../components/Pages/HomePage'
import AlgorithmsPage from '../components/Pages/AlgorithmsPage'
import DataStructuresPage from '../components/Pages/DataStructuresPage'

const AppRouter = () => (
    <BrowserRouter>
        <Header />
        <Switch>
            <Route path='/' component={HomePage} exact={true}/>
            <Route path='/algorithms' component={AlgorithmsPage}/>
            <Route path='/datastructures' component={DataStructuresPage}/>
        </Switch>  
    </BrowserRouter>
);

export default AppRouter;