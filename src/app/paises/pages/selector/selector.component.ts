import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../interfaces/pais';
import { switchMap, tap } from 'rxjs/operators'
import { CountryResponse } from '../../interfaces/country-response';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  regiones: string[] = [];
  paises: Pais[] = [];
  fronteras: Pais[] = [];
  form!: FormGroup;
  cargando: boolean = false;
  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.buildForm();
    this.allRegions();
    this.allCountries();
    this.getCountry();
  }

  buildForm(){
    this.form = this.fb.group({
      region: ['', Validators.required], 
      pais: ['', Validators.required], 
      fronteras: ['', Validators.required]
    })
  }

  guardar(){
    console.log(this.form.value);
  }

  allRegions(){
    this.regiones = this.paisesService.regions;
  }

  allCountries(){
    this.form.get('region')?.valueChanges
    .pipe(
      //Transforma la respuesta que se recibe desde la api
      tap( (_) => {
        this.form.get('pais')?.reset('');
        this.cargando = true;
      }),
      //Este operador dispara dos observables 
      switchMap( region => this.paisesService.allCountries(region) )
    )
    .subscribe( paises => {
      this.cargando = false;
      this.paises = paises;
    })
  }
  //Fronteras
  getCountry(){
    this.form.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        //Purga el campo de fronteras cada vez que se hace una nueva petición
        this.form.get('fronteras')?.reset('');
        this.cargando = true;
      }),
      switchMap( codigo => this.paisesService.getCountry(codigo)),
      switchMap(pais => this.paisesService.getBorder(pais?.borders!))
    )
    .subscribe( paises => {
      this.cargando = false;
      this.fronteras = paises;
    })
  }
}