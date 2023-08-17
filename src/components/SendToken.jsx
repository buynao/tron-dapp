import { Button } from 'antd';
function SendToken() {

  return (
    <div>
      <Button onClick={async () => {
        try {
        const tronWeb = window.tronWeb;
        const transaction = await tronWeb.transactionBuilder.sendToken("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "1002000", "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
        const signedTransaction = tronWeb.trx.sign(transaction);
        tronWeb.trx.sendTransaction(signedTransaction);
        } catch(e) {
          console.warn(e)
        }
      }}>SendToken(TRC10)</Button>
    </div>
  )
}

export default SendToken
