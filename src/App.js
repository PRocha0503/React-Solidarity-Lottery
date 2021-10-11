import './App.css';
import web3 from './web3';
import lottery from './lottery';
import {useEffect,useState} from "react";


function App() {

  const [contract,setContract] = useState({
    manager:"",
    players: [], 
    playersEntered: 0,
    totalAmount: "",
    winner: ""
  })
  const [value,setValue] = useState("0") 
  const [message,setMessage] = useState("")
  const [refresh,setRefresh] = useState(0) 

  useEffect((contract) => {
    const lookForManager = async() => {
      const managerF = await lottery.methods.manager().call();
      const playersF = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address)
      setContract({...contract,manager:managerF,players:playersF,playersEntered:playersF.length,totalAmount:balance}); 
      return managerF
    }

    lookForManager()
  },[refresh])

  const onEnter = async(event) => {
    event.preventDefault()
    const accounts  = await web3.eth.getAccounts()
    setMessage("Waiting on transaction success...")
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(value,"ether"),
    })
    setMessage("Congrats! Now you are part of the lottery")
    setRefresh(Math.random()*100)
  }
  const pickWinner = async() => {
    const accounts  = await web3.eth.getAccounts()
    setMessage("Waiting on transaction success...")
     await lottery.methods.pickWinner().send({
      from:accounts[0]
    })
    setMessage("The winner has been chosen")
    setRefresh(Math.random()*100)
  }

  return (
    <div className = "App">
      <h2>Lottery Contract</h2>
      <p>
        Manager: {contract.manager}.
         There are currently {contract.playersEntered} playing to win {web3.utils.fromWei(contract.totalAmount,"ether")} of ether.
        </p>
      <hr />
      <form onSubmit={onEnter}>
        <h4>Want to try your luck</h4>
        <div>
          <label>Amount of Ether to enter</label>
          <input onChange = {event => setValue(event.target.value)} value = {value} className="tag"></input>
          <button className="glow-on-hover">Enter!</button>
        </div>
      </form>
      <hr />
      <div >
        <h4>Ready to pick a Winner</h4>
        <button onClick = {pickWinner} className="glow-on-hover" type="button">Pick</button>
      </div>
      
      <hr />
      <h3>{message}</h3>
    </div>
  );
}

export default App;
