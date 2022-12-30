import { useNavigate } from 'react-router-dom'

export default function Header(props){

    const navigate = useNavigate()

    const logout = async (e) =>{

      e.preventDefault()

      const myFetch = async ()=>{
        await fetch('/user/logout')
        .then(res=>res.json())
        .then(res=>{
          if(!res.error){
            window.alert('you are logged out');
            props.changeLoggedState(false)
            navigate('/')
          }else{
            console.log(res.error)
          }
        })
      }

      myFetch()

    }

    return  <header>
    <p id="branding">Flash-card</p>
    <div>
      <p><a href = "/" className='link-name'> Home</a></p>
      {props.logged==='loading'?null:props.logged?<p><a href = "/user/myAccount" className='link-name'> Sua conta</a></p>:<p><a href = "/user/Login" className='link-name'>Entrar</a></p>}
      {props.logged==='loading'?null:props.logged?<p><a href = "/user/logout" onClick={logout} className='link-name'> Logout </a></p>:<p><a href = "/user/register" className='link-name'> Registrar</a></p>}
    </div>
  </header>

}