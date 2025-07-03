import { Button, message } from 'antd';
import { useState } from 'react';

// 常量配置 - FreezeBalance + Transfer 场景
const CONTRACTS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT 合约地址
  SYSTEM: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', // System contract
  FROM_ADDRESS: 'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
  RECIPIENT_ADDRESS: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
};

const TRANSACTION_PARAMS = {
  FREEZE_AMOUNT: 100000000, // 100 TRX in SUN for freezing
  TRANSFER_AMOUNT: 1000000, // 50 TRX in SUN
  RESOURCE_TYPE: 'ENERGY', // ENERGY or BANDWIDTH
};

function MultiActionFreeze() {
  const [resultMessage, setResultMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建质押交易 - 使用固定合约结构
  const createFreezeTransaction = async (tronWeb) => {
    // 直接构造 FreezeBalanceV2Contract 结构
    const freeze = await tronWeb.transactionBuilder.freezeBalanceV2(
      tronWeb.toSun(1),
      'BANDWIDTH',
      window.tronWeb.defaultAddress.hex,
      1,
    );
    console.log('>>> freeze', freeze);

    return { transaction: freeze };
  };

  // 创建智能合约转账交易
  const createTransferTransaction = async (tronWeb) => {
    const parameter = [
      { type: 'address', value: CONTRACTS.RECIPIENT_ADDRESS },
      { type: 'uint256', value: TRANSACTION_PARAMS.TRANSFER_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT, // 使用 USDT 合约
      'transfer(address,uint256)', // 转账方法
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // 合并交易
  const mergeTransactions = (freezeTransaction, transferTransaction) => {
    // 保存原始合约信息 - 现在两个交易都是 { transaction: {...} } 结构
    const originalContract =
      transferTransaction.transaction.raw_data.contract[0];

    // 将转账交易添加到质押交易中
    transferTransaction.transaction.raw_data.contract[1] =
      freezeTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: transferTransaction, originalContract };
  };

  // 签名并发送交易
  const signAndSendTransaction = async (
    tronWeb,
    mergedTransaction,
    originalContract,
  ) => {
    console.log(
      '>>> signAndSendTransaction MultiActionUnfreeze',
      mergedTransaction,
    );
    // 签名交易 - mergedTransaction 现在是 { transaction: {...} } 格式
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
      message.info('创建质押 + Transfer 交易中...');

      // 并行创建两个交易
      const [freezeTransaction, transferTransaction] = await Promise.all([
        createFreezeTransaction(tronWeb),
        createTransferTransaction(tronWeb),
      ]);
      console.log('>>> freezeTransaction', freezeTransaction);
      console.log('>>> transferTransaction', transferTransaction);

      message.info('合并交易中...');
      const { mergedTransaction, originalContract } = mergeTransactions(
        freezeTransaction,
        transferTransaction,
      );
      console.log('>>> mergedTransaction', mergedTransaction);

      message.info('签名并发送交易中...', mergedTransaction);
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log('质押 + Transfer 交易结果:', result);
      return result;
    } catch (error) {
      console.error('质押 + Transfer 交易执行失败:', error);
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
      message.success('质押 + Transfer 执行成功！');
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
      <h3>质押 + Transfer 多合约签名</h3>

      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: '16px' }}
      >
        {isLoading ? '执行中...' : '执行质押 + Transfer'}
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

export default MultiActionFreeze;
