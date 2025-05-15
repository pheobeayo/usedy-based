import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { baseSepolia} from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_PROJECTID;

const networks = [baseSepolia];

const metadata = {
  name: "My Website",
  description: "usedy",
  url: "http://localhost:5173/",
  icons: ["https://avatars.mywebsite.com/"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});