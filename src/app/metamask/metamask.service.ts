import Web3  from 'web3';
import { Injectable, ChangeDetectorRef } from '@angular/core';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  // ethereum = window.ethereum;
  // web3: any
  avaxFujiTestnet: string = 'https://api.avax-test.network/ext/bc/C/rpc'
  

  ethereum = window.ethereum;
  web3:any

  constructor() { }
  switchToAvax(selectedNetwork:any) {
    if(typeof this.ethereum === 'undefined'){
      console.log("Install metamask")
      return;
    }
     this.web3 = new Web3(window.ethereum)
     this.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        selectedNetwork = window.ethereum.networkVersion;
         if (selectedNetwork !== '43113') {
            if (!window.ethereum.networkVersion || window.ethereum.networkVersion !== '43113') {
          // Add the AVAX Fuji Testnet if it's not already added
          window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ 
            chainId: '0xa869',
            chainName: 'Avalanche Fuji Testnet',
            nativeCurrency: {
              name: 'AVAX',
              symbol: 'AVAX',
              decimals: 18
            },
            rpcUrls: [this.avaxFujiTestnet],
            blockExplorerUrls: ['https://cchain.explorer.avax-test.network']
          }] 
        })
                   .then(() => {
              // Switch to the AVAX Fuji Testnet
              window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
                .then(() => {
                  selectedNetwork = '0xa869';
                })
                .catch((err: any) => console.error(err));
            })
            .catch((err: any) => console.error(err));
        } else {
          // Switch to the AVAX Fuji Testnet
                window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
            .then(() => {
              selectedNetwork = '43113';
            })
            .catch((err: any) => console.error(err));
        }
      }
    })
      .catch((err: any) => console.error(err));


  }
  
  connectToMetamask(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if(!window.ethereum){
          reject ('Metamask is not installed!')
          return;
        }
        if (window.ethereum.networkVersion !== '43113') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xa869' }]
            });
          } catch (error:any) {
            if (error.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0xa869',
                    chainName: 'Avalanche Fuji Testnet',
                    nativeCurrency: {
                      name: 'Avalanche',
                      symbol: 'AVAX',
                      decimals: 18
                    },
                    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                    blockExplorerUrls: ['https://cchain.explorer.avax-test.network/']
                  }]
                });
              } catch (error) {
                reject('Failed to connect to Avalanche Fuji Testnet');
                return;
              }
            }else {
              reject('Failed to switch to Avalanche Fuji Testnet');
              return;
            }
          }
        }
         // Connect to wallet and retrieve account
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const address = accounts[0];
          resolve(address);
        } catch (error) {
          reject('Failed to connect to wallet');
        }
      } catch (error:any) {
        reject(error.message);
      }
    });
  }
  async onAccountsChanged(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        resolve(address);
      } catch (error) {
        reject('Failed to retrieve account');
      }
    });
  }
  onNetworkChanged(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        if (window.ethereum.networkVersion === '43113') {
          resolve('Avalanche Fuji Testnet');
        } else {
          reject('Incorrect network selected');
        }
        } catch (error:any) {
        reject(error.message);
      }
    });
  }
   public addWalletChangeListener(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }
  public removeWalletChangeListener(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', callback);
    }
  }
  public addChainChangedListener(callback: (chainId: string) => void){
    if(window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        callback(chainId)
      })
    }
  }
  public removeChainChangedListener(callback: (chainId:string ) => void) {
    if(window.ethereum) {
      window.ethereum.removeListener('chainChanged', (chainId: string) => {
        callback(chainId)
      })  
    }
  }
}

//     }) 
//     if(typeof this.ethereum === 'undefined'){
//       reject("Install metamask")
//       return;
//     }
//     this.web3 = new Web3(window.ethereum)
//     this.ethereum.request({ method: 'eth_requestAccounts' })
//       .then((accounts: any) => {
//         this.selectedAccount = accounts[0];
//         this.selectedNetwork = window.ethereum.networkVersion;

//         if (this.selectedNetwork !== '43113') {
//             if (!window.ethereum.networkVersion || window.ethereum.networkVersion !== '43113') {
//           // Add the AVAX Fuji Testnet if it's not already added
//           window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ 
//             chainId: '0xa869',
//             chainName: 'Avalanche Fuji Testnet',
//             nativeCurrency: {
//               name: 'AVAX',
//               symbol: 'AVAX',
//               decimals: 18
//             },
//             rpcUrls: [this.avaxFujiTestnet],
//             blockExplorerUrls: ['https://cchain.explorer.avax-test.network']
//           }] })
//            .then(() => {
//               // Switch to the AVAX Fuji Testnet
//               window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
//                 .then(() => {
//                   this.selectedNetwork = '0xa869';
//                   // should reload
//                 })
//                 .catch((err: any) => console.error(err));
//             })
//             .catch((err: any) => console.error(err));
//         } else {
//           // Switch to the AVAX Fuji Testnet
//                 window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
//             .then(() => {
//               this.selectedNetwork = '43113';
//               // should reload
//             })
//             .catch((err: any) => console.error(err));
//         }
//       }
//     })
//       .catch((err: any) => console.error(err));

//     this.ethereum.on('accountsChanged', (accounts: any) => {
//       this.selectedAccount = accounts[0];
//       // should reload
//     });
//     window.ethereum.on('chainChanged', (chainId: any) => {
//       if (chainId !== '43113') {
//       // Switch to the AVAX Fuji Testnet
//       window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
//         .then(() => {
//           this.selectedNetwork = '43113';
//           // should reload

//         })
//         .catch((err: any) => console.error(err));
//     } else {
//       this.selectedNetwork = '43113';
//         // should reload
//     }
//     });
//   }

  
// }
