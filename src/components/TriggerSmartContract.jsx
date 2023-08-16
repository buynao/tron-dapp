import { Button } from 'antd';
import { useState } from 'react';

function TriggerSmartContract() {
  const [msg, setMsg] = useState('')
  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
        var parameter = [{type:'address',value:'TV3nb5HYFe2xBEmyb3ETe93UGkjAhWyzrs'},{type:'uint256',value:100}];
        var options = {
                feeLimit:100000000,
                callValue:0,
                tokenValue:10,
                tokenId:1000001,
                txLocal:true
            };
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract("413c9e0ac33f138216c50638d71c344a299d0d1030", "transfer(address,uint256)", options,
            parameter,"419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80");
        // const transaction = await tronWeb.transactionBuilder.createAccount('TZ4UXDV5ZhNW7fb2AMSbgfAEZ7hWsnYS2g');

        const signedTransaction  = await tronWeb.trx.sign(transaction.transaction);
        const result = await tronWeb.trx.sendRawTransaction(transaction);
         setMsg(result)
        } catch(e) {
          setMsg(e.message)
        }
      }}>TriggerSmartContract:{msg}</Button>
    </div>
  )
}

export default TriggerSmartContract
