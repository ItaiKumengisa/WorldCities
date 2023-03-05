import {Component, OnInit} from '@angular/core';

//Inports for form stuff
import {FormGroup, FormControl} from '@angular/forms';

//imports for routing
import {ActivatedRoute, Router} from '@angular/router';

//httpclient
import { HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';

//get the city
import {City} from '../city';

@Component({
  selector: "app-city-edit",
  templateUrl: "./city-edit.component.html",
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent implements OnInit 
{
  city!: City;
  form! : FormGroup;
  title! : string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    //create a form group to hold the form info
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });

    this.loadData();
  }
  
  loadData(){
    //grab the value from the id param
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');

    var id = idParam ? idParam : 0;

    var url = environment.baseUrl + "api/cities/" + id;

    this.http.get<any>(url).subscribe(result => {
      this.city = result;
      this.title = "Edit City - " + result.name;
      this.form.patchValue(this.city);
    }, error => console.error(error));

  }

  onSubmit(){
    var city = this.city;

    if(city){
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
    }

    var url = environment.baseUrl + "api/cities/" + city.id;

    this.http.put<City>(url, city).subscribe(result => {
      console.log("City " + this.city.id + " updated succesfully");

      this.router.navigate(['/cities']);

    }, error => console.error(error));
  }
}