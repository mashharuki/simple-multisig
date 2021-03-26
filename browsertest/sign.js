// デモページ用JavaScript
// web3.js は、Ethereum のローカルまたはリモートノードと対話するためのライブラリ群

// 署名内容を解析するための関数
// signature：書名済みデータ
function parseSignature(signature) {
  // 0~64番目を変数rに格納する
  var r = signature.substring(0, 64);
  // 64~128番目を変数sに格納する
  var s = signature.substring(64, 128);
  // 128~130番目を変数vに格納する
  var v = signature.substring(128, 130);
  // 戻り値を返す。
  return {
      r: "0x" + r,
      s: "0x" + s,
      v: parseInt(v, 16)
  }
}

// ページの読み込みが完了したら実行する処理
window.onload = function (e) {
  // 紐づいているアカウントが0でないかチェックする。
  if (web3.eth.accounts[0] == null) {
    // メタマスクを使うように、アラートを表示するようにする。
    alert("Please unlock MetaMask first");
    web3.currentProvider.enable().catch(alert);
  }
  // 署名ボタンを取得する。
  var signBtn = document.getElementById("signBtn");
  // 署名ボタンが押された時の処理を記述
  signBtn.onclick = function(e) {
    // 紐づいているアカウントがないときは、何もせずに終了
    if (web3.eth.accounts[0] == null) {
      return;
    }
    // 定数をドメインを設定する。
    const domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: " salt", type: "bytes32" }
    ];
    // 定数マルチシグトランザクションを設定する。
    const multiSigTx = [
      { name: "destination", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "nonce", type: "uint256" },
      { name: "executor", type: "address" },
      { name: "gasLimit", type: "uint256" }
    ];

    const domainData = {
      name: "Simple MultiSig",
      version: "1",
      chainId: parseInt(web3.version.network, 10),
      verifyingContract: document.getElementById("walletAddress").value,
      salt: "0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0"
    };

    var message = {
      destination: document.getElementById("destination").value,
      value: document.getElementById("value").value,
      data: document.getElementById("data").value,
      nonce: parseInt(document.getElementById("nonce").value, 10),
      executor: document.getElementById("executor").value,
      gasLimit: parseInt(document.getElementById("gasLimit").value, 10),
    };
    // 上記で設定した値をJSON形式のデータに変換する。
    const data = JSON.stringify({
      types: {
        EIP712Domain: domain,
        MultiSigTransaction: multiSigTx
      },
      domain: domainData,
      primaryType: "MultiSigTransaction",
      message: message
    });
    // コンソール上に表示する。
    console.log(data)
    //　署名者を取得する。
    const signer = web3.eth.accounts[0];
    // コンソール上に表示する。
    console.log(signer)
    // sendAsync関数を実行する。
    web3.currentProvider.sendAsync(
      {
        method: "eth_signTypedData_v3",
        params: [signer, data],
        from: signer
      }, 
      function(err, result) {
        // エラーであればコンソールにその旨表示して終了
        if (err || result.error) {
          return console.error(result);
        }
        // 署名データを渡して解析する。
        const signature = parseSignature(result.result.substring(2));
        // 解析した署名内容を出力する。
        document.getElementById("signedData").value = "r: " + signature.r + "\ns: " + signature.s + "\nv: " + signature.v
      }
    );
  };
}
