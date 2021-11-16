import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Operation } from './operatioon.model';
import { Tariff } from './tariff.model';
import { TariffsService } from './tariff.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-tariff-aggregator';
  listTariff: Tariff[] = [];
  filteringListTariff: Tariff[] = [];
  example: Tariff[];

  operators: Operation[] = [
    {name: 'Билайн', check: false},
    {name: 'Мегафон', check: false},
    {name: 'МТС', check: false},
    {name: 'Теле2', check: false}
  ]
  priceValue: [number, number] = [0, 10000];
  minValue: [number, number] = [0, 100];
  gbValue: [number, number] = [0, 100];
  nameValue = ''

  constructor(
    private route: ActivatedRoute,
    private tariffsService: TariffsService,
  ) {}

  ngOnInit(): void {
    // TODO:получение информации по запросу
    this.example = [
    {
      name: "aaaaaaaaa",
      operator: "Теле2",
      price: "102",
      min: "11",
      gb: "13"
    }, 
    {
      name: "bbbbbbbbbbb",
      operator: "Билайн",
      price: "50",
      min: "32",
      gb: "45"
    },
    {
      name: "ababbaba",
      operator: "МТС",
      price: "10",
      min: "33",
      gb: "13"
    },
    {
      name: "asasasasa",
      operator: "Мегафон",
      price: "34",
      min: "60",
      gb: "12"
    }]
    this.gbValue = [
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.gb) < parseInt(curr.gb) ? acc : curr).gb), 
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.gb) > parseInt(curr.gb) ? acc : curr).gb)
    ]
    
    this.minValue = [
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.min) < parseInt(curr.min) ? acc : curr).min), 
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.min) > parseInt(curr.min) ? acc : curr).min)
    ]

    this.priceValue = [
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.price) < parseInt(curr.price) ? acc : curr).price), 
      parseInt(this.example.reduce((acc, curr) => parseInt(acc.price) > parseInt(curr.price) ? acc : curr).price)
    ]

    this.listTariff = this.example;
    this.filteringListTariff = this.listTariff;

    // this.route.params.subscribe(params => {
    //   this.tariffsService.getListTariffs()
    //     .pipe( )
    //     .subscribe(
    //       (tariffs) => {
    //         // this.listTariff = tariffs
    //       }
    //     );
    // });
  }

  filter() {
    let checkOper: string[] = [];
    this.operators.forEach(operator => {
      if (operator.check) checkOper.push(operator.name)
    });

    this.filteringListTariff = this.listTariff.filter(tariff => {
      return (this.gbValue[0] <= parseInt(tariff.gb) && parseInt(tariff.gb) <= this.gbValue[1])
        && (this.minValue[0] <= parseInt(tariff.min) && parseInt(tariff.min) <= this.minValue[1])
        && (this.priceValue[0] <= parseInt(tariff.price) && parseInt(tariff.price) <= this.priceValue[1])
        && tariff.name.includes(this.nameValue)
    });

    if(checkOper.length != 0){
       this.filteringListTariff = this.filteringListTariff.filter(tariff => {
        return checkOper.find(oper => oper == tariff.operator)
      })
    }
  }
}