import React,{useContext, useState} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import AppContext from "./dataprovider";
import { useNavigate } from "react-router-dom";
function Login(){
     const [login,setLogin] = useState("")
        const [mdps,setMdps] = useState("")
        const [notvalide,setNotvalid] = useState(false)
        const {logedin,setLogedin} = useContext(AppContext)
        const nav = useNavigate()
    
        const getlogin = (e) => {
         setLogin((l) => e.target.value)
         console.log(login)
        }
        const getmdps = (e) => {
            setMdps((p) => e.target.value)
         console.log(mdps)

           }
        const checkdata =  async () =>{
            const url = "http://127.0.0.1:8080/logininfo"
            var data = {login:login,password:mdps}
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set the content type
                },
                body: JSON.stringify(data), // Convert your data to JSON
            })
            if (!response.ok){
                setNotvalid(true)
                console.log("itsgood")
            }
            else {
                setNotvalid(false)
                console.log("noooooo")
                setLogedin(true)
                nav("/admin")

            };
        }
        const check = () =>{
            console.log("i am checking")
            checkdata()
            console.log(notvalide)
        }
  return(
    <div className= "">
        { notvalide && (<div className='alert alert-warning'>le mdps est fausse</div>)
    }
    <ul className="nav nav-tabs" id="myTab" role="tablist">
  <li className="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">adminstrateur</button>
  </li>
  <li className="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">professeur</button>
  </li>
</ul>
<div className="tab-content" id="myTabContent">
  <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
 
  <div className="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={getlogin}/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" onChange={getmdps}/>
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button className="btn btn-primary" onClick={check}>Submit</button>

    </div>
  <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
  <form>
  <div className="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={getlogin}/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" onChange={getmdps}/>
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" className="btn btn-primary" onClick={check}>Submit</button>
</form>
  </div>
</div>
</div>
  )
}

export default Login;
