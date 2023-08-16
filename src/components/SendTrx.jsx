import { Button } from 'antd';
function SendTrx() {

  return (
    <div>
      <Button onClick={async () => {
        const tronWeb = window.tronWeb;
        const transaction = await tronWeb.transactionBuilder.sendTrx("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 100, "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL");
        const signedTransaction = tronWeb.trx.sign(transaction);
        tronWeb.trx.sendTransaction(signedTransaction);
      }}>SendTrx</Button>
    </div>
  )
}

export default SendTrx
