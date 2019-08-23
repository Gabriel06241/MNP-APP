import { Component, Input } from '@angular/core';

/**
 * Generated class for the CountdownTimerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

export interface CountdownTimer {
  seconds: number;
  // runTimer: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  secondsRemaining: number;
  displayTime?: string;
}

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class Timer {

  // @Input() timeInSeconds: number;
  @Input() timeInSeconds: number;
  timer: CountdownTimer;

  ngOnInit() {
    console.log('#1 ==>>> ', this.timeInSeconds);
    this.timeInSeconds = 150;
    console.log('#1 ==>>> ', this.timeInSeconds);
    this.initTimer();
  }

  hasFinished() {
    console.log('Finished #1...');
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) {
      this.timeInSeconds = 0;
    }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      // secondsRemaining: this.timeInSeconds
      secondsRemaining: 0
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) {
        return;
      }
      // --this.timer.secondsRemaining;
      ++this.timer.secondsRemaining;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      // if (this.timer.secondsRemaining > 0) {
      if (this.timer.secondsRemaining < this.timeInSeconds) {
        this.timerTick();
      } else {
        console.log('Real normal finished...');
        this.timer.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

}
