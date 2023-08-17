
import eruda from 'eruda';
import './App.css'

// tron
import SendTrx from './components/SendTrx';
import SendAsset from './components/SendAsset';
import SendToken from './components/SendToken';
import SignMessage from './components/signMessage';
import SignMessageV2 from './components/signMessageV2';
import MultiSign from './components/muiltSign';
import TriggerSmartContract from './components/TriggerSmartContract';
import Approve from './components/Approve';
import FreezeBalance from './components/FreezeBalance'
import FreezeBalanceV2 from './components/FreezeBalanceV2'
import UpdateAccountPermissions from './components/UpdateAccountPermissions';
import SendNFT from './components/SendNFT';
// cosmos
import Withdraw from './cosmos/Withdraw';
import Delegate from './cosmos/Delegate';
import ReinvestRewards from './cosmos/ReinvestRewards';
import Vote from './cosmos/Vote';
import UnDelegate from './cosmos/UnDelegate';
import Send from './cosmos/Send';
import Redelegate from './cosmos/Redelegate';
import CreateDeposit from './cosmos/CreateDeposit';
import CreateProposal from './cosmos/CreateProposal';

function App() {
  return (
    <div>
      <h3>tron</h3>
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
      <div style={{ marginTop: 20 }} />
      <h3>cosmos<span style={{ fontSize: '12px' }}>(仅限imToken内使用)</span></h3>
      <Withdraw />
      <Delegate />
      <Redelegate />
      <UnDelegate />
      <ReinvestRewards />
      <Vote />
      <CreateDeposit />
      <div style={{ marginTop: 20 }} />
      <span style={{ fontSize: '12px' }}>(Staking DApp暂无调用时机)</span>
      <Send />
      <CreateProposal />
    </div>
  )
}

eruda.init()

export default App
