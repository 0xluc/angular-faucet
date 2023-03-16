import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import contract from "@truffle/contract";


@Injectable({
  providedIn: 'root'
})
export class ContractLoaderService {

  constructor(private http: HttpClient) { }

  async loadContractAbi(contractName: string): Promise<any> {
    const abi = await lastValueFrom(this.http.get<any>(`assets/build/${contractName}.json`));
    const contractAbstraction = contract(abi)
    contractAbstraction.setProvider(window.ethereum)
    return  contractAbstraction


  }
}
