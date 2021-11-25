import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tariff} from './tariff.model';
import {Urls} from './urls';

@Injectable({
    providedIn: 'root'
})
export class TariffsService {

    constructor(
        private http: HttpClient
    ) {
    }

    getListTariffs(): Observable<Tariff[]> {
        return this.http.get<any>(Urls.tariffListAndDetailsApiWithParams())
            .pipe(
                map(
                    backEndModel => {
                        let listTariff: Tariff[] = []
                        backEndModel.forEach((model: any) => {
                            listTariff.push(TariffsService.mapTariffFromBackend(model))
                        });
                        return listTariff;
                    }
                )
            );
    }

    private static mapTariffFromBackend(backEndModel: any): Tariff {
        return {
            tariffName: backEndModel.tariffName,
            provider: backEndModel.provider,
            cost: backEndModel.cost,
            minutes: backEndModel.minutes,
            gb: backEndModel.gb
        };
    }
}
