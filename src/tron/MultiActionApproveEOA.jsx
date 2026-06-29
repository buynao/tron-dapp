import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - Approve + SendTrx case
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TARGET_ADDRESS: 'TZ5VUwCDAUrF2Bp573R1u89SQ4bj5nk7Kw',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  APPROVE_AMOUNT: 200000000, // Approve EOA 200 USDT
  TRX_AMOUNT: 2, // send 2 TRX
};

function MultiActionApproveTrx() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Createapproval transaction
  const createApproveTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.TARGET_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.APPROVE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT,
      'approve(address,uint256)',
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Createredeem transaction
  const createUnfreezeTransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'e1df940b1891f606fa406d5d68a253f15960c968f88c2c1edf2de8b3b400de42',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  unfreeze_balance: 1000000,
                },
                type_url:
                  'type.googleapis.com/protocol.UnfreezeBalanceV2Contract',
              },
              type: 'UnfreezeBalanceV2Contract',
            },
          ],
          ref_block_bytes: '10da',
          ref_block_hash: '68fa50ec33c7679d',
          expiration: 1751461872000,
          timestamp: 1751461813152,
        },
        raw_data_hex:
          '0a0210da220868fa50ec33c7679d4080838ddafc325a59083712550a36747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e556e667265657a6542616c616e63655632436f6e7472616374121b0a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad8010c0843d70a0b789dafc32',
      },
    };
  };

  // Merge transaction
  const mergeTransactions = (approveTransaction, sendTrxTransaction) => {
    const originalContract =
      approveTransaction.transaction.raw_data.contract[1];

    approveTransaction.transaction.raw_data.contract[1] =
      sendTrxTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: approveTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (tronWeb, mergedTransaction) => {
    console.log(
      '>>> MultiActionApproveTrx signAndSendTransaction',
      mergedTransaction,
    );

    return await tronWeb.trx.sign(mergedTransaction.transaction);
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('CreateApprove EOA + redeem transaction...');

      const [approveTransaction, sendTrxTransaction] = await Promise.all([
        createApproveTransaction(tronWeb),
        createUnfreezeTransaction(tronWeb),
      ]);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        approveTransaction,
        sendTrxTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('Approve EOA + redeemTransaction result:', result);
      return result;
    } catch (error) {
      console.error('Approve EOA + redeemTransaction failed:', error);
      throw error;
    }
  };

  // Button click handler
  const handleButtonClick = async () => {
    setIsLoading(true);
    setResultMessage('');

    try {
      const result = await executeMultiAction();
      setResultMessage(`Transaction succeeded: ${JSON.stringify(result)}`);
      message.success('Approve EOA + redeemsucceeded!');
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      setResultMessage(`Transaction failed: ${errorMessage}`);
      message.error(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Approve EOA + redeem multi-contract signing</h3>
      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run Approve EOA + redeem'}
      </Button>

      {resultMessage && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            wordBreak: 'break-all',
          }}
        >
          <strong>Result:</strong>
          <div style={{ marginTop: '8px' }}>{resultMessage}</div>
        </div>
      )}
    </div>
  );
}

export default MultiActionApproveTrx;
