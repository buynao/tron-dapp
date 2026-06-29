import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - addLiquidity + transfercase
const CONTRACTS = {
  ABI_CONTRACT: '41ff7155b5df8008fbf3834922b2d52430b27874f5',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  ABI_CALL_VALUE: '2000000', // addLiquidity call value 2 TRX
  TRX_AMOUNT: 1, // transfer 80 TRX
};

function MultiActionABITransfer() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)  transaction
  const createABIContractTransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: 'e8e337000000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f2000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000001550f7dca70000000000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d',
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  contract_address:
                    '41ff7155b5df8008fbf3834922b2d52430b27874f5',
                  call_value: TRANSACTION_PARAMS.ABI_CALL_VALUE,
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: '5a1b',
          ref_block_hash: 'e2f4a6b8c9d1a3b5',
          expiration: 1751509000000,
          fee_limit: 1000000000,
          timestamp: 1751508943821,
        },
        raw_data_hex:
          '0a025a1b2208e2f4a6b8c9d1a3b54088d9adf0fc325aef02081f12ea020a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412b4020a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541ff7155b5df8008fbf3834922b2d52430b27874f518c09a0c22e801e8e337000000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f2000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000001550f7dca70000000000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d70cdf6a5f0fc3290018094ebdc03',
      },
    };
  };

  // Create TRX transfer transaction
  const createTrxTransferTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendTrx(
      CONTRACTS.RECIPIENT_ADDRESS,
      tronWeb.toSun(TRANSACTION_PARAMS.TRX_AMOUNT),
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Merge transaction
  const mergeTransactions = (abiTransaction, trxTransaction) => {
    const originalContract = abiTransaction.transaction.raw_data.contract[1];

    abiTransaction.transaction.raw_data.contract[1] =
      trxTransaction.raw_data.contract[0];

    return { mergedTransaction: abiTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionABITransfer signAndSendTransaction',
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
      message.info('Create addLiquidity + TRX transfer transaction...');

      const [abiTransaction, trxTransaction] = await Promise.all([
        createABIContractTransaction(tronWeb),
        createTrxTransferTransaction(tronWeb),
      ]);

      console.log('>>> addLiquidity  transaction:', abiTransaction);
      console.log('>>> TRX transfer transaction:', trxTransaction);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        abiTransaction,
        trxTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('addLiquidity + TRX transferTransaction result:', result);
      return result;
    } catch (error) {
      console.error('addLiquidity + TRX transferTransaction failed:', error);
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
      message.success('addLiquidity + TRX transfersucceeded!');
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
      <h3>addLiquidity + TRX transfer multi-action transaction</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>Transaction combination:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>addLiquidity: add liquidity</li>
          <li>Call value: {TRANSACTION_PARAMS.ABI_CALL_VALUE / 1000000} TRX</li>
          <li>TRX transfer: send {TRANSACTION_PARAMS.TRX_AMOUNT} TRX</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          Note: this combination is useful for fund movement after DeFi operations
        </p>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run addLiquidity + TRX transfer'}
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

export default MultiActionABITransfer;
