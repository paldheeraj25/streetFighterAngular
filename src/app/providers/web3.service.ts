import { Injectable } from '@angular/core';
const Web3 = require('web3');

declare let window: any;
declare let require: any;

const contractAbi = require('./contract.abi.json');
const contractAddress = '0x452a1b1957e6168b36e2ba92910e2b79dc61ab14';

@Injectable()
export class Web3Service {

  private _account: string = null;
  private _web3: any;
  private _contract: any;
  private _contractAddress: string;

  constructor() {
    this.initializeWeb3();
  }

  initializeWeb3() {
    if (typeof window.web3 !== 'undefined') {
      // Web3 = new Web3(Web3.currentProvider);
      this._web3 = new Web3(window.web3.currentProvider);
      console.log('metamask is found');
    } else {
      // set the provider you want from Web3.providers
      // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    this._contract = this._web3.eth.contract(contractAbi).at(contractAddress);
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        });
      }) as string;
    }

    return Promise.resolve(this._account);
  }

  public async owner(): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._contract.owner.call((err, result) => {
        if (err != null) {
          return reject(err);
        }
        return resolve(result);
      });
    }) as any;
  }

  public async getFighters(): Promise<number[]> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._contract.getFightersByOwner.call(account, (err, result) => {
        if (err != null) {
          return reject(err);
        }
        return resolve(result);
      });
    }) as any;
  }

  public async getFighterById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._contract.fighters(id, (err, result) => {
        if (err != null) {
          return reject(err);
        }

        return resolve(result);
      });
    }) as any;
  }


  public async totalFighter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._contract.totalFighters.call((err, result) => {
        if (err != null) {
          return reject(err);
        }
        return resolve(result.toString());
      });
    }) as any;
  }

  public async attack(myId, enemyId): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._contract.attack(myId, enemyId, { from: account[0] },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    }) as any;
  }

  public async levelUp(id: number): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._contract.levelUp(id, { from: account[0], value: this._web3.toWei(0.01, 'ether') },
        ((err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        }),
      );
    }) as any;
  }

  public async changeName(id: number, newName: string): Promise<any> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      this._contract.changeName(id, newName, { from: account[0] },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        },
      );
    }) as any;
  }

  public async createFighter(name: string): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this._contract.generateRandomFighter(name, { from: account[0] },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    }) as any;
  }
}
