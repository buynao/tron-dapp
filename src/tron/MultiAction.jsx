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
  const mergeTransactions = async (
    approveTransaction,
    transferTransaction,
    tronWeb,
  ) => {
    // 创建新的合并交易
    const mergedTransaction = {
      ...approveTransaction.transaction,
      raw_data: {
        ...approveTransaction.transaction.raw_data,
        contract: [
          ...approveTransaction.transaction.raw_data.contract,
          transferTransaction.raw_data.contract[0],
        ],
      },
    };
    // export const validRawTx = (raw_data: unknown, rawDataHex: string) => {
    //   try {
    //     const tx = TronWeb.utils.transaction.txJsonToPb({ raw_data });
    //     const recalculateRawDataHex: string = TronWeb.utils.bytes.byteArray2hexStr(
    //       tx.getRawData().serializeBinary(),
    //     );

    //     return recalculateRawDataHex.toLowerCase() === rawDataHex.toLowerCase();
    //   } catch (e) {
    //     console.error(e);

    //     return false;
    //   }
    // };
    // const tx = tronWeb.utils.transaction.txJsonToPb({ raw_data });
    // 重新生成 raw_data_hex
    const tx = tronWeb.utils.transaction.txJsonToPb(mergedTransaction);
    const rawDataHex = tronWeb.utils.bytes.byteArray2hexStr(
      tx.getRawData().serializeBinary(),
    );

    mergedTransaction.raw_data_hex = rawDataHex;

    return {
      transaction: mergedTransaction,
      txID: mergedTransaction.txID,
    };
  };

  // 签名和验证
  const signAndSendTransaction = async (tronWeb, mergedTransaction) => {
    console.log(
      '>>> mergedTransaction.transaction',
      mergedTransaction.transaction,
    );

    // 签名交易
    const signedTransaction = await tronWeb.trx.sign(
      mergedTransaction.transaction,
    );
    console.log('>>> signedTransaction', signedTransaction);

    // 验证交易签名
    const verifyTransactionSignature = async (signedTx) => {
      try {
        // 获取验证所需的数据
        const rawDataHex = signedTx.raw_data_hex;
        const signature = signedTx.signature[0];
        const signerAddress = tronWeb.defaultAddress.base58;

        if (!rawDataHex || !signature || !signerAddress) {
          console.error('缺少验证所需的数据');
          return false;
        }

        // 使用 raw_data_hex 验证签名
        const isValid = await tronWeb.trx.verifyMessage(
          rawDataHex,
          signature,
          signerAddress,
        );

        console.log('交易签名验证:', {
          txID: signedTx.txID,
          rawDataLength: rawDataHex.length,
          signatureLength: signature.length,
          isValid: isValid,
        });

        return isValid;
      } catch (error) {
        console.error('验证签名时出错:', error);
        return false;
      }
    };

    // 执行验证
    const isValid = await verifyTransactionSignature(signedTransaction);

    if (isValid) {
      console.log('✅ 交易签名验证成功！');
    } else {
      console.warn('⚠️ 交易签名验证失败，但签名过程正常完成');
    }

    return signedTransaction;
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
      const mergedTransaction = await mergeTransactions(
        approveTransaction,
        transferTransaction,
        tronWeb,
      );

      message.info('签名并发送交易中...');
      const result = await signAndSendTransaction(tronWeb, mergedTransaction);

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
