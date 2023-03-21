import Web3  from 'web3';
import { ContractLoaderService } from './../contracts/contract-loader.service';
import { MetamaskService } from './../metamask/metamask.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  public address = ''
  public selectedNetwork:any
  avaxFujiTestnet: string = 'https://api.avax-test.network/ext/bc/C/rpc'
  contractInstace:any
  contractBalance:string
  amount = 0.01
  constructor(
    private metamaskService: MetamaskService,
    private cd: ChangeDetectorRef,
    private contractService: ContractLoaderService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
      await this.metamaskService.addWalletChangeListener((accounts: string[]) => {
        this.updateDisplayedWallet(accounts[0]);
      });
      await this.metamaskService.addChainChangedListener((chainId) => {
        this.updateChain()
      }) 
  }
  async ngOnDestroy() {
    await this.metamaskService.removeWalletChangeListener((accounts: string[]) => {
      this.updateDisplayedWallet(accounts[0]);
    });
    await this.metamaskService.removeChainChangedListener((chainId) => {
      this.updateChain()
    })
  }
  async clickConnect(){
    if(window.ethereum != undefined){
      this.selectedNetwork = window.ethereum.networkVersion
      await this.connectToWallet();
      await this.loadContractBalance()
     } else {
      this.messageService.add({severity: 'warning', detail: 'Instale a metamask!'})
    }
  }
  updateDisplayedWallet(account: any): void {
    if(account){
      this.address = account;
    } else{
      this.address = ''
    }
    this.cd.detectChanges();
  }
  updateChain(){
    this.metamaskService.switchToAvax(this.selectedNetwork)
    this.cd.detectChanges()

  }
  public async connectToWallet() {
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
  async loadContractBalance() {
    const web3 = new Web3(Web3.givenProvider)
    await this.contractService.loadContractAbi("Faucet")
    .then((response) => {
      this.contractInstace = response
    })
    this.contractBalance = await web3.eth.getBalance(this.contractInstace.options.address)
    this.contractBalance = web3.utils.fromWei(this.contractBalance)
  }
  async addFunds() {
    if(this.contractInstace){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(this.contractInstace)
      console.log(accounts[0])
      await this.contractInstace.methods.addFunds().send({
        from: accounts[0],
        value: Web3.utils.toWei(`${this.amount}`, "ether")
      })
      await this.loadContractBalance()
      await this.cd.detectChanges()
    } else{
      console.error("Contract not loaded")
    }
  }
  async withdraw() {
    if(this.contractInstace){
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await this.contractInstace.methods.withdraw(Web3.utils.toWei(`${this.amount}`, 'ether')).send({
        from: accounts[0]
      })
      await this.loadContractBalance()
      await this.cd.detectChanges()
    } else {
      console.log("Contract not loaded")
    }
  }
}
