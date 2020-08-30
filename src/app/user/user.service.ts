import {Injectable} from '@angular/core';
import {AdminService} from '../services/admin.service';


@Injectable({
    providedIn: 'root'
})
export class UserComponentService {
    constructor(public api: AdminService) {
    }

    postData(data, url) {
        return this.api.postData(url, data);
    }

}
