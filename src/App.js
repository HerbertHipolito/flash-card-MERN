import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './components/home/home';
import Login from './components/user/loginAndLogout/login';
import Header from './components/header/header';
import MyDeck from './components/user/myDeck/myDeck'
import Footer from './components/footer/footer'
import AccessDeck from './components/user/accessDeck/accessDeck'
import GetIdVideo from './components/user/registerDeck/getIDVideo/getIDvideo';
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
            <Route path="/user/login" element={<Login changeLoggedState={changeLoggedState}/> } />
            <Route path="/deck/myDeck" element={<MyDeck/>} />
            <Route path="/deck/selectVideo" element={<GetIdVideo/>} />
            <Route path="/deck/selectVideo/registerDeck" element={'lacking'} />
            <Route path="/:deckId" element={<AccessDeck/>}></Route>
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
