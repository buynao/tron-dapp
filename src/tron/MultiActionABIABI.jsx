import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - ABI 合约 + ABI 合约场景
const CONTRACTS = {
  ABI_CONTRACT_1: '41ff7155b5df8008fbf3834922b2d52430b27874f5', // DEX 合约
  ABI_CONTRACT_2: '413c9e0ac33f138216c50638d71c344a299d0d1030', // 流动性池合约
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
};

const TRANSACTION_PARAMS = {
  FIRST_CALL_VALUE: 1500000, // 第一个 ABI 合约调用值 1.5 TRX
  SECOND_CALL_VALUE: 3000000, // 第二个 ABI 合约调用值 3 TRX
};

function MultiActionABIABI() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建第一个 ABI 智能合约交易 - DEX 交换
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

  // 创建第二个 ABI 智能合约交易 - 流动性操作
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

  // 合并交易
  const mergeTransactions = (firstABITransaction, secondABITransaction) => {
    const originalContract =
      firstABITransaction.transaction.raw_data.contract[1];

    // firstABITransaction.transaction.raw_data.contract[1] =
    //   secondABITransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: firstABITransaction, originalContract };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log('>>> mergedTransaction', mergedTransaction);

    return await tronWeb.trx.sign(mergedTransaction.transaction);
  };

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建双 ABI 合约交易中...');

      const [firstABITransaction, secondABITransaction] = await Promise.all([
        createFirstABITransaction(tronWeb),
        createSecondABITransaction(tronWeb),
      ]);

      console.log('>>> 第一个 ABI 合约交易:', firstABITransaction);
      console.log('>>> 第二个 ABI 合约交易:', secondABITransaction);

      message.info('合并双 ABI 交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        firstABITransaction,
        secondABITransaction,
      );

      message.info('签名并发送双 ABI 交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('双 ABI 合约交易结果:', result);
      return result;
    } catch (error) {
      console.error('双 ABI 合约交易执行失败:', error);
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
      message.success('双 ABI 合约交易执行成功！');
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
      <h3>ABI 合约 + ABI 合约多签名交易</h3>
      <div style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
        <p>
          <strong>双 ABI 合约组合说明:</strong>
        </p>
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li>第一个 ABI 合约: DEX 代币交换 (swapExactETHForTokens)</li>
          <li>调用价值: {TRANSACTION_PARAMS.FIRST_CALL_VALUE / 1000000} TRX</li>
          <li>第二个 ABI 合约: 流动性池操作 (复杂流动性管理)</li>
          <li>
            调用价值: {TRANSACTION_PARAMS.SECOND_CALL_VALUE / 1000000} TRX
          </li>
        </ul>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          注意: 这是最复杂的多合约组合，适用于高级 DeFi 策略执行
        </p>
      </div>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行双 ABI 合约交易'}
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

export default MultiActionABIABI;
