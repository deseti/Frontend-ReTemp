import { createConfig, http } from 'wagmi';
import { tempoChain } from './config';

export const wagmiConfig = createConfig({
  chains: [tempoChain],
  transports: {
    [tempoChain.id]: http(
      process.env.NEXT_PUBLIC_TEMPO_RPC_URL ?? 'https://rpc.tempo.network'
    ),
  },
  ssr: true,
});
