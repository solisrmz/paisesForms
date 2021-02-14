import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountryResponse } from '../interfaces/country-response';
import { Pais } from '../interfaces/pais';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  constructor(private http: HttpClient) { }

  allCountries(region: string): Observable<Pais[]>{
    const url = `${base_url}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<Pais[]>(url);
  }

  get regions(){
    //copia desestructurada para que no se modifique la propiedad original
    return [...this._regiones];
  }

  getCountry(code: string): Observable<CountryResponse | null>{
    if(!code){
      return of(null);
    }
    const url = `${base_url}/alpha/${code}`;
    return this.http.get<CountryResponse>(url);
  }

  getCountry2(code: string): Observable<Pais>{
    const url = `${base_url}/alpha/${code}?fields=alpha3Code;name`;
    return this.http.get<Pais>(url);
  }

  getBorder(borders: string[]): Observable<Pais[]>{
    if(!borders){
      return of([]);
    }

    const peticiones: Observable<Pais>[] = [];
    borders.forEach(codigo => {
      const peticion = this.getCountry2(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );
  }
}
