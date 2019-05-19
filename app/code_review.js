const code_review = document.querySelector(".code_review");

if (code_review !== null && code_review !== undefined) {
  const englishCodeReview = `
    <p><a name="smart_contract_code" href="#">Smart contract code</a></p>
    <p><a name="web3_implementation_code" href="#">Web3 implementation code</a></p>
    <hr>
  `;

  const czechCodeReview = `
    <p><a name="smart_contract_code" href="#">Kód pro smart kontrakt</a></p>
    <p><a name="web3_implementation_code" href="#">Kód pro web3 implementaci</a></p>
    <hr>
  `;

  if (document.documentElement.lang === "cz") {
    code_review.innerHTML = czechCodeReview;
  } else {
    code_review.innerHTML = englishCodeReview;
  }

  // Making sure the links will point to right resources depending on the file
  const code_review_url = window.location.pathname;
  const code_review_filename = code_review_url.substring(code_review_url.lastIndexOf('/')+1);
  const code_review_filename_smart_contract = code_review_filename.split(".")[0] + "ContractCode.html";
  const code_review_filename_web3 = code_review_filename.split(".")[0] + "Web3Code.html";

  document.getElementsByName("smart_contract_code")[0].setAttribute("href", code_review_filename_smart_contract);
  document.getElementsByName("web3_implementation_code")[0].setAttribute("href", code_review_filename_web3);
}
