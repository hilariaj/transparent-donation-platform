"use client";

import { usePolkadotWallet } from "../hooks/usePolkadotWallet";

export default function PolkadotWallet() {
  const { isInjected,
    approved,
    lockedLike,
    accounts,
    selected,
    setSelected,
    connecting,
    error,
    connect,
    disconnect, } = usePolkadotWallet();



   // 1) No extension
  if (isInjected === false) {
    return (
      <a
        href="https://talisman.xyz/extension"
        target="_blank"
        rel="noreferrer"
        className="px-4 py-2 rounded-lg border bg-blue-600 text-white hover:bg-blue-700"
      >
        Install Talisman
      </a>
    );
  }

  // 2) Not connected/no permission
  if (!approved || accounts.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={connect}
          disabled={connecting}
          className="px-4 py-2 rounded-lg border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Talisman"}
        </button>
        {lockedLike ? (
          <span className="text-sm text-amber-600">
            Unlock the extension and click “Connect” again.
          </span>
        ) : null}
        {error ? <span className="text-red-500 text-sm">{error}</span> : null}
      </div>
    );
  }

  // 3) Connected
  return (
    <div className="flex items-center gap-2">
      <select
        className="px-3 py-2 rounded-lg border bg-white"
        value={selected?.address ?? ""}
        onChange={(e) => {
          const acc = accounts.find((a) => a.address === e.target.value) ?? null;
          setSelected(acc);
        }}
      >
        {accounts.map((a) => (
          <option key={a.address} value={a.address}>
            {(a.meta.name ?? "Account") + " — " + a.address}
          </option>
        ))}
      </select>

      <button
        onClick={disconnect}
        className="px-3 py-2 rounded-lg border hover:bg-gray-50"
        title="Disconnect"
      >
        Disconnect
      </button>
    </div>
  );
}