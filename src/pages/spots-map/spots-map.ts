import { SpotPage } from './../spot/spot';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GoogleMaps } from "@ionic-native/google-maps";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import * as firebase from 'Firebase';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-spots-map',
  templateUrl: 'spots-map.html',
})
export class SpotsMapPage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  spotsList: any = [];
  infoWindowList: any = [];

  markers = [];
  ref = firebase.database().ref('geolocations/');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public googleMaps: GoogleMaps,
    public http: Http
  ) {
    this.getPosition();
    this.http.get('assets/data/locations.json').map(res => res.json())
    .subscribe(data => {
      this.spotsList = data.spots;
    },
      err => console.log("error is " + err), // error
      () => console.log('read company data Complete ' + this.spotsList) // complete
    );
  }

  ionViewDidLoad() {
    this.getPosition();
  }

  getPosition(): any {
    this.geolocation.getCurrentPosition()
      .then((geoposition) => {
        this.displayGoogleMap(geoposition);
      }).catch(error => { console.log(error); });
  }

  displayGoogleMap(geoposition: Geoposition) {
    let latitude = geoposition.coords.latitude;
    let longitude = geoposition.coords.longitude;
    let myLatLng = new google.maps.LatLng({ lat: latitude, lng: longitude });

    let mapOptions = {
      center: myLatLng,
      disableDefaultUI: true,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.map.setCenter(myLatLng);
    this.getMarkers();
  }

  getMarkers() {
    for (let _i = 0; _i < this.spotsList.length; _i++) {
      if (_i > 0) {
        this.addMarkersToMap(this.spotsList[_i]);
      }
    }
  }

  addMarkersToMap(location) {
    const marker = this.addMarker(location);
    marker.addListener('click', () => {
      this.closeAllInfoWindow();
      marker.infowindow.open(this.map, marker);
    });
  }

  addMarker(location) {
    let position = { lat: location.latitude, lng: location.longitude };

    var contentString = '<div id="content"><h5 id="firstHeading" class="firstHeading">'
      + location.nombre
      + '</h5>\n<p>'
      + location.direccion
      + '</p></div>';

    let infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });
    this.infoWindowList.push(infowindow);

    return new google.maps.Marker({
      position: position,
      map: this.map,
      infowindow: infowindow
    })
  }

  closeAllInfoWindow() {
    for (var i = 0; i < this.infoWindowList.length; ++i) {
      this.infoWindowList[i].close();
    }
  }

  createSpot() {
    this.navCtrl.push(SpotPage);
  }
}
