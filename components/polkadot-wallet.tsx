"use client";

import { usePolkadotWallet } from "../hooks/usePolkadotWallet";

export default function PolkadotWallet() {
  const { accounts, selected, setSelected, connect, connecting, error } = usePolkadotWallet();

  if (accounts.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={connect} disabled={connecting} className="px-3 py-2 rounded-xl border">
          {connecting ? "Connecting..." : "Connect Talisman"}
        </button>
        {error ? <span className="text-red-500 text-sm">{error}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        className="px-3 py-2 rounded-xl border bg-background"
        value={selected?.address ?? ""}
        onChange={(e) => {
          const acc = accounts.find((a) => a.address === e.target.value) ?? null;
          setSelected(acc);
        }}
      >
        {accounts.map((a) => (
          <option key={a.address} value={a.address}>
            {a.meta.name ?? "Account"} — {a.address}
          </option>
        ))}
      </select>
      {selected ? (
        <span className="text-xs opacity-80">
          Connected: <strong>{selected.meta.name ?? "Account"}</strong>
        </span>
      ) : null}
    </div>
  );
}
