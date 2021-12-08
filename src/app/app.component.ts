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
  noLimited = 'Безлимитный интернет';
  listTariff: Tariff[] = [];
  filteringListTariff: Tariff[] = [];

  limitInternet = false;

  operators: Operation[] = [
    {name: 'Билайн', check: false},
    {name: 'Мегафон', check: false},
    // {name: 'МТС', check: false},
    {name: 'Теле2', check: false}
  ];

  costValue: [number, number];
  minValue: [number, number];
  gbValue: [number, number];
  minimumValue: {
    gb: [number, number],
    min: [number, number],
    cost: [number, number]
  };
  nameValue = '';

  constructor(
    private route: ActivatedRoute,
    private tariffsService: TariffsService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tariffsService.getListTariffs()
        .pipe( )
        .subscribe(
          (tariffs) => {
            this.listTariff = tariffs;
            this.listTariff.forEach(tariff => {
              if (tariff.gb === null) tariff.gb = this.noLimited;
            })
            this.filteringListTariff = this.listTariff;

            this.costValue = [
              this.listTariff.reduce((acc, curr) => acc.cost < curr.cost ? acc : curr).cost, 
              this.listTariff.reduce((acc, curr) => acc.cost > curr.cost ? acc : curr).cost
            ];

            this.gbValue = [
              parseFloat(this.listTariff.filter(tariff => tariff.gb !== this.noLimited).reduce((acc, curr) => acc.gb < curr.gb ? acc : curr).gb),  
              parseFloat(this.listTariff.filter(tariff => tariff.gb !== this.noLimited).reduce((acc, curr) => acc.gb > curr.gb ? acc : curr).gb)
            ];
            
            this.minValue = [
              this.listTariff.reduce((acc, curr) =>acc.minutes < curr.minutes ? acc : curr).minutes, 
              this.listTariff.reduce((acc, curr) => acc.minutes > curr.minutes ? acc : curr).minutes
            ];
        
            this.minimumValue = {
              gb: [this.gbValue[0], this.gbValue[1]],
              min: [this.minValue[0], this.minValue[1]],
              cost: [this.costValue[0], this.costValue[1]]
            };
          }
        );
    });
  }

  filter() {
    let checkOper: string[] = [];
    this.operators.forEach(operator => {
      if (operator.check) checkOper.push(operator.name)
    });

    this.filteringListTariff = this.listTariff;

    if (this.limitInternet && (this.minimumValue.gb[0] != this.gbValue[0] || this.minimumValue.gb[1] != this.gbValue[1])) {
      this.filteringListTariff = this.listTariff.filter(tariff => tariff.gb === this.noLimited || (this.gbValue[0] <= parseInt(tariff.gb) && parseInt(tariff.gb) <= this.gbValue[1]))
    }
    else {
      if (this.limitInternet) {
        this.filteringListTariff = this.listTariff.filter(tariff => tariff.gb === this.noLimited)
      }
      else if (this.minimumValue.gb[0] != this.gbValue[0] || this.minimumValue.gb[1] != this.gbValue[1]){
        this.filteringListTariff = this.listTariff.filter(tariff => this.gbValue[0] <= parseInt(tariff.gb) && parseInt(tariff.gb) <= this.gbValue[1]);
      }
    }    
    
    this.filteringListTariff = this.filteringListTariff.filter(tariff => {
      return (this.minValue[0] <= tariff.minutes && tariff.minutes <= this.minValue[1])
        && (this.costValue[0] <= tariff.cost && tariff.cost <= this.costValue[1])
        && tariff.tariffName.toLowerCase().includes(this.nameValue)
    });

    if(checkOper.length != 0){
       this.filteringListTariff = this.filteringListTariff.filter(tariff => checkOper.find(oper => oper == tariff.provider))
    }
  }

  dropFilter() {
    this.filteringListTariff = this.listTariff;
    this.gbValue = this.minimumValue.gb;
    this.costValue = this.minimumValue.cost;
    this.minValue = this.minimumValue.min;
    this.operators.forEach(oper => oper.check = false);
    this.nameValue = '';
    this.limitInternet = false;
  }
}