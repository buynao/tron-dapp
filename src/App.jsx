
import './App.css'
import SendTrx from './components/SendTrx';
import SendAsset from './components/SendAsset';
import SendToken from './components/SendToken';
import SignMessage from './components/signMessage';
import SignMessageV2 from './components/signMessageV2';
import MultiSign from './components/muiltSign';
import TriggerSmartContract from './components/TriggerSmartContract';
import eruda from 'eruda';
import Approve from './components/Approve';
eruda.init()
function App() {
  return (
    <div>
      <SendTrx />
      <SendAsset />
      <SendToken />
      <SignMessage />
      <SignMessageV2 />
      <MultiSign />
      <TriggerSmartContract />
      <Approve />
    </div>
  )
}

export default App
