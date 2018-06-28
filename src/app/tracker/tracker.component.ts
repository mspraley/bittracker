import { Component, OnInit, Input } from '@angular/core';
import { trigger,style,transition,animate,keyframes,state,query,stagger } from '@angular/animations';

@Component({
  selector: 'tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
  animations : [
    trigger('resultChange', [
      state('static', style({
        'display' : 'block'
      })),
      state('valid', style({
        'display' : 'block'
      })),
      state('invalid', style({
        'display' : 'block'
      })),
      transition('static <=> valid', animate(300, keyframes([
        style({ transform: 'scale(1.05)', offset: 0}),
        style({transform: 'scale(0.9)',  offset: 0.5}),
        style({transform:'scale(1.0)',     offset: 1.0})
      ]))),
      transition('static <=> invalid', animate(300, keyframes([
        style({ transform: 'translateX(-5px)', offset: 0}),
        style({transform: 'translateX(5px)',  offset: 0.5}),
        style({transform:'translateX(0px)',     offset: 1.0})
      ])))
    ])
  ]
})
export class TrackerComponent implements OnInit {
  private nums = Array(9).fill(1).map((x,i)=>i+1);
  private additionalKeys = ['.', 0, 'delete'];
  private result = ['0'];
  private hasDecimal = false;
  private resultAnimation = 'static';
  @Input() current : number;
  @Input() total: number;
  @Input() week: number; 

  constructor() {
  }

  ngOnInit() { 
  }

  appendNumeric(value) {
    if (this.result[0] == '0' && this.result.length == 1) {
        this.result = [value];
    } else {
        this.result.push(value);
    }

    //can probably use rxjs to make this easier
    this.resultAnimation = 'valid';
    setTimeout(() => {
      this.resultAnimation = 'static'
    }, 0);
  }

  executeUniqueKey(value) {
    let error = false;
    switch (value) {
      case 'delete' :
      this.result.pop();
      break;
      case '.' :
      if (this.result.length == 0) this.result.push('0');
      // check if we already have a decimal
      if (this.result.indexOf('.') == -1) {
        this.result.push(value);
      } else {
        error = true;
      }
      break;
      case 0 :
      //don't allow leading 0s
      if (this.result.length > 0) {
        this.result.push(value);
      } else {
        error = true;
      }
      break;
    }
    this.resultAnimation = error ? 'invalid' : 'valid';
    setTimeout(() => {
      this.resultAnimation = 'static'
    }, 0);
  }

  getResult() {
    // we can parse into a float if we want to do math later
    return this.result.length ? this.result.join('') : [0];
  }
}
