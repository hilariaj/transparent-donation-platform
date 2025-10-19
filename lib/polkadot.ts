
export type EnableResult = {
  isInjected: boolean;
  approved: boolean;
  accounts: import("@polkadot/extension-inject/types").InjectedAccountWithMeta[];
};


export async function enableAndGetAccounts(appName = "TransparentGive"): Promise<EnableResult> {
  if (typeof window === "undefined") return { isInjected: false, approved: false, accounts: [] };

  const { web3Enable, web3Accounts, isWeb3Injected } = await import("@polkadot/extension-dapp");
  if (!isWeb3Injected) return { isInjected: false, approved: false, accounts: [] };

  const exts = await web3Enable(appName);
  if (exts.length === 0) return { isInjected: true, approved: false, accounts: [] };


  // 42 = Generic (great for dev). Change to 0 if you want Polkadot mainnet format.
  const all = await web3Accounts({ ss58Format: 42 });

  // Talisman marks EVM with meta.isEthereum = true. We only keep Substrate:
  const substrateOnly = (all as any[]).filter((a) => !a.meta?.isEthereum);

  return { isInjected: true, approved: true, accounts: substrateOnly };
}
