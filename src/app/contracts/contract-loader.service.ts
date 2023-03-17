import Web3  from 'web3';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractLoaderService {

  constructor(private http: HttpClient) { }


}
