import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - 正常合约 + ABI 合约场景
const CONTRACTS = {
  NORMAL_CONTRACT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT 合约
  ABI_CONTRACT: '41ff7155b5df8008fbf3834922b2d52430b27874f5', // ABI 合约
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TARGET_ADDRESS: 'TDgJmYStKqzawFQyMav8XxNp1pTpdhEWg9',
};

const TRANSACTION_PARAMS = {
  APPROVE_AMOUNT: 50000000, // 普通合约授权 50 USDT
  ABI_CALL_VALUE: 1000000, // ABI 合约调用值 1 TRX
};

function MultiActionNormalABI() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建普通智能合约交易 - USDT 授权
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

  // 创建 ABI 智能合约交易 - 复杂的 DEX 交易
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

  // 合并交易
  const mergeTransactions = (normalTransaction, abiTransaction) => {
    const originalContract = normalTransaction.transaction.raw_data.contract[1];

    normalTransaction.transaction.raw_data.contract[1] =
      abiTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: normalTransaction, originalContract };
  };

  // 签名并发送交易
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

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建普通合约 + ABI 合约交易中...');

      const [normalTransaction, abiTransaction] = await Promise.all([
        createNormalContractTransaction(tronWeb),
        createABIContractTransaction(tronWeb),
      ]);

      console.log('>>> 普通合约交易:', normalTransaction);
      console.log('>>> ABI 合约交易:', abiTransaction);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        normalTransaction,
        abiTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('普通合约 + ABI 合约交易结果:', result);
      return result;
    } catch (error) {
      console.error('普通合约 + ABI 合约交易执行失败:', error);
      throw error;
    }
  };

  // 按钮点击处理函数
  const handleButtonClick = async () => {
    setIsLoading(true);
    setResultMessage('');

    try {
      const result = await executeMultiAction();
      setResultMessage(`交易成功: ${JSON.stringify(result)}`);
      message.success('普通合约 + ABI 合约执行成功！');
    } catch (error) {
      const errorMessage = error.message || '未知错误';
      setResultMessage(`交易失败: ${errorMessage}`);
      message.error(`交易执行失败: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>普通合约 + ABI 合约多签名交易</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>交易组合说明:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>
            普通合约调用: USDT 授权{' '}
            {TRANSACTION_PARAMS.APPROVE_AMOUNT / 1000000} USDT
          </li>
          <li>ABI 合约调用: 复杂 DEX 交易 (swapExactETHForTokens)</li>
          <li>调用价值: {TRANSACTION_PARAMS.ABI_CALL_VALUE / 1000000} TRX</li>
        </ul>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行普通合约 + ABI 合约'}
      </Button>

      {resultMessage && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: resultMessage.includes('成功')
              ? '#f6ffed'
              : '#fff2f0',
            border: `1px solid ${
              resultMessage.includes('成功') ? '#b7eb8f' : '#ffccc7'
            }`,
            borderRadius: '4px',
            wordBreak: 'break-all',
          }}
        >
          <strong>执行结果:</strong>
          <div style={{ marginTop: '8px' }}>{resultMessage}</div>
        </div>
      )}
    </div>
  );
}

export default MultiActionNormalABI;
