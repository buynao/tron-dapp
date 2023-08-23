
import eruda from 'eruda';
import { useState, useEffect } from 'react'
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
// polkadot
import PolkadotSign from './polkadot/Sign'
import PolkadotSignRaw from './polkadot/SignRaw'
import PolkadotNominate from './polkadot/Nominate'
import PBond from './polkadot/Bond'
import PUnbond from './polkadot/UnBond'
import ExtraBond from './polkadot/ExtraBond'
import BatchBondNominate from './polkadot/BatchBondNominate';
import WithdrawUnbond from './polkadot/WithdrawUnbond';
import { initClient } from './polkadot/sdk';
import PayoutRewards from './polkadot/PayoutRewards'
import Second from './polkadot/Second';
import DemocracyVote from './polkadot/DemocracyVote';
import CouncilVote from './polkadot/CouncilVote';
// nervos
import NervosTransfer from './nervos/Transfer'
import NervosTransferNFT from './nervos/TransferNFT'
// bitcoin
import BTCTransfer from './bitcoin/Transfer'
// eos
import EOSVote from './eos/Vote'
import Powerup from './eos/Powerup'
import EOSSignMessage from './eos/SignMessage'

function App() {
  const [disabled, toggleDisabled] = useState(true)
  useEffect(() => {
    initClient(toggleDisabled)
  }, [])
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
      <div style={{ marginTop: 20 }} />
      <h3>polkadot/kusama</h3>
      <PolkadotSign disabled={disabled}/>
      <PolkadotSignRaw />
      <PolkadotNominate disabled={disabled} />
      <PBond disabled={disabled} />
      <PUnbond disabled={disabled} />
      <ExtraBond  disabled={disabled}  />
      <BatchBondNominate disabled={disabled} />
      <WithdrawUnbond disabled={disabled} />
      <PayoutRewards disabled={disabled} />
      <Second disabled={disabled} />
      <DemocracyVote disabled={disabled} />
      <CouncilVote disabled={disabled} />
      <div style={{ marginTop: 20 }} />
      <h3>nervos</h3>
      <NervosTransfer />
      <NervosTransferNFT />
      <div style={{ marginTop: 20 }} />
      <h3>bitcoin</h3>
      <BTCTransfer />
      <div style={{ marginTop: 20 }} />
      <h3>eos</h3>
      <EOSVote />
      <Powerup />
      <EOSSignMessage />
    </div>
  )
}

eruda.init()

export default App
