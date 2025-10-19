"use client";

import { useCallback, useState } from "react";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { enableAndGetAccounts } from "../lib/polkadot";

export function usePolkadotWallet() {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selected, setSelected] = useState<InjectedAccountWithMeta | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);
      const { accounts: accs, isInjected, approved } = await enableAndGetAccounts();

      if (!isInjected) {
        setError("Nenhuma extensão Polkadot detectada. Instale a Talisman.");
        return;
      }
      if (!approved) {
        setError("Conexão não aprovada na extensão.");
        return;
      }
      setAccounts(accs);
      setSelected(accs[0] ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao conectar a Talisman.");
    } finally {
      setConnecting(false);
    }
  }, []);

  return { accounts, selected, setSelected, connect, connecting, error };
}
