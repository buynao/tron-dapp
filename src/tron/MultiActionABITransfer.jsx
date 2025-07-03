import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - ABI 合约 + 转账场景
const CONTRACTS = {
  ABI_CONTRACT: '41ff7155b5df8008fbf3834922b2d52430b27874f5',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  ABI_CALL_VALUE: 2000000, // ABI 合约调用值 2 TRX
  TRX_AMOUNT: 1, // 转账 80 TRX
};

function MultiActionABITransfer() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建 ABI 智能合约交易 - DEX 流动性添加
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

  // 创建 TRX 转账交易
  const createTrxTransferTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendTrx(
      CONTRACTS.RECIPIENT_ADDRESS,
      tronWeb.toSun(TRANSACTION_PARAMS.TRX_AMOUNT),
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // 合并交易
  const mergeTransactions = (abiTransaction, trxTransaction) => {
    const originalContract = abiTransaction.transaction.raw_data.contract[1];

    abiTransaction.transaction.raw_data.contract[1] =
      trxTransaction.raw_data.contract[0];

    return { mergedTransaction: abiTransaction, originalContract };
  };

  // 签名并发送交易
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

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建 ABI 合约 + TRX 转账交易中...');

      const [abiTransaction, trxTransaction] = await Promise.all([
        createABIContractTransaction(tronWeb),
        createTrxTransferTransaction(tronWeb),
      ]);

      console.log('>>> ABI 合约交易:', abiTransaction);
      console.log('>>> TRX 转账交易:', trxTransaction);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        abiTransaction,
        trxTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('ABI 合约 + TRX 转账交易结果:', result);
      return result;
    } catch (error) {
      console.error('ABI 合约 + TRX 转账交易执行失败:', error);
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
      message.success('ABI 合约 + TRX 转账执行成功！');
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
      <h3>ABI 合约 + TRX 转账多签名交易</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>交易组合说明:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>ABI 合约调用: 添加流动性 (addLiquidityETH)</li>
          <li>调用价值: {TRANSACTION_PARAMS.ABI_CALL_VALUE / 1000000} TRX</li>
          <li>TRX 转账: 发送 {TRANSACTION_PARAMS.TRX_AMOUNT} TRX</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          注意: 此组合适用于 DeFi 操作后的资金转移场景
        </p>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行 ABI 合约 + TRX 转账'}
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

export default MultiActionABITransfer;
