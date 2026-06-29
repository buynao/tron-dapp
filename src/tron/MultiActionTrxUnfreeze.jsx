import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - SendTrx + UnFreezeBalanceV2 case
const CONTRACTS = {
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
};

const TRANSACTION_PARAMS = {
  TRX_AMOUNT: 1, // send 150 TRX
  UNFREEZE_AMOUNT: 1, // unfreeze 100 TRX
  RESOURCE_TYPE: 'BANDWIDTH',
  LOCK_PERIOD: 1,
};

function MultiActionTrxUnfreeze() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // CreateTRXtransfer transaction
  const createSendTrxTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendTrx(
      CONTRACTS.RECIPIENT_ADDRESS,
      tronWeb.toSun(TRANSACTION_PARAMS.TRX_AMOUNT),
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Createunfreeze transaction
  const createUnfreezeTransaction = async (tronWeb) => {
    const unfreeze = await tronWeb.transactionBuilder.unfreezeBalanceV2(
      tronWeb.toSun(TRANSACTION_PARAMS.UNFREEZE_AMOUNT),
      TRANSACTION_PARAMS.RESOURCE_TYPE,
      window.tronWeb.defaultAddress.hex,
      TRANSACTION_PARAMS.LOCK_PERIOD,
    );

    return { transaction: unfreeze };
  };

  // Merge transaction
  const mergeTransactions = (sendTrxTransaction, unfreezeTransaction) => {
    // Need to Createonenew transactionstructure，becausesendTrxdoes not return{ transaction: ... }format
    const mergedTransaction = {
      transaction: {
        ...sendTrxTransaction,
        raw_data: {
          ...sendTrxTransaction.raw_data,
          contract: [
            sendTrxTransaction.raw_data.contract[0],
            unfreezeTransaction.transaction.raw_data.contract[0],
          ],
        },
      },
    };

    return { mergedTransaction, originalContract: null };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionTrxUnfreeze signAndSendTransaction',
      mergedTransaction,
    );

    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );

    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('CreateTRXtransfer + unfreeze transaction...');

      const [sendTrxTransaction, unfreezeTransaction] = await Promise.all([
        createSendTrxTransaction(tronWeb),
        createUnfreezeTransaction(tronWeb),
      ]);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        sendTrxTransaction,
        unfreezeTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('TRXtransfer + unfreezeTransaction result:', result);
      return result;
    } catch (error) {
      console.error('TRXtransfer + unfreezeTransaction failed:', error);
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
      message.success('TRXtransfer + unfreezesucceeded!');
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
      <h3>TRXtransfer + unfreeze multi-contract signing</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        send {TRANSACTION_PARAMS.TRX_AMOUNT} TRX + unfreeze{' '}
        {TRANSACTION_PARAMS.UNFREEZE_AMOUNT} TRX
      </p>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run TRXtransfer + unfreeze'}
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

export default MultiActionTrxUnfreeze;
