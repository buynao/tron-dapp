import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - SendToken + UnFreezeBalanceV2 场景
const CONTRACTS = {
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  TOKEN_AMOUNT: 200,
  TOKEN_ID: '1002000',
  UNFREEZE_AMOUNT: 300, // 解冻 300 TRX
  RESOURCE_TYPE: 'ENERGY',
  LOCK_PERIOD: 1,
};

function MultiActionTokenUnfreeze() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建发送代币交易
  const createSmartContractTransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: '9c92bf702770942e0bf748a29cda3bf4d7d62e4b932dcb8b4be7e76c45c9a6d5',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: 'cef95229000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd2100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4a428ab7092c2f1395f376ce297033b3bb446c1000000000000000000000000cebde71077b830b958c8da17bcddeeb85d0bcf25000000000000000000000000834295921a488d9d42b4b3021ed1a3c39fb0f03e0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000276310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002763200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000117573646a32706f6f6c7475736475736474000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  contract_address:
                    '413c9e0ac33f138216c50638d71c344a299d0d1030',
                  call_value: 32314887,
                },
                type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
              },
              type: 'TriggerSmartContract',
            },
          ],
          ref_block_bytes: '1896',
          ref_block_hash: '488040ab9fab8ca0',
          expiration: 1692253470000,
          fee_limit: 500000000,
          timestamp: 1692253412518,
        },
        raw_data_hex:
          '0a0218962208488040ab9fab8ca040b0faaa91a0315af508081f12f0080a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412ba080a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad801215413c9e0ac33f138216c50638d71c344a299d0d10301887acb40f228408cef95229000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd2100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4a428ab7092c2f1395f376ce297033b3bb446c1000000000000000000000000cebde71077b830b958c8da17bcddeeb85d0bcf25000000000000000000000000834295921a488d9d42b4b3021ed1a3c39fb0f03e0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000276310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002763200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000117573646a32706f6f6c747573647573647400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070a6b9a791a031900180cab5ee01',
      },
    };
  };

  // 创建赎回交易
  const createUnfreezeTransaction = async (tronWeb) => {
    return {
      transaction: {
        visible: false,
        txID: 'e1df940b1891f606fa406d5d68a253f15960c968f88c2c1edf2de8b3b400de42',
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  owner_address: '419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80',
                  unfreeze_balance: 1000000,
                },
                type_url:
                  'type.googleapis.com/protocol.UnfreezeBalanceV2Contract',
              },
              type: 'UnfreezeBalanceV2Contract',
            },
          ],
          ref_block_bytes: '10da',
          ref_block_hash: '68fa50ec33c7679d',
          expiration: 1751461872000,
          timestamp: 1751461813152,
        },
        raw_data_hex:
          '0a0210da220868fa50ec33c7679d4080838ddafc325a59083712550a36747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e556e667265657a6542616c616e63655632436f6e7472616374121b0a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad8010c0843d70a0b789dafc32',
      },
    };
  };

  // 合并交易
  const mergeTransactions = (sendTokenTransaction, unfreezeTransaction) => {
    // 创建新的交易结构
    const mergedTransaction = {
      transaction: {
        ...sendTokenTransaction,
        raw_data: {
          ...sendTokenTransaction.raw_data,
          contract: [
            sendTokenTransaction.transaction.raw_data.contract[0],
            unfreezeTransaction.transaction.raw_data.contract[0],
          ],
        },
      },
    };

    return {
      mergedTransaction: {
        ...sendTokenTransaction.transaction,
        raw_data: {
          ...sendTokenTransaction.transaction.raw_data,
          contract: [
            sendTokenTransaction.transaction.raw_data.contract[0],
            unfreezeTransaction.transaction.raw_data.contract[0],
          ],
        },
      },
      originalContract: null,
    };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionTokenUnfreeze signAndSendTransaction',
      mergedTransaction,
    );

    return await tronWeb.trx.sign(mergedTransaction);
  };

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建发送代币 + 解冻交易中...');

      const [sendTokenTransaction, unfreezeTransaction] = await Promise.all([
        createSmartContractTransaction(tronWeb),
        createUnfreezeTransaction(tronWeb),
      ]);
      console.log('>>> sendTokenTransaction', sendTokenTransaction);
      console.log('>>> unfreezeTransaction', unfreezeTransaction);
      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        sendTokenTransaction,
        unfreezeTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('发送代币 + 解冻交易结果:', result);
      return result;
    } catch (error) {
      console.error('发送代币 + 解冻交易执行失败:', error);
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
      message.success('发送代币 + 解冻执行成功！');
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
      <h3>智能合约 + 赎回多合约签名</h3>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '智能合约 + 赎回'}
      </Button>

      {resultMessage && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
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

export default MultiActionTokenUnfreeze;
