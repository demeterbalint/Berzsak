import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragScrollService {
  moved: boolean = false;
}
