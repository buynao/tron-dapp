import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - FreezeBalanceV2 + SendToken case
const CONTRACTS = {
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  FREEZE_AMOUNT: 200, // Stake 200 TRX
  RESOURCE_TYPE: 'BANDWIDTH',
  LOCK_PERIOD: 1,
  TOKEN_AMOUNT: 1,
  TOKEN_ID: '1002000',
};

function MultiActionFreezeToken() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // CreateStake transaction
  const createFreezeTransaction = async (tronWeb) => {
    const freeze = await tronWeb.transactionBuilder.freezeBalanceV2(
      tronWeb.toSun(TRANSACTION_PARAMS.FREEZE_AMOUNT),
      TRANSACTION_PARAMS.RESOURCE_TYPE,
      window.tronWeb.defaultAddress.hex,
      TRANSACTION_PARAMS.LOCK_PERIOD,
    );

    return { transaction: freeze };
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
  const mergeTransactions = (freezeTransaction, sendTokenTransaction) => {
    const originalContract = freezeTransaction.transaction.raw_data.contract[1];

    freezeTransaction.transaction.raw_data.contract[1] =
      sendTokenTransaction.raw_data.contract[0];

    return { mergedTransaction: freezeTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionFreezeToken signAndSendTransaction',
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
      message.info('CreateStake + send token transaction...');

      const [freezeTransaction, sendTokenTransaction] = await Promise.all([
        createFreezeTransaction(tronWeb),
        createSendTokenTransaction(tronWeb),
      ]);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        freezeTransaction,
        sendTokenTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('Stake + send tokenTransaction result:', result);
      return result;
    } catch (error) {
      console.error('Stake + send tokenTransaction failed:', error);
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
      message.success('Stake + send tokensucceeded!');
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
      <h3>Stake + send token multi-contract signing</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        Stake {TRANSACTION_PARAMS.FREEZE_AMOUNT} TRX + send token{' '}
        {TRANSACTION_PARAMS.TOKEN_AMOUNT} units
      </p>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run Stake + send token'}
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

export default MultiActionFreezeToken;
