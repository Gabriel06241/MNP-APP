import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the TimerProgressComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

export interface CountdownTimer {
  seconds: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  secondsRemaining: number;
  displayTime: string;
}

@Component({
  selector: 'timer-progress',
  templateUrl: 'timer-progress.html'
})
export class TimerProgress {

  @Input() timeInSeconds: number;
  timer: CountdownTimer;
  private increment;
  private transform;
  private percent;
  private fixTransform;

  constructor(
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit() {
    this.timeInSeconds = 300;
    this.initTimer();
  }

  hasFinished() {
    return this.timer.hasFinished;
  }
  initProgressBar() {
    this.percent = 100;
    this.increment = 180 / 100;
    const progress = 'rotate(' + this.increment * this.percent + 'deg)';
    this.transform = this.sanitizer.bypassSecurityTrustStyle(progress);
    this.fixTransform = this.sanitizer.bypassSecurityTrustStyle(progress);
  }

  initTimer() {
    this.initProgressBar();
    if (!this.timeInSeconds) { this.timeInSeconds = 0; }

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
      if (!this.timer.runTimer) { return; }
      // this.timer.secondsRemaining--;
      this.timer.secondsRemaining++;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      this.percent = this.timer.secondsRemaining / this.timer.seconds * 100;
      this.increment = 180 / 100;
      const progress = 'rotate(' + this.increment * this.percent + 'deg)';
      this.transform = this.sanitizer.bypassSecurityTrustStyle(progress);
      this.fixTransform = this.sanitizer.bypassSecurityTrustStyle(progress);
      // if (this.timer.secondsRemaining > 0) {
      if (this.timer.secondsRemaining < this.timeInSeconds) {
        this.timerTick();
      } else {
        console.log('Real finished progress...', new Date());
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
