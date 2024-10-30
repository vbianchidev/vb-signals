import { Injectable } from '@angular/core';
import { BaseStore } from '../../../@carbonara/types/base';
import { Campanha } from '../../../@carbonara/types/model/promo';

@Injectable()
export class CampanhaStoreService extends BaseStore<Campanha> {}
