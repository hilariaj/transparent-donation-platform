"use client";


import { useCallback, useEffect, useState } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { enableAndGetAccounts } from "../lib/polkadot";

const LS_KEY = "tg:selected-ss58";

export function usePolkadotWallet() {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selected, setSelected] = useState<InjectedAccountWithMeta | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInjected, setIsInjected] = useState<boolean | null>(null);
  const [approved, setApproved] = useState(false);
  const [lockedLike, setLockedLike] = useState(false);


  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);
      setLockedLike(false);

      const res = await enableAndGetAccounts();
      setIsInjected(res.isInjected);
      setApproved(res.approved);

      //const { isInjected, approved, accounts: accs } = await enableAndGetAccounts();

      setAccounts(res.accounts);
      if (res.accounts.length === 0 && res.isInjected && res.approved) {
        // extension probably BLOCKED ("Unlock the Talisman" screen) or no accounts
        setLockedLike(true);
        return;
      }

      
      const saved = localStorage.getItem(LS_KEY);
      const restored = res.accounts.find((a) => a.address === saved) ?? res.accounts[0] ?? null;
      setSelected(restored);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao conectar a Talisman.");
    } finally {
      setConnecting(false);
    }
  }, []);


   useEffect(() => {
    if (selected) localStorage.setItem(LS_KEY, selected.address);
  }, [selected]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { web3AccountsSubscribe, isWeb3Injected } = await import("@polkadot/extension-dapp");
        if (!isWeb3Injected) return;
        unsub = await web3AccountsSubscribe((accs) => {
          const onlySub = (accs as any[]).filter((a) => !a.meta?.isEthereum);
          setAccounts(onlySub);
          setLockedLike(isWeb3Injected && approved && onlySub.length === 0);
          if (selected && !onlySub.find((a) => a.address === selected.address)) {
            setSelected(onlySub[0] ?? null);
          }
        });
      } catch {}
    })();
    return () => unsub?.();
  }, [approved, selected]);

  const disconnect = useCallback(() => {
    setAccounts([]);
    setSelected(null);
    setApproved(false);
    setLockedLike(false);
    localStorage.removeItem(LS_KEY);
  }, []);


  return {
    isInjected,
    approved,
    lockedLike,
    accounts,
    selected,
    setSelected,
    connecting,
    error,
    connect,
    disconnect,
  };
}

