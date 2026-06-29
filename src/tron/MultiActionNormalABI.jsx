import { Button, message } from 'antd';
import { useState } from 'react';

// Constant configuration - approve + swapExactETHForTokens case
const CONTRACTS = {
  NORMAL_CONTRACT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT contract
  ABI_CONTRACT: '41ff7155b5df8008fbf3834922b2d52430b27874f5',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TARGET_ADDRESS: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax',
};

const TRANSACTION_PARAMS = {
  APPROVE_AMOUNT: 50000000, // normal contractapproval 50 USDT
  ABI_CALL_VALUE: '1000000', // swapExactETHForTokens call value 1 TRX
};

function MultiActionNormalABI() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create approve(address,uint256) approval transaction
  const createNormalContractTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.TARGET_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.APPROVE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.NORMAL_CONTRACT,
      'approve(address,uint256)',
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // Create swapExactETHForTokens(uint256,address[],address,uint256)  transaction
  const createABIContractTransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'c077d69635868e6e1c90ed5ed25ed693110c7e4039611469bf28b380085d4101',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: '7ff36ab5000000000000000000000000000000000000000000000004fa987d13e6f54ceb00000000000000000000000000000000000000000000000000000000000000800000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000891cdb91d149f23b1a45d9c5ca78a88d0cb44c180000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f2',
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
          ref_block_bytes: '4d94',
          ref_block_hash: 'd400a553aade4a5a',
          expiration: 1751508522000,
          fee_limit: 1000000000,
          timestamp: 1751508465203,
        },
        raw_data_hex:
          '0a024d942208d400a553aade4a5a4090a8acf0fc325ad402081f12cf020a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e74726163741299020a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80121541ff7155b5df8008fbf3834922b2d52430b27874f518c0843d22e4017ff36ab5000000000000000000000000000000000000000000000004fa987d13e6f54ceb00000000000000000000000000000000000000000000000000000000000000800000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80000000000000000000000000000000000000000000000000000000006865e62d0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000891cdb91d149f23b1a45d9c5ca78a88d0cb44c180000000000000000000000002c1ebf7737aabf5bd3e38f1f31da3cd2b7a268f270b3eca8f0fc3290018094ebdc03',
      },
    };
  };

  // Merge transaction
  const mergeTransactions = (normalTransaction, abiTransaction) => {
    const originalContract = normalTransaction.transaction.raw_data.contract[1];

    normalTransaction.transaction.raw_data.contract[1] =
      abiTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: normalTransaction, originalContract };
  };

  // Sign and broadcast transaction
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionNormalABI signAndSendTransaction',
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
      message.info('Create approve + swapExactETHForTokens  transaction...');

      const [normalTransaction, abiTransaction] = await Promise.all([
        createNormalContractTransaction(tronWeb),
        createABIContractTransaction(tronWeb),
      ]);

      console.log('>>> approve  transaction:', normalTransaction);
      console.log('>>> swapExactETHForTokens  transaction:', abiTransaction);

      message.info('Merging transactions...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        normalTransaction,
        abiTransaction,
      );

      message.info('Signing and broadcasting transaction...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('approve + swapExactETHForTokens Transaction result:', result);
      return result;
    } catch (error) {
      console.error('approve + swapExactETHForTokens Transaction failed:', error);
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
      message.success('approve + swapExactETHForTokens succeeded!');
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
      <h3>approve + swapExactETHForTokens  multi-action transaction</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>Transaction combination:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>
            approve approval: USDT{' '}
            {TRANSACTION_PARAMS.APPROVE_AMOUNT / 1000000} USDT
          </li>
          <li>swapExactETHForTokens: DEX token swap</li>
          <li>Call value: {TRANSACTION_PARAMS.ABI_CALL_VALUE / 1000000} TRX</li>
        </ul>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? 'Running...' : 'Run approve + swapExactETHForTokens'}
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

export default MultiActionNormalABI;
