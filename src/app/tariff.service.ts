import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tariff } from './tariff.model';
import { Urls } from './urls';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {

  // constructor(
  //   private http: HttpClient
  // ) { }

  // getListTariffs(): Observable<Tariff> {
  //   return this.http.get<any>(Urls.tariffListAndDetailsApiWithParams())
  //     .pipe(
  //       map(
  //         backEndModel => {
  //             return this.mapTariffFromBackend(backEndModel);
  //         }
  //       )
  //     );
  // }
  
  private mapTariffFromBackend(backEndModel: any): Tariff {
    return {
      name: backEndModel.name,
      operator : backEndModel.operator,
      price: backEndModel.price,
      min: backEndModel.min,
      gb: backEndModel.gb
    };
  }
}
