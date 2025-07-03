import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - FreezeBalanceV2 + SendToken 场景
const CONTRACTS = {
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  FREEZE_AMOUNT: 200, // 质押 200 TRX
  RESOURCE_TYPE: 'BANDWIDTH',
  LOCK_PERIOD: 1,
  TOKEN_AMOUNT: 1,
  TOKEN_ID: '1002000',
};

function MultiActionFreezeToken() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建质押交易
  const createFreezeTransaction = async (tronWeb) => {
    const freeze = await tronWeb.transactionBuilder.freezeBalanceV2(
      tronWeb.toSun(TRANSACTION_PARAMS.FREEZE_AMOUNT),
      TRANSACTION_PARAMS.RESOURCE_TYPE,
      window.tronWeb.defaultAddress.hex,
      TRANSACTION_PARAMS.LOCK_PERIOD,
    );

    return { transaction: freeze };
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
  const mergeTransactions = (freezeTransaction, sendTokenTransaction) => {
    const originalContract = freezeTransaction.transaction.raw_data.contract[1];

    freezeTransaction.transaction.raw_data.contract[1] =
      sendTokenTransaction.raw_data.contract[0];

    return { mergedTransaction: freezeTransaction, originalContract };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionFreezeToken signAndSendTransaction',
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
      message.info('创建质押 + 发送代币交易中...');

      const [freezeTransaction, sendTokenTransaction] = await Promise.all([
        createFreezeTransaction(tronWeb),
        createSendTokenTransaction(tronWeb),
      ]);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        freezeTransaction,
        sendTokenTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('质押 + 发送代币交易结果:', result);
      return result;
    } catch (error) {
      console.error('质押 + 发送代币交易执行失败:', error);
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
      message.success('质押 + 发送代币执行成功！');
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
      <h3>质押 + 发送代币多合约签名</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        质押 {TRANSACTION_PARAMS.FREEZE_AMOUNT} TRX + 发送代币{' '}
        {TRANSACTION_PARAMS.TOKEN_AMOUNT} 个
      </p>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行质押 + 发送代币'}
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

export default MultiActionFreezeToken;
