import { http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { virtual_gnosis_chain } from '@/tenderly-chains'

export const config = createConfig({
      chains: [virtual_gnosis_chain],
        connectors: [
                injected(),
                    coinbaseWallet({ appName: 'Create Wagmi' })
                        walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "" }),
        ],
          ssr: true,
            transports: {
                    [virtual_gnosis_chain.id]: http('https://virtual.gnosis.rpc.tenderly.co/f68fc9ce-3844-41a1-90c7-705e5a8ba2b8')
            }
})

declare module 'wagmi' {
      interface Register {
            config: typeof config
      }
}
 
      }
}
            }
        ]
})