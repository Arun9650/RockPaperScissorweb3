import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { PlayerProvider } from "../context/Player.jsx";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, sepolia],
  [
    publicProvider(),
    alchemyProvider({ apiKey: "7GWcXh1B6TpAJ7LA-AB3uJfyER81S44l" }),
  ]
);

const projectId = "a14ddad6c8a1a26f523be5c03b2490a4";

const { wallets } = getDefaultWallets({
  appName: "Land Registration using Blockchain ",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Land Registration using Blockchain ",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains} >
        <PlayerProvider>
        <App />
        </PlayerProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);