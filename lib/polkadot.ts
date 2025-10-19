export async function enableAndGetAccounts(appName = "TransparentGive") {
  const { web3Enable, web3Accounts, isWeb3Injected } = await import("@polkadot/extension-dapp");

  if (typeof window === "undefined") {
    return { accounts: [], isInjected: false, approved: false };
  }
  if (!isWeb3Injected) {
    return { accounts: [], isInjected: false, approved: false };
  }
  const extensions = await web3Enable(appName);
  if (extensions.length === 0) {
    return { accounts: [], isInjected: true, approved: false };
  }
  const accounts = await web3Accounts();
  return { accounts, isInjected: true, approved: true };
}
