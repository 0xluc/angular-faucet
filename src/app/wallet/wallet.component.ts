import { ContractLoaderService } from './../contracts/contract-loader.service';
import { MetamaskService } from './../metamask/metamask.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';

import detectEthereumProvider from '@metamask/detect-provider';
  declare function loadContract(nome:string, provider: any):any

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  public address: string = '';
  public selectedNetwork = window.ethereum.networkVersion 
  avaxFujiTestnet: string = 'https://api.avax-test.network/ext/bc/C/rpc'
  loadedContract:any
  constructor(
    private metamaskService: MetamaskService,
    private cd: ChangeDetectorRef,
    private contractService: ContractLoaderService
  ) {}
 async ngOnInit() {
    this.connectToWallet();
    this.metamaskService.addWalletChangeListener((accounts: string[]) => {
      this.updateDisplayedWallet(accounts[0]);
    });
    await this.metamaskService.addChainChangedListener((chainId) => {
      this.updateChain()
    })
    console.log(this.loadedContract)
    const provider = await detectEthereumProvider()
    console.log(loadContract("Faucet", provider))
  }
  ngOnDestroy(): void {
    this.metamaskService.removeWalletChangeListener((accounts: string[]) => {
      this.updateDisplayedWallet(accounts[0]);
    });
    this.metamaskService.removeChainChangedListener((chainId) => {
      this.updateChain()
    })
  }

  updateDisplayedWallet(account: string): void {
    this.address = account;
    this.cd.detectChanges();
  }
  updateChain(){
    this.metamaskService.switchToAvax(this.selectedNetwork)
    this.cd.detectChanges()

  }
  public connectToWallet() {
    this.metamaskService
      .connectToMetamask()
      .then((address: string) => {
        this.address = address;
        this.cd.detectChanges();
        // this.metamaskService.onNetworkChanged()
        // .catch((error:string) => {console.log(error)})
        // window.ethereum.on('accountsChanged', async() => {
        //   try {
        //     const address = await this.metamaskService.onAccountsChanged();
        //     this.address = address;
        //   } catch(error) {
        //     console.log(error)
        //   }
        // })
        // window.ethereum.on('chainChanged', () => {
        //   this.cd.detectChanges()
        // });
      })
      .catch((error: string) => {
        console.log(error);
      });
  }
}
