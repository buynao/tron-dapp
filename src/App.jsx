
import eruda from 'eruda';
import './App.css'
// tron
import SendTrx from './tron/SendTrx';
import SendAsset from './tron/SendAsset';
import SendToken from './tron/SendToken';
import SignMessage from './tron/signMessage';
import SignMessageV2 from './tron/signMessageV2';
import MultiSign from './tron/muiltSign';
import TriggerSmartContract from './tron/TriggerSmartContract';
import Approve from './tron/Approve';
import FreezeBalance from './tron/FreezeBalance'
import FreezeBalanceV2 from './tron/FreezeBalanceV2'
import UpdateAccountPermissions from './tron/UpdateAccountPermissions';
import SendNFT from './tron/SendNFT';
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
// tezos
import TezosDelegate from './tezos/Delegate';
import TezosUnDelegate from './tezos/UnDelegate'
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
      <div style={{ marginTop: 20 }} />
      <h3>tezos<span style={{ fontSize: '12px' }}>(仅限imToken内使用)</span></h3>
      <TezosDelegate />
      <TezosUnDelegate />
    </div>
  )
}

eruda.init()

export default App
