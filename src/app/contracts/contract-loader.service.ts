import Web3  from 'web3';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContractLoaderService {

  constructor(private http: HttpClient) { 
  }
  async loadContractAbi(contractName: string): Promise<any> {
    const web3 = new Web3(Web3.givenProvider)
    const abi = await lastValueFrom(this.http.get<any>(`assets/build/${contractName}.json`));
    const contract  = new web3.eth.Contract(abi.abi, abi.networks['43113'].address)
    return contract
  }

}
