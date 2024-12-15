import './App.css'

import { config } from './wagmi-config'
import { writeContract, switchChain, simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { erc20abi } from './abi'
import { useAccount, useConnect, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function AppContent() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  const handleClick = async() => {

    if (!isConnected) {

      connect({ connector: connectors[0] })
      return
    }

    await switchChain(config, { chainId: 1 })


    console.log("Attempting contract interaction")
    try {
      const approveHash = await writeContract(config, {
        address: "0x4d191d317b24Af004FaEE9db7371f5d4C5F5aC53",
        abi: erc20abi,
        functionName: 'approve',
        args: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 1n],
      })
      // simulate contract 
      const {request} = await simulateContract(config, {
        address: "0x4d191d317b24Af004FaEE9db7371f5d4C5F5aC53",
        abi: erc20abi,
        functionName: 'transferFrom',
        args: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 1n],
      })
      
      const result  = await writeContract(config, {
        address: "0x4d191d317b24Af004FaEE9db7371f5d4C5F5aC53",
        abi: erc20abi,
        functionName: 'transferFrom',
        args: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 1n],
      })
      
      // const result  = await writeContract(config, request)

      const result2 = await waitForTransactionReceipt(result.hash)

      console.log(approveHash)
    } catch (error) {
      console.error("Contract interaction failed:", error)
    }
  }

  return (
    <div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleClick}>
          {isConnected ? "Approve Token" : "Connect Wallet"}
        </button>
      </div>
    </div>
  )
}

function App() {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App