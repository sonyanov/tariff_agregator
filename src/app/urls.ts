export class Urls {
    
    static readonly tariffApi = 'https://phone-tariffs.herokuapp.com/get-tariffs';
    static readonly tariffListAndDetailsApiWithParams = () => `${Urls.tariffApi}`;
}
