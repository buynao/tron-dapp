import { Button, message } from "antd";
import { useState } from "react";

// approvaladdress is contract + 4byte no match selector case
const CONTRACTS = {
  USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  FROM_ADDRESS: "TKMBdaT5E5e4X3qtff3aY2ain5pG5WNPL2",
  // contract address as approval target（SunSwap V2 Router）
  SPENDER_CONTRACT: "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax",
};

const TRANSACTION_PARAMS = {
  APPROVE_AMOUNT: 200000000, // approval 200 USDT tocontract
};

function MultiActionApproveContractUnknown() {
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Createapproval transaction（spender  is contract address）
  const createApproveTransaction = async (tronWeb) => {
    const parameter = [
      { type: "address", value: CONTRACTS.SPENDER_CONTRACT },
      { type: "uint256", value: TRANSACTION_PARAMS.APPROVE_AMOUNT },
    ];

    return await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACTS.USDT,
      "approve(address,uint256)",
      {},
      parameter,
      CONTRACTS.FROM_ADDRESS,
    );
  };

  // unknown contractSign transaction（function selector: cef95239，4byte no match）
  const createUnknownContractTransaction = async () => {
    return {
      transaction: {
        visible: false,
        txID: "9c92bf702770942e0bf748a29cda3bf4d7d62e4b932dcb8b4be7e76c45c9a6d5",
        raw_data: {
          contract: [
            {
              parameter: {
                value: {
                  data: "cef95239000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd2100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4a428ab7092c2f1395f376ce297033b3bb446c1000000000000000000000000cebde71077b830b958c8da17bcddeeb85d0bcf25000000000000000000000000834295921a488d9d42b4b3021ed1a3c39fb0f03e0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000276310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002763200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000117573646a32706f6f6c7475736475736474000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                  owner_address: "419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad80",
                  contract_address:
                    "413c9e0ac33f138216c50638d71c344a299d0d1030",
                  call_value: "32314887",
                },
                type_url: "type.googleapis.com/protocol.TriggerSmartContract",
              },
              type: "TriggerSmartContract",
            },
          ],
          ref_block_bytes: "1896",
          ref_block_hash: "488040ab9fab8ca0",
          expiration: 1692253470000,
          fee_limit: 500000000,
          timestamp: 1692253412518,
        },
        raw_data_hex:
          "0a0218962208488040ab9fab8ca040b0faaa91a0315af508081f12f0080a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412ba080a15419b796e0e2412e4f0cabd922fb3ef9f8e99f5ad801215413c9e0ac33f138216c50638d71c344a299d0d10301887acb40f228408cef95239000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000001ed16070000000000000000000000000000000000000000000000001ebef0b5e9c934270000000000000000000000009b796e0e2412e4f0cabd922fb3ef9f8e99f5ad800000000000000000000000000000000000000000000000000000000064ddbd2100000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4a428ab7092c2f1395f376ce297033b3bb446c1000000000000000000000000cebde71077b830b958c8da17bcddeeb85d0bcf25000000000000000000000000834295921a488d9d42b4b3021ed1a3c39fb0f03e0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000276310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002763200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000117573646a32706f6f6c747573647573647400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070a6b9a791a031900180cab5ee01",
      },
    };
  };

  // Append the unknown contract call to the approval transaction contract list.
  const mergeTransactions = (approveTransaction, unknownTransaction) => {
    const originalContract =
      approveTransaction.transaction.raw_data.contract[1];

    approveTransaction.transaction.raw_data.contract[1] =
      unknownTransaction.transaction.raw_data.contract[0];

    return { mergedTransaction: approveTransaction, originalContract };
  };

  const signAndSendTransaction = async (tronWeb, mergedTransaction) => {
    console.log(
      ">>> MultiActionApproveContractUnknown signAndSendTransaction",
      mergedTransaction,
    );

    return await tronWeb.trx.sign(mergedTransaction.transaction);
  };

  const executeMultiAction = async () => {
    const tronWeb = window.tronWeb;

    if (!tronWeb) {
      throw new Error("TronWeb is not loaded; make sure a Tron wallet is connected");
    }

    try {
      message.info("CreateApprove contract + unknown contractSigning transaction...");

      const [approveTransaction, unknownTransaction] = await Promise.all([
        createApproveTransaction(tronWeb),
        createUnknownContractTransaction(),
      ]);

      message.info("Merging transactions...");
      const { mergedTransaction, originalContract } = mergeTransactions(
        approveTransaction,
        unknownTransaction,
      );

      message.info("Signing transaction...");
      const result = await signAndSendTransaction(
        tronWeb,
        mergedTransaction,
        originalContract,
      );

      console.log("Approve contract + unknown contractSign transaction result:", result);
      return result;
    } catch (error) {
      console.error("Approve contract + unknown contract signingTransaction failed:", error);
      throw error;
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    setResultMessage("");

    try {
      const result = await executeMultiAction();
      setResultMessage(`Transaction succeeded: ${JSON.stringify(result)}`);
      message.success("Approve contract + unknown contract signingsucceeded!");
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      setResultMessage(`Transaction failed: ${errorMessage}`);
      message.error(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Approve contract + unknown contract signing multi-contract signing</h3>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        approval 200 USDT tocontract address（{CONTRACTS.SPENDER_CONTRACT}）+
        unknown contract signing（cef95239，4byte no match）
      </p>
      <Button
        type="primary"
        size="large"
        loading={isLoading}
        onClick={handleButtonClick}
        style={{ marginBottom: "16px" }}
      >
        {isLoading ? "Running..." : "Run Approve contract + unknown contract signing"}
      </Button>

      {resultMessage && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            wordBreak: "break-all",
          }}
        >
          <strong>Result:</strong>
          <div style={{ marginTop: "8px" }}>{resultMessage}</div>
        </div>
      )}
    </div>
  );
}

export default MultiActionApproveContractUnknown;
