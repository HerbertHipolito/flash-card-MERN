import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

export default function Login(props){

    const [login,loginSet] = useState('')
    const [password,passwordSet] = useState('')
    const [errorMsg,errorMsgSet] = useState(null)

    const navigate = useNavigate()

    const inputs = {login:loginSet,password:passwordSet}

    const inputHandler = (e) =>{
        inputs[e.target.name](e.target.value)
    }

    const clearUpInputs = () => {
        loginSet('')
        passwordSet('')
        errorMsgSet(null)
    }

    const Login = () =>{

        const userInformation = {login,password}

        fetch('/user/login',{
            method: 'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify(userInformation)
        })
        .then(res=>res.json())
        .then(res =>{
            if(res.error){
                clearUpInputs()
                errorMsgSet(res.error)
            }else{
                window.alert('Login successful')
                props.changeLoggedState(true)
                navigate('/')
            }
        })

    }

    return (
        <section id="login-section">
            <h1>Welcome!</h1>
            <div id="login-div">
                <input type="text" name="login" placeholder="login" value={login} onChange={inputHandler} required/>
                <input type="password" name="password" placeholder="password"value={password} onChange={inputHandler} required/>
            </div>
            {errorMsg?<p id="error-message">{errorMsg}</p>:null}
            <p id="create-account-p">Create an account</p>
            <div id="btns-div">
                <button type="submit" id="submit-btn" onClick={Login}>Login</button>
                <button  id="clear" onClick={clearUpInputs}>reset</button>
            </div>
        </section>
    )

}