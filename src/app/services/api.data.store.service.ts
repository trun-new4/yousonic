import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* API  Store - 

- this Api Store is a singleton Instance - app.module

Every API 'DATA' Call is held in this Api Store, 
- simular to NGRX/Redux, but simpler as a rxjs/Behavior Subject used by services making API calls

Example Store Item : interface/ApiStoreItem

'/api/content/site?providerID=12345' ( the url request as a string )  : {
  expires: Date; << time for the data to expire and be refetched on request,
  data: any; << the data
}

'expires'.
The Expiry does not persist accross sessions 
-( logout - either manual or through session expiry deletes the whole store)

Usage

EG Site Service

Consumer Container component requests - siteService.get()...

Site Service looks for matching request in this Behavior Subject
- if found 
 --- checks expiry 
    - if not expired - returns cached request by [URL].data
 - if not found ( or expired )
    - Makes fresh fetch from the server and requests the item to be cached here new

 A requesting consumer should be able to set an expiry time or request for no cache

 get()
 post()

 - has in bult expiry detection and cache removal

 */

export interface ApiStoreItem {
  [key: string]: {
    expires: Date;
    data: any;
  };
}

export type ApiStoreExpirySeconds = number;

export interface ApiStoreItemRequest {
  url: string;
  data: any;
  expiry?: ApiStoreExpirySeconds;
}


@Injectable({
  providedIn: 'root'
})
export class ApiDataStoreService {

  defaultExpiry: ApiStoreExpirySeconds = 3;
  apiDatastore$: BehaviorSubject<ApiStoreItem[]> = new BehaviorSubject<ApiStoreItem[]>([]);

  add(apiStoreRequest: ApiStoreItemRequest ): ApiStoreItem {
    const item: ApiStoreItem = this.buildItem(apiStoreRequest);

    let items: ApiStoreItem[] = this.get();
    const existingItem = this.itemInCache(apiStoreRequest.url, items);
    items = this.removeItem(existingItem)
    items.push(item);
    this.apiDatastore$.next(items);

    console.log(items);
    return item;
  }

  getOne(url: string): ApiStoreItem | undefined {
    const items = this.get();
    return this.requestItem(url, items);
  }

  get(): ApiStoreItem[] {
    return this.apiDatastore$.getValue();
  }

  clear(): ApiStoreItem[] {
    this.apiDatastore$.next([]);
    return this.get();
  }

  buildItem(apiStoreRequest: ApiStoreItemRequest): ApiStoreItem {
    const item: ApiStoreItem = {};
    item[apiStoreRequest.url] = {
      data: apiStoreRequest.data,
      expires: this.setExpiry(apiStoreRequest.expiry)
    };

    return item;
  }

  requestItem(url: string, items: ApiStoreItem[]): ApiStoreItem | undefined{
    const item = this.itemInCache(url, items);
    this.handleExpiry(url, item);
    return item;
  }

  handleExpiry(url: string, item?: ApiStoreItem): void {
    if ( item && this.hasExpired(url, item) ) {
      const items = this.removeItem(item);
      this.apiDatastore$.next(items);
    }
  }

  setExpiry(expiry?: ApiStoreExpirySeconds): Date {
    let expiryDate = new Date();
    const expirySeconds: ApiStoreExpirySeconds = expiry? expiry : this.defaultExpiry;
    return new Date(expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds));
  }

  removeItem(item?: ApiStoreItem): ApiStoreItem[]  {
    const items: ApiStoreItem[] = this.get();
    if( !item ) { return items; }

    items.forEach( (ApiStoreItem: ApiStoreItem, index) => {
      if( ApiStoreItem === item) {
        items.splice(index, 1);
      }
    });

    return items;
  }

  hasExpired(url: string, item?: ApiStoreItem): boolean {
    return item? item[url].expires <= new Date() : true;
  }

  itemInCache(url: string, items: ApiStoreItem[]): ApiStoreItem | undefined {
    return items.find( (item: ApiStoreItem) => {
      return item[url] || false;
    });
  }
}
