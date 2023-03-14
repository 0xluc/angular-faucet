import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
  }
}
@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})

export class MetamaskComponent implements OnInit{
  ethereum = window.ethereum;
  web3: any
  selectedAccount: string = ''
  selectedNetwork: any
  avaxFujiTestnet: string = 'https://api.avax-test.network/ext/bc/C/rpc'

  constructor(private cd: ChangeDetectorRef){

  }
  ngOnInit(): void {
      this.connectToMetamask()
  }
  connectToMetamask() {
    if(typeof this.ethereum === 'undefined'){
      console.log("Install metamask")
      return;
    }
    this.web3 = new Web3(window.ethereum)
    this.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts: any) => {
        this.selectedAccount = accounts[0];
        this.selectedNetwork = window.ethereum.networkVersion;

        if (this.selectedNetwork !== '43113') {
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
          }] })
           .then(() => {
              // Switch to the AVAX Fuji Testnet
              window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
                .then(() => {
                  this.selectedNetwork = '0xa869';
                  this.cd.detectChanges();
                })
                .catch((err: any) => console.error(err));
            })
            .catch((err: any) => console.error(err));
        } else {
          // Switch to the AVAX Fuji Testnet
                window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
            .then(() => {
              this.selectedNetwork = '43113';
              this.cd.detectChanges();
            })
            .catch((err: any) => console.error(err));
        }
      }
    })
      .catch((err: any) => console.error(err));

    this.ethereum.on('accountsChanged', (accounts: any) => {
      this.selectedAccount = accounts[0];
      this.cd.detectChanges()
    });
    window.ethereum.on('chainChanged', (chainId: any) => {
      if (chainId !== '43113') {
      // Switch to the AVAX Fuji Testnet
      window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa869' }] })
        .then(() => {
          this.selectedNetwork = '43113';
          this.cd.detectChanges();
        })
        .catch((err: any) => console.error(err));
    } else {
      this.selectedNetwork = '43113';
        this.cd.detectChanges();
    }
    });
  }

  disconnectFromMetaMask() {
    this.ethereum.off('accountsChanged');
    this.ethereum.off('chainChanged');
    this.web3 = null;
    this.selectedAccount = '';
    this.selectedNetwork = null;
  }
}
