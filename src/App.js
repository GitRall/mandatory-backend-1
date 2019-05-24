import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Login from './Login';
import Home from './Home';


function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={Login}/>
        <Route path='/home' component={Home}/>
      </div>
    </Router>
  );
}

export default App;
