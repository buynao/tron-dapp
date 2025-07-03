import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - DecreaseApprove + SendToken 场景
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT 合约地址
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TARGET_ADDRESS: 'TDgJmYStKqzawFQyMav8XxNp1pTpdhEWg9',
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  DECREASE_AMOUNT: 50000000, // 减少授权 50 USDT
  TOKEN_AMOUNT: 100,
  TOKEN_ID: '1002000',
};

function MultiActionDecreaseApprove() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建减少授权交易
  const createDecreaseApproveTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.TARGET_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.DECREASE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT,
      'decreaseApproval(address,uint256)',
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // 创建发送代币交易
  const createSendTokenTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendToken(
      CONTRACTS.TOKEN_ADDRESS,
      TRANSACTION_PARAMS.TOKEN_AMOUNT,
      TRANSACTION_PARAMS.TOKEN_ID,
      CONTRACTS.RECIPIENT_ADDRESS,
    );
  };

  // 合并交易
  const mergeTransactions = (
    decreaseApproveTransaction,
    sendTokenTransaction,
  ) => {
    const originalContract =
      decreaseApproveTransaction.transaction.raw_data.contract[1];

    decreaseApproveTransaction.transaction.raw_data.contract[1] =
      sendTokenTransaction.raw_data.contract[0];

    return { mergedTransaction: decreaseApproveTransaction, originalContract };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionDecreaseApprove signAndSendTransaction',
      mergedTransaction,
    );

    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );
    signedTransaction.raw_data.contract[1] = originalContract;

    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建减少授权 + 发送代币交易中...');

      const [decreaseApproveTransaction, sendTokenTransaction] =
        await Promise.all([
          createDecreaseApproveTransaction(tronWeb),
          createSendTokenTransaction(tronWeb),
        ]);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        decreaseApproveTransaction,
        sendTokenTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('减少授权 + 发送代币交易结果:', result);
      return result;
    } catch (error) {
      console.error('减少授权 + 发送代币交易执行失败:', error);
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
      message.success('减少授权 + 发送代币执行成功！');
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
      <h3>减少授权 + 发送代币多合约签名</h3>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行减少授权 + 发送代币'}
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

export default MultiActionDecreaseApprove;
