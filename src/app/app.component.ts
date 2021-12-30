import { Component, OnInit } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'oscbp';
  processForm;
  selectedAlgo;
  processId = [];
  burstTime;
  waitingTime = [];
  turnaroundTime = [];
  remainingBit = [];
  quantum;
  averageWaitingTime = 0;
  averageTurnaroundTime = 0;
  onClick = false;
  withArrival = 'F';
  priority = [];
  arrivalTime = [];
  remainingTime = [];
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    console.log('hello');
    this.processForm = this.formBuilder.group({
      quantum: new FormControl(['']),
      burstTime: new FormArray([]),
      priority: new FormArray([]),
      arrivalTime: new FormArray([]),
    });
  }

  refreshPage(): void {
    window.location.reload();
  }

  onAddBurstTime(): void {
    const availableSlot = new FormControl();
    this.processForm.get('burstTime').push(availableSlot);
  }

  onDeleteBurstTime(index: number): void {
    this.processForm.get('burstTime').removeAt(index);
  }

  onAddPriority(): void {
    const availableSlot = new FormControl();
    this.processForm.get('priority').push(availableSlot);
  }

  onDeletePriority(index: number): void {
    this.processForm.get('priority').removeAt(index);
  }

  onAddArrivalTime(): void {
    const availableSlot = new FormControl();
    this.processForm.get('arrivalTime').push(availableSlot);
  }

  onDeleteArrivalTime(index: number): void {
    this.processForm.get('arrivalTime').removeAt(index);
  }

  getAlgorithm(val) {
    this.selectedAlgo = val;
  }

  getArrivalTime(val) {
    this.withArrival = val;
  }

  getOutput() {
    let c = 0;
    for (let i = 0; i < this.processForm.get('burstTime').value.length; i++) {
      this.processId.push(c);
      c += 1;
    }
    this.burstTime = Object.assign([], this.processForm.get('burstTime').value);
    switch (this.selectedAlgo) {
      case 'fcfs': {
        if (this.withArrival == 'F') {
          this.fcfs();
        } else {
          this.arrivalTime = Object.assign(
            [],
            this.processForm.get('arrivalTime').value
          );
          this.fcfs_at();
        }
        break;
      }
      case 'sjf': {
        if (this.withArrival == 'F') {
          this.sjf();
        } else {
          this.arrivalTime = Object.assign(
            [],
            this.processForm.get('arrivalTime').value
          );
          this.sjf_at();
        }
        break;
      }
      case 'priority': {
        this.priority = Object.assign(
          [],
          this.processForm.get('priority').value
        );
        if (this.withArrival == 'F') {
          this.Priority();
        } else {
          this.arrivalTime = Object.assign(
            [],
            this.processForm.get('arrivalTime').value
          );
          this.priority_at();
        }
        break;
      }
      case 'roundrobin': {
        this.quantum = +this.processForm.get('quantum').value;

        if (this.withArrival == 'F') {
          this.roundRobin();
        } else {
          this.arrivalTime = Object.assign(
            [],
            this.processForm.get('arrivalTime').value
          );
          this.roundrobin_at();
        }
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    this.onClick = true;
  }

  fcfs() {
    let waiting = 0;
    let n = this.burstTime.length;
    for (let i = 0; i < this.burstTime.length; i++) {
      this.waitingTime[i] = waiting;
      waiting += +this.burstTime[i];
      this.turnaroundTime[i] = waiting;
    }

    for (let i = 0; i < this.burstTime.length; i++) {
      console.log(
        i,
        this.burstTime[i],
        this.waitingTime[i],
        this.turnaroundTime[i]
      );
    }
    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  sjf() {
    let waiting = 0;
    let n = this.burstTime.length;
    for (let i = 0; i < this.burstTime.length; i++) {
      for (let j = i + 1; j < this.burstTime.length; j++) {
        if (this.burstTime[i] > this.burstTime[j]) {
          let temp1 = this.burstTime[i];
          this.burstTime[i] = this.burstTime[j];
          this.burstTime[j] = temp1;
          let temp2 = this.processId[i];
          this.processId[i] = this.processId[j];
          this.processId[j] = temp2;
        }
      }
    }

    for (let i = 0; i < this.burstTime.length; i++) {
      this.waitingTime[i] = waiting;
      waiting += +this.burstTime[i];
      this.turnaroundTime[i] = waiting;
    }

    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  Priority(): void {
    let waiting = 0;
    let turnaround = 0;
    for (let i = 0; i < this.burstTime.length; i++) {
      for (let j = 0; j < this.burstTime.length - i - 1; j++) {
        if (this.priority[j] > this.priority[j + 1]) {
          let temp;
          temp = this.priority[j];
          this.priority[j] = this.priority[j + 1];
          this.priority[j + 1] = temp;
          temp = this.burstTime[j];
          this.burstTime[j] = this.burstTime[j + 1];
          this.burstTime[j + 1] = temp;
          let str;
          str = this.processId[j];
          this.processId[j] = this.processId[j + 1];
          this.processId[j + 1] = str;
        }
      }
    }
    for (let i = 0; i < this.burstTime.length; i++) {
      turnaround = turnaround + +this.burstTime[i];
      this.turnaroundTime[i] = turnaround;
      this.waitingTime[i] = waiting;
      this.averageTurnaroundTime += turnaround;
      this.averageWaitingTime += waiting;
      waiting = waiting + +this.burstTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / this.burstTime.length;
    this.averageTurnaroundTime =
      this.averageTurnaroundTime / this.burstTime.length;
  }

  roundRobin() {
    let t=0;
    let n = this.burstTime.length;
    this.remainingBit=Object.assign([],this.burstTime);
    while(true){
      let done=1;
      for(let i=0;i<n;i++){
        if(this.remainingBit[i]>0){
          done=0;
          if(this.remainingBit[i]>this.quantum){
            this.remainingBit[i]-=this.quantum;
            t+=this.quantum;
          }
          else{
            t+=this.remainingBit[i];
            this.remainingBit[i]=0;	
            this.waitingTime[i]=t-(+this.burstTime[i]);
            this.turnaroundTime[i]=this.waitingTime[i]+(+this.burstTime[i]);
          }
        }
        
      }
      if(done==1){
        break;
      }
    }

    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  fcfs_at() {
    let w = +this.arrivalTime[0];
    let n = this.burstTime.length;
    for (let i = 0; i < this.burstTime.length; i++) {
      for (let j = 0; j < this.burstTime.length - 1; j++) {
        if (this.arrivalTime[j] > this.arrivalTime[j + 1]) {
          let temp;
          temp = this.arrivalTime[j];
          this.arrivalTime[j] = this.arrivalTime[j + 1];
          this.arrivalTime[j + 1] = temp;
          temp = this.burstTime[j];
          this.burstTime[j] = this.burstTime[j + 1];
          this.burstTime[j + 1] = temp;
          let str;
          str = this.processId[j];
          this.processId[j] = this.processId[j + 1];
          this.processId[j + 1] = str;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      this.turnaroundTime[i] = w - +this.arrivalTime[i] + +this.burstTime[i];
      this.waitingTime[i] = w - +this.arrivalTime[i];
      w += +this.burstTime[i];
    }
    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  sjf_at() {
    let n = this.burstTime.length;
    let p: any[][] = [[], [], [], [], [], []];

    for (let i = 0; i < n; i++) {
      p[i][0] = +this.processId[i];
      console.log(p[i][0], this.processId[i]);
    }
    for (let i = 0; i < n; i++) {
      p[i][1] = +this.arrivalTime[i];
    }
    for (let i = 0; i < n; i++) {
      p[i][2] = +this.burstTime[i];
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (p[i][1] > p[i + 1][1]) {
          for (let k = 0; k < 6; k++) {
            let temp;
            temp = p[j][k];
            p[j][k] = p[j + 1][k];
            p[j + 1][k] = temp;
          }
        }
      }
    }

    let temp, index;
    p[0][3] = p[0][1] + p[0][2];
    p[0][5] = p[0][3] - p[0][1];
    p[0][4] = p[0][5] - p[0][2];

    for (let i = 1; i < n; i++) {
      index;
      temp = p[i - 1][3];
      let low = p[i][2];
      for (let j = i; j < n; j++) {
        if (temp >= p[j][1] && low >= p[j][2]) {
          low = p[j][2];
          index = j;
        }
      }
      p[index][3] = temp + p[index][2];
      p[index][5] = p[index][3] - p[index][1];
      p[index][4] = p[index][5] - p[index][2];
      for (let k = 0; k < 6; k++) {
        let temp;
        temp = p[i][k];
        p[i][k] = p[index][k];
        p[index][k] = temp;
      }
    }

    for (let i = 0; i < n; i++) {
      this.processId[i] = p[i][0];
    }
    for (let i = 0; i < n; i++) {
      this.arrivalTime[i] = p[i][1];
    }
    for (let i = 0; i < n; i++) {
      this.burstTime[i] = p[i][2];
    }
    for (let i = 0; i < n; i++) {
      this.waitingTime[i] = p[i][4];
    }
    for (let i = 0; i < n; i++) {
      this.turnaroundTime[i] = p[i][5];
    }

    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  priority_at() {
    let m: any[][] = [[], [], [], [], [], []];
    let n = this.burstTime.length;
    for (let i = 0; i < n; i++) {
      m[i][0] = +this.processId[i];
      m[i][1] = +this.arrivalTime[i];
      m[i][2] = +this.burstTime[i];
      m[i][3] = +this.priority[i];
    }
    let minArrTime = m[0][1];
    for (let i = 0; i < this.burstTime.length; i++) {
      if (m[i][1] < minArrTime) {
        minArrTime = m[i][1];
      }
    }
    for (let i = 0; i < n; i++) {
      let TaskEx = -1;
      for (let j = i; j < this.burstTime.length; j++) {
        if (m[j][1] <= minArrTime) {
          if (TaskEx == -1) {
            TaskEx = j;
          } else if (m[j][3] == m[TaskEx][3]) {
            TaskEx = m[j][0] > m[TaskEx][0] ? TaskEx : j;
          } else if (m[j][3] < m[TaskEx][3]) {
            TaskEx = j;
          }
        }
      }
      //comp time
      if (i == 0) {
        m[TaskEx][4] = m[TaskEx][1] + m[TaskEx][2];
      } else {
        m[TaskEx][4] = m[TaskEx][2] + m[i - 1][4];
      }
      m[TaskEx][5] = m[TaskEx][4] - m[TaskEx][1]; //turn around
      m[TaskEx][6] = m[TaskEx][5] - m[TaskEx][2]; //waiting time
      for (let k = 0; k < 7; k++) {
        let temp;
        temp = m[TaskEx][k];
        m[TaskEx][k] = m[i][k];
        m[i][k] = temp;
      }
      minArrTime += m[i][2];
    }
    for (let i = 0; i < n; i++) {
      this.processId[i] = m[i][0];
      this.arrivalTime[i] = m[i][1];
      this.burstTime[i] = m[i][2];
      this.priority[i] = m[i][3];
      this.turnaroundTime[i] = m[i][5];
      this.waitingTime[i] = m[i][6];
    }
    for (let i = 0; i < this.burstTime.length; i++) {
      this.averageWaitingTime += this.waitingTime[i];
      this.averageTurnaroundTime += this.turnaroundTime[i];
    }
    this.averageWaitingTime = this.averageWaitingTime / n;
    this.averageTurnaroundTime = this.averageTurnaroundTime / n;
  }

  roundrobin_at() {
    let remain,
      time,
      n = this.burstTime.length,
      flag = 0;
    remain = n;
    for (let count = 0; count < n; count++) {
      this.remainingTime[count] = this.burstTime[count];
      for (time = 0; (count = 0); remain != 0) {
        if (
          this.remainingTime[count] <= this.quantum &&
          this.remainingTime[count] > 0
        ) {
          time += this.remainingTime[count];
          this.remainingTime[count] = 0;
          flag = 1;
        } else if (this.remainingTime[count] > 0) {
          this.remainingTime[count] == this.quantum;
          time += this.quantum;
        }
        if (this.remainingTime[count] && flag == 1) {
          remain--;
          this.waitingTime[count] +=
            time - +this.arrivalTime[count] - +this.burstTime[count];
          this.turnaroundTime[count] += time - this.arrivalTime[count];
          flag = 0;
        }
        if (count == n - 1) count = 0;
        else if (this.arrivalTime[count] <= time) count++;
        else count = 0;
      }
    }
  }
}
