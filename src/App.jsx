
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
import FreezeBalance from './components/FreezeBalance'
import FreezeBalanceV2 from './components/FreezeBalanceV2'
import UpdateAccountPermissions from './components/UpdateAccountPermissions';
import SendNFT from './components/SendNFT';
eruda.init()
function App() {
  return (
    <div>
      <SendTrx />
      <SendAsset />
      <SendToken />
      <SendNFT />
      <div style={{ marginTop: 20 }} />
      <SignMessage />
      <SignMessageV2 />
      <div style={{ marginTop: 20 }} />
      <MultiSign />
      <div style={{ marginTop: 20 }} />
      <TriggerSmartContract />
      <Approve />
      <div style={{ marginTop: 20 }} />
      <FreezeBalance />
      <FreezeBalanceV2 />
      <div style={{ marginTop: 20 }} />
      <UpdateAccountPermissions />
    </div>
  )
}

export default App
