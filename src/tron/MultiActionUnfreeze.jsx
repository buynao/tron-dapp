import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - FreezeBalance + Transfer case
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract address
  SYSTEM: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', // System contract
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  FREEZE_AMOUNT: 100000000, // 100 TRX in SUN for freezing
  TRANSFER_AMOUNT: 1000000, // 50 TRX in SUN
  RESOURCE_TYPE: 'ENERGY', // ENERGY or BANDWIDTH
};

function MultiActionFreeze() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // CreateStake transaction - Use fixed contract structure
  const createFreezeTransaction = async (tronWeb) => {
    // Build the FreezeBalanceV2Contract structure directly
    const freeze = await tronWeb.transactionBuilder.freezeBalanceV2(
      tronWeb.toSun(1),
      'BANDWIDTH',
      window.tronWeb.defaultAddress.hex,
      1,
    );
    console.log('>>> freeze', freeze);

    return { transaction: freeze };
  };

  // Create smart contract transfer transaction.
  const createTransferTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.RECIPIENT_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.TRANSFER_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT, // Use USDT contract
      'transfer(address,uint256)', // transfermethod
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Merge transaction
  const mergeTransactions = (freezeTransaction, transferTransaction) => {
    // Save original contract information; both transactions use the { transaction: {...} } structure.
    const originalContract =
      transferTransaction.transaction.raw_data.contract[0];

    // Add the transfer transaction to the stake transaction.
    transferTransaction.transaction.raw_data.contract[1] =
      freezeTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: transferTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> signAndSendTransaction MultiActionUnfreeze',
      mergedTransaction,
    );
    // Sign transaction - mergedTransaction is now { transaction: {...} } format
    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );

    // Restore original contract information
    signedTransaction.raw_data.contract[1] = originalContract;

    // send transaction
    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('CreateStake + Transfer  transaction...');

      // ParallelCreatetwo transaction
      const [freezeTransaction, transferTransaction] = await Promise.all([
        createFreezeTransaction(tronWeb),
        createTransferTransaction(tronWeb),
      ]);
      console.log('>>> freezeTransaction', freezeTransaction);
      console.log('>>> transferTransaction', transferTransaction);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        freezeTransaction,
        transferTransaction,
      );
      console.log('>>> mergedTransaction', mergedTransaction);

      message.info('Signing and broadcasting transaction...', mergedTransaction);
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('Stake + Transfer Transaction result:', result);
      return result;
    } catch (error) {
      console.error('Stake + Transfer Transaction failed:', error);
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
      message.success('Stake + Transfer succeeded!');
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
      <h3>Stake + Transfer  multi-contract signing</h3>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run Stake + Transfer'}
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

export default MultiActionFreeze;
