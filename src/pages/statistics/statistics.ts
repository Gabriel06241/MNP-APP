import { Component, ViewChild  } from '@angular/core';
import { ModalController } from 'ionic-angular';

import moment from 'moment';
import chartJs from 'chart.js';
import firebase from 'firebase';

import { UserProvider } from '../../providers/user/user';
import { StatisticsDescriptionPage } from "./../statistics-description/statistics-description";
import { HistoryTablePage } from '../history-table/history-table';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  barChart: any;
  lineChart: any;

  currentUserId: any = '';
  routineTrainings = [];
  routines = [];
  data = [300, 0, 0];
  dataLineChart = []

  constructor(
    public userProvider: UserProvider,
    public modalCtrl: ModalController,
  ) {
    this.currentUserId = this.userProvider.getCurrentUser();
    firebase.firestore().collection("userTrainings")
    .where("userId", "==", this.currentUserId.id)
    .orderBy("routineId", "asc")
    .get().then((documents) => {
      documents.forEach((document) => {
        this.routineTrainings.push({
          id: document.id,
          timeDiff: document.data().timeDiff,
          timeStart: moment(document.data().timeStart).format('YYYY-MM-DD'),
          userId: document.data().userId,
          routineId: document.data().routineId,
          routineName: document.data().routineName,
          routineCategory: document.data().routineCategory
        });
        if (!this.routines.filter(r => r.id === document.data().routineId).length) {
          this.routines.push({
            id: document.data().routineId,
            routineName: document.data().routineName
          })
        }
      });
    }).catch((error) => {
      console.log('@error >>>> ', error)
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.barChart = this.getBarChart();
    }, 150);
    setTimeout(() => {
      this.lineChart = this.getLineChart();
    }, 250);
    setTimeout(() => {

    }, 350);
  }

  getChart(context, chartType, data, options?) {
    context.font = '20px';
    context.fillStyle = 'black';
    context.textAlign = "center";
    context.textBaseline = "bottom";
    return new chartJs(context, {
      data,
      options,
      type: chartType,
    });
  }

  getBarChart() {
    const data = {
      labels: ['Estandar', 'Usado', 'Promedio'],
      datasets: [{
        label: '',
        data: this.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      }
    };
    return this.getChart(this.barCanvas.nativeElement, 'bar', data, options);
  }

  getLineChart() {
    const data = {
      labels: ['', '', '', '', '', '', ''],
      datasets: [
        {
          label: 'Tiempo de referencia',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(31,4,4,1)',
          borderColor: 'rgba(31,4,4,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderWidth: 0.7,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(31,4,4,0)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(31,4,4,0)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [300, 300, 300, 300, 300, 300, 300],
          spanGaps: false,
        },{
          label: '',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(237,53,53,1)',
          borderColor: 'rgba(237,53,53,1)',
          borderCapStyle: 'butt',
          borderDash: [5, 8],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(31,156,156,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(31,156,156,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false,
        }
      ]
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            gridLines: {
              display: true,
              color: 'rgba(219,219,219,0.3)',
              zeroLineColor: 'rgba(219,219,219,0.3)',
              drawBorder: false,
              lineWidth: 27,
              zeroLineWidth: 1
            },
            ticks: {
              beginAtZero: true,
              display: true
            }
          }
        }]
      },
      legend: {
        display: false
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      }
    };
    return this.getChart(this.lineCanvas.nativeElement, 'line', data, options);
  }

  onChangeTraining(event: any) {
    this.data[1] = event.timeDiff;
    let qtyRoutines = 0;
    const avgTrainingRoutine = this.routineTrainings.reduce((sum, item) => {
      if (item.routineId == event.routineId) {
        const realValue = item.timeDiff;
        ++qtyRoutines;
        return sum + realValue;
      }
      return sum;
    }, 0);
    this.data[2] = Math.round(avgTrainingRoutine / qtyRoutines);
    this.barChart.data.datasets[0].data = this.data;
    this.barChart.update();
  }

  onChangeRoutine(event: any) {
    this.dataLineChart = [];
    let labelsAxisX = [];
    this.routineTrainings.filter((training) => {
      if (training.routineId === event.id) {
        this.dataLineChart.push(training.timeDiff);
      }
    });
    this.lineChart.data.datasets[1].data = this.dataLineChart;
    this.lineChart.update();
  }

  viewHistoryTrainings() {
    console.log('>> viewHistoryTrainings <<')
    this.modalCtrl.create(HistoryTablePage, {
      "trainings": this.routineTrainings
    }).present();
  }

  viewStatisticsDetail() {
    console.log('>> viewStatisticsDetail <<')
    this.modalCtrl.create(StatisticsDescriptionPage, {
      "trainings": this.routineTrainings
    }).present();
  }

}
