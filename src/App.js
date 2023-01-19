import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './components/home/home';
import Header from './components/header/header';
import Footer from './components/footer/footer'
import React,{useState} from 'react'

function App() {

  const [logged,loggedSet] = useState(false)
  const changeLoggedState = (newState) => loggedSet(newState)

  return (
    <div className="App">
      <Router>
        <Header logged={logged} changeLoggedState={changeLoggedState}/>
          <Routes>
            <Route path="/" element = {<Home logged={logged}/>}/>
          </Routes>
        </Router >
      <Footer logged={logged}/>
    </div>
  );
}

/*

converting pdf to text:

https://stackoverflow.com/questions/1554280/how-to-extract-text-from-a-pdf-in-javascript


*/

export default App;
