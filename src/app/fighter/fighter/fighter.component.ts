import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../providers/web3.service';

@Component({
  selector: 'app-fighter',
  templateUrl: './fighter.component.html',
  styleUrls: ['./fighter.component.css']
})
export class FighterComponent implements OnInit {

  public name: string;
  public skill: string;
  public level: string;
  public readyTimer: string;
  public winCount: string;
  public lossCount: string;
  public myFighterId: number;
  public allFighters: any[] = [];
  public uiFighterArray: any[] = [];

  constructor(private web3: Web3Service) { }

  ngOnInit() {
    this.getOwner();
    this.getFighters();
    this.getTotalFighter();
  }

  public getOwner() {
    this.web3.owner().then(result => {
      // console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public getFighters() {
    this.web3.getFighters().then(result => {
      // console.log(result[0]['c'][0]);
      this.myFighterId = result[0]['c'][0];
      this.getFighterById(result[0]['c']);
    }).catch(err => {
    });
  }

  public getFighterById(id: number) {
    this.web3.getFighterById(id).then(result => {
      this.name = result[0].toString();
      this.skill = result[1].toString();
      this.level = result[2].toString();
      this.readyTimer = result[3].toString();
      this.winCount = result[4].toString();
      this.lossCount = result[5].toString();
    }).catch(err => {
      console.log(err);
    });
  }

  public getTotalFighter() {
    this.web3.totalFighter().then(result => {
      // console.log(result);
      for (var i = 0; i < parseInt(result, 10); i++) {
        this.getAllFighters(i);
      }
      console.log(this.uiFighterArray);
    }).catch(err => {
      console.log(err);
    });
  }

  public getAllFighters(id) {
    this.web3.getFighterById(id).then(result => {
      this.allFighters.push(result);

      const fighter: { name: string, id: string } = { name: '', id: '' };
      fighter.name = result[0];
      fighter.id = id;

      this.uiFighterArray.push(fighter);
    }).catch(err => {
      console.log(err);
    });
  }

  public attack(enemyId) {
    const myId = 0;
    console.log(this.myFighterId);
    this.web3.attack(this.myFighterId, enemyId).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public levelUp() {
    this.web3.levelUp(this.myFighterId).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public changeName(newName: string) {
    this.web3.changeName(this.myFighterId, newName).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public createFighter(name: string) {
    console.log(name);
    this.web3.createFighter(name).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }
}
