import { Button, message } from 'antd';
function SendNFT() {
  return (
    <div>
      <Button
        disabled
        onClick={async () => {
          const tronWeb = window.tronWeb;
          try {
          message.info("发起交易中...")
          setLoading(true)
            const trc721ContractAddress = "TRio4FwnDvtYN2ogss6Qm7Hn2EaTLwWMNs";//contract address
            console.log(">>>>>>>>trc721ContractAddress", trc721ContractAddress)
            let contract = await tronWeb.contract().at(trc721ContractAddress);
            console.log(">>>>>>>>contract", contract)
            const result = await contract.transferFrom(
                "TA1g2WQiXbU5GnYBTJ5Cp22dvSjT3ug9uK", //address _from
                "TM8vRhebJD7zeoBLWAnr9SrYrhWNrHjBgC", //address _to
                666 //uint256 tokenId
            )
            console.log(">>>>>>>>result", result)
          } catch(e) {
            console.log(">>>>", e)
          }
        }}>SendNFT</Button>
    </div>
  )
}

export default SendNFT
