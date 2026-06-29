import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  TARGET_ADDRESS: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  TOKEN_AMOUNT: 100,
  TOKEN_ID: '1002000',
  APPROVE_AMOUNT: 100000000,
};

function MultiAction() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Createtransfer transaction
  const createTransferTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendToken(
      CONTRACTS.TOKEN_ADDRESS,
      TRANSACTION_PARAMS.TOKEN_AMOUNT,
      TRANSACTION_PARAMS.TOKEN_ID,
      CONTRACTS.RECIPIENT_ADDRESS,
    );
  };

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

  // Merge transaction
  const mergeTransactions = async (
    approveTransaction,
    transferTransaction,
    tronWeb,
  ) => {
    // CreatenewMerge transaction
    const mergedTransaction = {
      ...approveTransaction.transaction,
      raw_data: {
        ...approveTransaction.transaction.raw_data,
        contract: [
          ...approveTransaction.transaction.raw_data.contract,
          transferTransaction.raw_data.contract[0],
        ],
      },
    };
    // export const validRawTx = (raw_data: unknown, rawDataHex: string) => {
    //   try {
    //     const tx = TronWeb.utils.transaction.txJsonToPb({ raw_data });
    //     const recalculateRawDataHex: string = TronWeb.utils.bytes.byteArray2hexStr(
    //       tx.getRawData().serializeBinary(),
    //     );

    //     return recalculateRawDataHex.toLowerCase() === rawDataHex.toLowerCase();
    //   } catch (e) {
    //     console.error(e);

    //     return false;
    //   }
    // };
    // const tx = tronWeb.utils.transaction.txJsonToPb({ raw_data });
    // Regenerate raw_data_hex
    const tx = tronWeb.utils.transaction.txJsonToPb(mergedTransaction);
    const rawDataHex = tronWeb.utils.bytes.byteArray2hexStr(
      tx.getRawData().serializeBinary(),
    );

    mergedTransaction.raw_data_hex = rawDataHex;

    return {
      transaction: mergedTransaction,
      txID: mergedTransaction.txID,
    };
  };

  // Sign and verify
  const signAndSendTransaction = async (tronWeb, mergedTransaction) => {
    console.log(
      '>>> mergedTransaction.transaction',
      mergedTransaction.transaction,
    );

    // Sign transaction
    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );
    console.log('>>> signedTransaction', signedTransaction);

    // Verify transactionsigning
    const verifyTransactionSignature = async (signedTx) => {
      try {
        // Get data required for verification
        const rawDataHex = signedTx.raw_data_hex;
        const signature = signedTx.signature[0];
        const signerAddress = tronWeb.defaultAddress.base58;

        if (!rawDataHex || !signature || !signerAddress) {
          console.error('Missing data required for verification');
          return false;
        }

        // Verify signature with raw_data_hex
        const isValid = await tronWeb.trx.verifyMessage(
          rawDataHex,
          signature,
          signerAddress,
        );

        console.log('Transaction signature verification:', {
          txID: signedTx.txID,
          rawDataLength: rawDataHex.length,
          signatureLength: signature.length,
          isValid: isValid,
        });

        return isValid;
      } catch (error) {
        console.error('Error while verifying signature:', error);
        return false;
      }
    };

    // Run verification
    const isValid = await verifyTransactionSignature(signedTransaction);

    if (isValid) {
      console.log('✅ Transaction signature verification succeeded!');
    } else {
      console.warn('⚠️ Transaction signature verification failed, but signing completed normally');
    }

    return signedTransaction;
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('Creating transaction...');

      // ParallelCreatetwo transaction
      const [transferTransaction, approveTransaction] = await Promise.all([
        createTransferTransaction(tronWeb),
        createApproveTransaction(tronWeb),
      ]);

      message.info('Merging transactions...');
      const mergedTransaction = await mergeTransactions(
        approveTransaction,
        transferTransaction,
        tronWeb,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(tronWeb, mergedTransaction);

      console.log('Transaction result:', result);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
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
      message.success('Transaction succeeded!');
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
      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run Approve + Transfer'}
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

export default MultiAction;
