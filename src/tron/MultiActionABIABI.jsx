import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - swapExactETHForTokens + swapExactInput case
const CONTRACTS = {
  ABI_CONTRACT_1: '41ff7155b5df8008fbf3834922b2d52430b27874f5',
  ABI_CONTRACT_2: '413c9e0ac33f138216c50638d71c344a299d0d1030',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
};

const TRANSACTION_PARAMS = {
  FIRST_CALL_VALUE: '1500000', // swapExactETHForTokens call value 1.5 TRX
  SECOND_CALL_VALUE: '3000000', // swapExactInput call value 3 TRX
};

function MultiActionABIABI() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create swapExactETHForTokens(uint256,address[],address,uint256)  transaction
  const createFirstABITransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'abi1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab1',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: '7ff36ab5000000000000000000000000000000000000000000000004fa987d13e6f54ceb00000000000000000000000000000000000000000000000000000000000000800000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000891cdb91d149f23b1a45d9c5ca78a88d0cb44c180000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f2',
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  contract_address:
                    '41ff7155b5df8008fbf3834922b2d52430b27874f5',
                  call_value: TRANSACTION_PARAMS.FIRST_CALL_VALUE,
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: '6c2d',
          ref_block_hash: 'f3e5d7b9a1c4e6f8',
          expiration: 1751509200000,
          fee_limit: 1000000000,
          timestamp: 1751509143234,
        },
        raw_data_hex:
          '0a026c2d2208f3e5d7b9a1c4e6f84090e2b1f0fc325ad402081f12cf020a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e74726163741299020a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541ff7155b5df8008fbf3834922b2d52430b27874f518e0c497922e4017ff36ab5000000000000000000000000000000000000000000000004fa987d13e6f54ceb00000000000000000000000000000000000000000000000000000000000000800000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000891cdb91d149f23b1a45d9c5ca78a88d0cb44c180000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f270e2f4a0f0fc3290018094ebdc02',
      },
    };
  };

  // Create swapExactInput(address[],string[],uint256[],uint24[],(...))  transaction
  const createSecondABITransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'def9876543210fedcba9876543210fedcba9876543210fedcba9876543210fed',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: 'cef95229000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd21',
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  contract_address:
                    '413c9e0ac33f138216c50638d71c344a299d0d1030',
                  call_value: TRANSACTION_PARAMS.SECOND_CALL_VALUE,
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: '7d3e',
          ref_block_hash: 'a2b4c6d8e0fa4b16',
          expiration: 1751509400000,
          fee_limit: 150000000,
          timestamp: 1751509343337,
        },
        raw_data_hex:
          '0a123d3e2208a2b4c6d8e0f2a4b640c0b5c4f0fc325af008081f12eb080a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412b5080a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad801215413c9e0ac33f138216c50638d71c344a299d0d103018c0b8ea16228408cef95229000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd2170a7c5b3f0fc3290018094ebdc03',
      },
    };
  };

  // Merge transaction
  const mergeTransactions = (firstABITransaction, secondABITransaction) => {
    firstABITransaction.transaction.raw_data.contract[1] =
      secondABITransaction.transaction.raw_data.contract[0];

    const tx = tronWeb.utils.transaction.txJsonToPb(
      firstABITransaction.transaction,
    );
    const rawDataHex = tronWeb.utils.bytes.byteArray2hexStr(
      tx.getRawData().serializeBinary(),
    );
    console.log('>>> rawDataHex', rawDataHex);
    firstABITransaction.raw_data_hex = rawDataHex;
    firstABITransaction.transaction.raw_data_hex = rawDataHex;
    return {
      mergedTransaction: firstABITransaction,
    };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (tronWeb, mergedTransaction) => {
    console.log('>>> mergedTransaction', mergedTransaction);

    return await tronWeb.trx.sign(mergedTransaction.transaction);
  };

  // Main execution function
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb is not loaded; make sure a Tron wallet is connected');
    }

    try {
      message.info('Create swapExactETHForTokens + swapExactInput  transaction...');

      const [firstABITransaction, secondABITransaction] = await Promise.all([
        createFirstABITransaction(tronWeb),
        createSecondABITransaction(tronWeb),
      ]);

      console.log('>>> swapExactETHForTokens  transaction:', firstABITransaction);
      console.log('>>> swapExactInput  transaction:', secondABITransaction);

      message.info('Merge swapExactETHForTokens + swapExactInput  transaction...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        firstABITransaction,
        secondABITransaction,
      );

      message.info('Sign and broadcast swapExactETHForTokens + swapExactInput  transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('swapExactETHForTokens + swapExactInput Transaction result:', result);
      return result;
    } catch (error) {
      console.error('swapExactETHForTokens + swapExactInput Transaction failed:', error);
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
      message.success('swapExactETHForTokens + swapExactInput succeeded!');
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
      <h3>swapExactETHForTokens + swapExactInput  multi-action transaction</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>Contract combination:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>swapExactETHForTokens: DEX token swap</li>
          <li>Call value: {TRANSACTION_PARAMS.FIRST_CALL_VALUE / 1000000} TRX</li>
          <li>swapExactInput: multi-path exact-input swap</li>
          <li>
            Call value: {TRANSACTION_PARAMS.SECOND_CALL_VALUE / 1000000} TRX
          </li>
        </ul>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          Note: this is the most complex multi-contract combination and is suitable for advanced DeFi strategy execution
        </p>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run swapExactETHForTokens + swapExactInput'}
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

export default MultiActionABIABI;
