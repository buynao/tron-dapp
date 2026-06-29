import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - DecreaseApprove + SendToken case
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract address
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TARGET_ADDRESS: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  DECREASE_AMOUNT: 50000000, // decreaseapproval 50 USDT
  TOKEN_AMOUNT: 100,
  TOKEN_ID: '1002000',
};

function MultiActionDecreaseApprove() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Createdecreaseapproval transaction
  const createDecreaseApproveTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.TARGET_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.DECREASE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT,
      'decreaseApproval(address,uint256)',
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Createsend token transaction
  const createSendTokenTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendToken(
      CONTRACTS.TOKEN_ADDRESS,
      TRANSACTION_PARAMS.TOKEN_AMOUNT,
      TRANSACTION_PARAMS.TOKEN_ID,
      CONTRACTS.RECIPIENT_ADDRESS,
    );
  };

  // Merge transaction
  const mergeTransactions = (
    decreaseApproveTransaction,
    sendTokenTransaction,
  ) => {
    const originalContract =
      decreaseApproveTransaction.transaction.raw_data.contract[1];

    decreaseApproveTransaction.transaction.raw_data.contract[1] =
      sendTokenTransaction.raw_data.contract[0];

    return { mergedTransaction: decreaseApproveTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionDecreaseApprove signAndSendTransaction',
      mergedTransaction,
    );

    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );
    signedTransaction.raw_data.contract[1] = originalContract;

    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('Createdecreaseapproval + send token transaction...');

      const [decreaseApproveTransaction, sendTokenTransaction] =
        await Promise.all([
          createDecreaseApproveTransaction(tronWeb),
          createSendTokenTransaction(tronWeb),
        ]);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        decreaseApproveTransaction,
        sendTokenTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('decreaseapproval + send tokenTransaction result:', result);
      return result;
    } catch (error) {
      console.error('decreaseapproval + send tokenTransaction failed:', error);
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
      message.success('decreaseapproval + send tokensucceeded!');
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
      <h3>decreaseapproval + send token multi-contract signing</h3>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run decreaseapproval + send token'}
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

export default MultiActionDecreaseApprove;
