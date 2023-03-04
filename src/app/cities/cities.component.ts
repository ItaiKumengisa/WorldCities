import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { City } from './city';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public displayedColumns : string[] = ['id', 'name', 'lat', 'lon'];  
  public cities!: MatTableDataSource<City>;
  defaultPageIndex : number = 0;
  defaultPageSize : number = 10;
  public defaultSortColumn : string = "name";
  public defaultSortOrder : "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery? : string;

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }


  getData(event: PageEvent){
    var url = environment.baseUrl + 'api/Cities';
    var params = new HttpParams()
    .set("pageIndex", event.pageIndex.toString())
    .set("pageSize", event.pageSize.toString())
    .set("sortColumn", (this.sort) ? this.sort.active : this.defaultSortColumn)
    .set("sortOrder", (this.sort) ? this.sort.direction : this.defaultSortOrder);

    //In getData() we've been constructing a querystring to add to our url to make the proper request
    //Unlike sortorder, filter is not always set, the user has to enter a query value while sortorder has a default value "asc"
    //filter has a default filter column "name" but no default filterQuery. If the query is set, we will add filtering
    // to the query string

    if(this.filterQuery){
      params = params
        .set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery)
    }
    
    this.http.get<any>(url, {params})
    .subscribe( result => {
      this.paginator.length = result.totalCount;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.cities = new MatTableDataSource<City>(result.data);
    }, error => {console.error(error)})
  }

  loadData(query?: string){
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = 0;
    pageEvent.pageSize = 10;
    this.filterQuery = query;
    this.getData(pageEvent);
  }
}
