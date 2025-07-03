import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - SendTrx + UnFreezeBalanceV2 场景
const CONTRACTS = {
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
};

const TRANSACTION_PARAMS = {
  TRX_AMOUNT: 1, // 发送 150 TRX
  UNFREEZE_AMOUNT: 1, // 解冻 100 TRX
  RESOURCE_TYPE: 'BANDWIDTH',
  LOCK_PERIOD: 1,
};

function MultiActionTrxUnfreeze() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建TRX转账交易
  const createSendTrxTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendTrx(
      CONTRACTS.RECIPIENT_ADDRESS,
      tronWeb.toSun(TRANSACTION_PARAMS.TRX_AMOUNT),
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // 创建解冻交易
  const createUnfreezeTransaction = async (tronWeb) => {
    const unfreeze = await tronWeb.transactionBuilder.unfreezeBalanceV2(
      tronWeb.toSun(TRANSACTION_PARAMS.UNFREEZE_AMOUNT),
      TRANSACTION_PARAMS.RESOURCE_TYPE,
      window.tronWeb.defaultAddress.hex,
      TRANSACTION_PARAMS.LOCK_PERIOD,
    );

    return { transaction: unfreeze };
  };

  // 合并交易
  const mergeTransactions = (sendTrxTransaction, unfreezeTransaction) => {
    // 这里需要创建一个新的交易结构，因为sendTrx返回的不是{ transaction: ... }格式
    const mergedTransaction = {
      transaction: {
        ...sendTrxTransaction,
        raw_data: {
          ...sendTrxTransaction.raw_data,
          contract: [
            sendTrxTransaction.raw_data.contract[0],
            unfreezeTransaction.transaction.raw_data.contract[0],
          ],
        },
      },
    };

    return { mergedTransaction, originalContract: null };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiActionTrxUnfreeze signAndSendTransaction',
      mergedTransaction,
    );

    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );

    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建TRX转账 + 解冻交易中...');

      const [sendTrxTransaction, unfreezeTransaction] = await Promise.all([
        createSendTrxTransaction(tronWeb),
        createUnfreezeTransaction(tronWeb),
      ]);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        sendTrxTransaction,
        unfreezeTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('TRX转账 + 解冻交易结果:', result);
      return result;
    } catch (error) {
      console.error('TRX转账 + 解冻交易执行失败:', error);
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
      message.success('TRX转账 + 解冻执行成功！');
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
      <h3>TRX转账 + 解冻多合约签名</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        发送 {TRANSACTION_PARAMS.TRX_AMOUNT} TRX + 解冻{' '}
        {TRANSACTION_PARAMS.UNFREEZE_AMOUNT} TRX
      </p>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行TRX转账 + 解冻'}
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

export default MultiActionTrxUnfreeze;
