import { ApiDataStoreService, ApiStoreItem } from './api.data.store.service';
import { TestBed } from '@angular/core/testing';

describe('ApiDataStoreService', () => {
  let service: ApiDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDataStoreService);
  });

  it('Default Expiry seconds', ()=> {
    expect(typeof service.defaultExpiry).toEqual('number');
    expect(service.defaultExpiry).toBeGreaterThan(0);
  })

  it('add', ()=> {
    const mockData = { test: 'test' };
    const mockItem: ApiStoreItem = {
      'api/mock': {
        expires: new Date(),
        data: mockData
      }
    };

    const mockRequest = {
      url: 'api/mock',
      data: mockData,
      expiry: 10
    };

    const mockItems: ApiStoreItem[] = [];

    spyOn(service, 'buildItem').and.returnValue(mockItem);
    spyOn(service, 'get').and.returnValue(mockItems);
    spyOn(service, 'itemInCache').and.returnValue(mockItem);
    spyOn(service, 'removeItem').and.returnValue(mockItems);
    spyOn(service.apiDatastore$, 'next').and.callFake;
    
    service.add(mockRequest);

    expect(service.buildItem).toHaveBeenCalledWith(mockRequest);
    expect(service.get).toHaveBeenCalled();
    expect(service.itemInCache).toHaveBeenCalledWith(mockRequest.url, mockItems);
    expect(service.removeItem).toHaveBeenCalledWith(mockItem);
    expect(service.apiDatastore$.next).toHaveBeenCalledWith(mockItems);

    expect(service.add(mockRequest)).toEqual(mockItem);
  });

  describe('methods', ()=> {
    const mockUrl = 'api/mock2';
    const mockEmptyItems: ApiStoreItem[] = [];
    const mockItems: ApiStoreItem[] = [
      { 'api/mock1': { expires: new Date(), data: {} } },
      { 'api/mock2': { expires: new Date(), data: {} } },
      { 'api/mock3': { expires: new Date(), data: {} } }
    ];
    const mockItem = mockItems[1];
    const mockData = { test: 'test' };
    const mockRequest = {
      url: 'api/mock',
      data: mockData,
      expiry: 10
    };

    it('GetOne', ()=> {
      spyOn(service, 'get').and.returnValue(mockItems);
      spyOn(service, 'requestItem').and.returnValue(mockItem);
  
      service.getOne(mockUrl);
  
      expect(service.get).toHaveBeenCalled();
      expect(service.requestItem).toHaveBeenCalledWith(mockUrl, mockItems);
  
      expect(service.getOne(mockUrl)).toEqual(mockItem)
    });
  
    it('Get', ()=> {
      spyOn(service.apiDatastore$, 'getValue').and.returnValue(mockItems);

      expect(service.get()).toEqual(mockItems);
    });

    it('Clear', ()=> {
      spyOn(service.apiDatastore$, 'next').and.callFake;
      spyOn(service, 'get').and.returnValue(mockEmptyItems);

      expect(service.clear()).toEqual(mockEmptyItems);
    });

    it('BuildItem', ()=> {
      expect(service.buildItem(mockRequest)[mockRequest.url]).toBeDefined();
      expect(service.buildItem(mockRequest)[mockRequest.url].data).toEqual(mockData)
      expect(typeof service.buildItem(mockRequest)[mockRequest.url].expires.getSeconds()).toEqual('number');
    });

    it('requestItem', ()=> {
      spyOn(service, 'itemInCache').and.returnValue(mockItem);
      spyOn(service, 'handleExpiry').and.callFake;

      expect(service.requestItem(mockUrl, mockItems)).toEqual(mockItem);

      expect(service.itemInCache).toHaveBeenCalledOnceWith(mockUrl, mockItems);
      expect(service.handleExpiry).toHaveBeenCalledOnceWith(mockUrl, mockItem);
    });

    describe('HandleExpiry', ()=> {
      it('HandleExpiry - expired - no item', ()=> {
        spyOn(service, 'hasExpired').and.returnValue(true);
        spyOn(service, 'removeItem').and.returnValue(mockItems);
        spyOn(service.apiDatastore$, 'next').and.callFake;

        service.handleExpiry(mockUrl);

        expect(service.hasExpired).not.toHaveBeenCalled();
        expect(service.removeItem).not.toHaveBeenCalled();
        expect(service.apiDatastore$.next).not.toHaveBeenCalled();
      });

      it('HandleExpiry - expired - has item and item expired', ()=> {
        spyOn(service, 'hasExpired').and.returnValue(true);
        spyOn(service, 'removeItem').and.returnValue(mockItems);
        spyOn(service.apiDatastore$, 'next').and.callFake;

        service.handleExpiry(mockUrl, mockItem);

        expect(service.hasExpired).toHaveBeenCalledWith(mockUrl, mockItem);
        expect(service.removeItem).toHaveBeenCalledWith(mockItem);
        expect(service.apiDatastore$.next).toHaveBeenCalledWith(mockItems);
      });

      it('HandleExpiry - not expired', ()=> {
        spyOn(service, 'hasExpired').and.returnValue(false);
        spyOn(service, 'removeItem').and.returnValue(mockItems);
        spyOn(service.apiDatastore$, 'next').and.callFake;

        service.handleExpiry(mockUrl, mockItem);

        expect(service.hasExpired).toHaveBeenCalledWith(mockUrl, mockItem);
        expect(service.removeItem).not.toHaveBeenCalled();
        expect(service.apiDatastore$.next).not.toHaveBeenCalled();
      });

      describe('setExpiry', ()=> {
        it('setExpiry - no expiry given', ()=> {
          expect(service.setExpiry().getSeconds).toBeDefined();
        });
  
        it('setExpiry - expiry given', ()=> {
          expect(service.setExpiry(20).getSeconds).toBeDefined();
        });
      });

      describe('removeItem', ()=> {
        it('remove Item - no item given to remove', ()=> {
          spyOn(service, 'get').and.returnValue(mockItems);
          expect(service.removeItem()).toEqual(mockItems);
        });

        it('remove Item - given item does not match', ()=> {
          const mockRemoveItems: ApiStoreItem[] = [
            { 'api/mock1': { expires: new Date(), data: {} } },
            { 'api/mock2': { expires: new Date(), data: {} } },
            { 'api/mock3': { expires: new Date(), data: {} } }
          ];
          const mockRemoveItem = { 'api/mock4': { expires: new Date(), data: {} } };
          spyOn(service, 'get').and.returnValue(mockRemoveItems);
          expect(service.removeItem(mockRemoveItem)).toEqual(mockRemoveItems);
        });

        it('remove Item - given item does match', ()=> {
          const mockItem1 = { 'api/mock1': { expires: new Date(), data: {} } };
          const mockItem2 = { 'api/mock2': { expires: new Date(), data: {} } };
          const mockItem3 = { 'api/mock3': { expires: new Date(), data: {} } };
          const mockItem4 = { 'api/mock4': { expires: new Date(), data: {} } };
          const mockRemoveItems: ApiStoreItem[] = [
            mockItem1, mockItem2, mockItem3, mockItem4
          ];

          spyOn(service, 'get').and.returnValue(mockRemoveItems);
          const itemsWithRemoved = service.removeItem(mockItem2)
          expect(itemsWithRemoved[1]).toEqual(mockItem3);
        });
      });

      describe('hasExpired', ()=> {
        it('hasExpired - has no given item', ()=> {
          expect(service.hasExpired('api/test')).toEqual(true);
        });

        it('hasExpired - has given item - item expired in past', ()=> {
          const mockExpiredUrl = '/api/test';
          let dayNow = new Date();
          let mockExpiredItem: ApiStoreItem = {
          };
          mockExpiredItem[mockExpiredUrl] = {
            data: { test: 'test'},
            expires: new Date( dayNow.setSeconds(dayNow.getSeconds() - 800 ) )
          };
          expect(service.hasExpired(mockExpiredUrl, mockExpiredItem)).toEqual(true);
        });

        it('hasExpired - has given item - item not expired', ()=> {
          const mockExpiredUrl = '/api/test';
          let dayNow = new Date();
          let mockExpiredItem: ApiStoreItem = {
          };
          mockExpiredItem[mockExpiredUrl] = {
            data: { test: 'test'},
            expires: new Date( dayNow.setSeconds(dayNow.getSeconds() + 800 ) )
          };
          expect(service.hasExpired(mockExpiredUrl, mockExpiredItem)).toEqual(false);
        });
      });

      describe('ItemInCache', ()=> {
        const mockItem1 = { 'api/mock1': { expires: new Date(), data: {} } };
        const mockItem2 = { 'api/mock2': { expires: new Date(), data: {} } };
        const mockItem4 = { 'api/mock4': { expires: new Date(), data: {} } };
        const mockCacheItems: ApiStoreItem[] = [
          mockItem1, mockItem2, mockItem4
        ];

        it('ItemInCache - is', ()=> {
          expect(service.itemInCache('api/mock4', mockCacheItems)).toEqual(mockItem4);
        });

        it('ItemInCache - is not', ()=> {
          expect(service.itemInCache('api/mock3', mockCacheItems)).not.toBeDefined();
        });
      });
    });


  });

});