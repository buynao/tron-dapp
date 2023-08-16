
import './App.css'
import SignTransaction from './components/signTransaction';
import SignMessage from './components/signMessage';
import SignMessageV2 from './components/signMessageV2';
import MultiSign from './components/muiltSign';
import TriggerSmartContract from './components/TriggerSmartContract';
function App() {
  return (
    <div>
      <SignTransaction />
      <SignMessage />
      <SignMessageV2 />
      <MultiSign />
      <TriggerSmartContract />
    </div>
  )
}

export default App
