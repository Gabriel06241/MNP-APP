// Global state (used for theming)
import { AppState } from './app.global';

// Ionic native providers o services
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleMaps } from "@ionic-native/google-maps";

// Pages or Components
import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AboutPage } from "../pages/about/about";
import { UserPage } from "../pages/user/user";
import { SpotsPage } from "../pages/spots/spots";
import { SpotPage } from "../pages/spot/spot";
import { RoutinesPage } from "../pages/routines/routines";
import { StatisticsPage } from "../pages/statistics/statistics";
import { SettingsPage } from "../pages/settings/settings";
import { CountdownPage } from "../pages/countdown/countdown";
import { ExerciseListPage } from "../pages/exercise-list/exercise-list";
import { SpotsMapPage } from "../pages/spots-map/spots-map";
import { SlidePreheatingPage } from './../pages/slide-preheating/slide-preheating';
import { CategoryComponent } from './../components/category/category';

// Modules
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RoundProgressModule, ROUND_PROGRESS_DEFAULTS } from 'angular-svg-round-progressbar';
import { StarRatingModule } from 'ionic3-star-rating';
import { Ionic2RatingModule } from 'ionic2-rating';

// Services or Providers
import { ToastService } from '../providers/utils/toast.service';
import { AlertService } from '../providers/utils/alert.service';
import { UserProvider } from '../providers/user/user';
import { UtilsProvider } from '../providers/utils/utils';
import { AuthProvider } from '../providers/auth/auth';
import { RoutineProvider } from '../providers/routine/routine';
import { DatabaseProvider } from '../providers/database/database';

// Directives

// Environment Configuration
import { ENVIRONMENT } from "../environment/environment";

export const PAGES = [
  LoginPage,
  HomePage,
  UserPage,
  RoutinesPage,
  StatisticsPage,
  SpotsPage,
  SpotPage,
  SettingsPage,
  AboutPage,
  CountdownPage,
  ExerciseListPage,
  SpotsMapPage,
  CategoryComponent,
  SlidePreheatingPage
]

export const MODULES = [
  BrowserModule,
  HttpModule,
  HttpClientModule,
  AngularFireModule.initializeApp(ENVIRONMENT.firebase),
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFireStorageModule,
  AngularFirestoreModule.enablePersistence(),
  RoundProgressModule,
  ChartsModule,
  StarRatingModule,
  Ionic2RatingModule
];

export const PROVIDERS = [
  {
    provide: ROUND_PROGRESS_DEFAULTS,
    useValue: {
      color: '#f00',
      background: '#0f0'
    }
  },
  UtilsProvider,
  ToastService,
  AlertService,
  AuthProvider,
  UserProvider,
  RoutineProvider,
  AppState,
  DatabaseProvider,

  // Ionic native specific providers
  StatusBar,
  SplashScreen,
  Camera,
  ImagePicker,
  Crop,
  Geolocation,
  GoogleMaps
];

export const DIRECTIVES = [

];
