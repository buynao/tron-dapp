import eruda from 'eruda';
import { useState } from 'react';
import './App.css';
// tron
import SendTrx from './tron/SendTrx';
import SendAsset from './tron/SendAsset';
import SendToken from './tron/SendToken';
import SignMessage from './tron/signMessage';
import SignMessageV2 from './tron/signMessageV2';
import MultiSign from './tron/muiltSign';
import MultiAction from './tron/MultiAction';
import MultiActionFreeze from './tron/MultiActionUnfreeze';
// 新增的多合约组合组件
import MultiActionDecreaseApprove from './tron/MultiActionDecreaseApprove';
import MultiActionIncreaseApprove from './tron/MultiActionIncreaseApprove';
import MultiActionSmartContract from './tron/MultiActionSmartContract';
import MultiActionTrxUnfreeze from './tron/MultiActionTrxUnfreeze';
import MultiActionApproveTrx from './tron/MultiActionApproveTrx';
import MultiActionTokenUnfreeze from './tron/MultiActionTokenUnfreeze';
import TronAction from './tron/TronAction';
import TriggerSmartContract from './tron/TriggerSmartContract';
import Approve from './tron/Approve';
import FreezeBalance from './tron/FreezeBalance';
import FreezeBalanceV2 from './tron/FreezeBalanceV2';
import UnFreezeBalanceV2 from './tron/UnFreezeBalanceV2';
import UpdateAccountPermissions from './tron/UpdateAccountPermissions';
import SendNFT from './tron/SendNFT';
import ApproveUnimite from './tron/ApproveUnimite';
import ApproveRevoke from './tron/ApproveRevoke';
import DecreaseApprove from './tron/DecreaseApprove';
import IncreaseApprove from './tron/IncreaseApprove';
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
import TezosUnDelegate from './tezos/UnDelegate';
// polkadot
import PolkadotSign from './polkadot/Sign';
import PolkadotSignRaw from './polkadot/SignRaw';
import PolkadotNominate from './polkadot/Nominate';
import PBond from './polkadot/Bond';
import PUnbond from './polkadot/UnBond';
import ExtraBond from './polkadot/ExtraBond';
import BatchBondNominate from './polkadot/BatchBondNominate';
import WithdrawUnbond from './polkadot/WithdrawUnbond';
import { initClient } from './polkadot/sdk';
import PayoutRewards from './polkadot/PayoutRewards';
import Second from './polkadot/Second';
import DemocracyVote from './polkadot/DemocracyVote';
import CouncilVote from './polkadot/CouncilVote';
// nervos
import NervosTransfer from './nervos/Transfer';
import NervosTransferNFT from './nervos/TransferNFT';
// bitcoin
import BTCTransfer from './bitcoin/Transfer';
// eos
import EOSVote from './eos/Vote';
import Powerup from './eos/Powerup';
import EOSSignMessage from './eos/SignMessage';
import EOSTransfer from './eos/Transfer';

function App() {
  const [disabled] = useState(true);

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
      <div
        style={{
          marginTop: 20,
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>多合约签名场景</h4>
        <div style={{ marginBottom: '10px' }}>
          <strong>基础组合:</strong>
        </div>
        <MultiAction />
        <MultiActionFreeze />
        <MultiActionDecreaseApprove />
        <MultiActionIncreaseApprove />
        <MultiActionApproveTrx />
        <MultiActionSmartContract />
        <MultiActionTrxUnfreeze />
        <MultiActionTokenUnfreeze />
      </div>
      <TronAction />
      <div style={{ marginTop: 20 }} />
      <TriggerSmartContract />
      <Approve />
      <ApproveUnimite />
      <ApproveRevoke />
      <IncreaseApprove />
      <DecreaseApprove />
      <div style={{ marginTop: 20 }} />
      <FreezeBalance />
      <FreezeBalanceV2 />
      <UnFreezeBalanceV2 />
      <div style={{ marginTop: 20 }} />
      <UpdateAccountPermissions />
      <div style={{ marginTop: 20 }} />
      <h3>
        cosmos<span style={{ fontSize: '12px' }}>(仅限imToken内使用)</span>
      </h3>
      <Withdraw />
      <Delegate />
      <Redelegate />
      <UnDelegate />
      <ReinvestRewards />
      <Vote />
      <CreateDeposit />
      <div style={{ marginTop: 20 }}>
        <div>
          <span style={{ fontSize: '12px' }}>(Staking DApp暂无调用时机)</span>
        </div>
        <Send />
        <CreateProposal />
      </div>
      <div style={{ marginTop: 20 }} />
      <h3>
        tezos<span style={{ fontSize: '12px' }}>(仅限imToken内使用)</span>
      </h3>
      <TezosDelegate />
      <TezosUnDelegate />
      <div style={{ marginTop: 20 }} />
      <h3>polkadot/kusama</h3>
      <PolkadotSign disabled={disabled} />
      <PolkadotSignRaw />
      <PolkadotNominate disabled={disabled} />
      <PBond disabled={disabled} />
      <PUnbond disabled={disabled} />
      <ExtraBond disabled={disabled} />
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
      <EOSTransfer />
    </div>
  );
}

eruda.init();

export default App;
