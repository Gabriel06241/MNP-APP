import {Injectable} from '@angular/core';
import {Platform, ToastController, Events} from "ionic-angular";
import {Network} from "@ionic-native/network";

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkConnectionProvider {

  public isOnline: boolean = true;
  private previousStatus;

  constructor(
    private network: Network,
    private platform: Platform,
    private toastCtrl: ToastController,
    private eventCtrl: Events
  ) {
    this.platform.ready().then(() => {
      this.previousStatus = ConnectionStatusEnum.Online;
      this.initializeNetworkEvents();
    });
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.eventCtrl.publish('network:Offline');
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
      this.isOnline = false;
    });

    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.Online;
      this.isOnline = true;
    })
  }

}
