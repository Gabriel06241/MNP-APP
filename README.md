En este repositorio encontraras paso a paso de toda la informacion y codigo fuente necesario para ejecutar y probar todas las funcionalidades desarrolladas en la aplicacion MNP APP.

# MNP APP (Instalación y Configuración)

## Requisitos para utilizar este proyecto:

Node.js ( https://nodejs.org/download/ )

Npm (Administrador de paquetes de nodos, viene con la instalación de node.js)

En caso de que no estés con la última versión de npm:

```
$ npm install -g npm
```

## Primeros pasos:
1. Para la instalacion y ejecucion de la aplicacion se necesita tener ionic y cordova instalados.
```
$ npm install -g cordova ionic
```

2. Realizar una copia o clonacion de este repositorio a tu computadora.
```
$ git clone https://github.com/Gabriel06241/MNP-APP.git
```

## Instalacion de dependencias de terceros:
Una vez clonado el repositorio, ejecute este comando en su terminal para instalar todas las dependencias necesarias. (Nota: ejecutar los comandos dentro del directorio donde se realizo la clonacion del repositorio)
```
$ npm install
```

## Instalacion de dependencias de cordova:
Ejecute este comando en su terminal para agregar la plataforma de android donde se ejecutara la aplicacion.
```
$ ionic cordova add platform android
```

Ejecute los siguientes comandos para instalar cada plugin necesario y poder probar correctamente todas las fucionalidades de la aplicacion en un dispositivo *smartphone*.

### Camara
```
$ ionic cordova plugin add cordova-plugin-camera
$ npm install --save @ionic-native/camera
```

### Geolocalización:
```
$ ionic cordova plugin add cordova-plugin-geolocation
$ npm install @ionic-native/geolocation
```
para mas información https://github.com/apache/cordova-plugin-geolocation

### Mapas
```
$ ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="..."
$ npm install --save @ionic-native/google-maps

```
para mas información https://github.com/ionic-team/ionic-native-google-maps

### Notificaciones
```
$ ionic cordova plugin add cordova-plugin-fcm
$ npm install --save @ionic-native/fcm
```

## Ejecucion de la aplicación

### Ejecutar e iniciar la aplicacion en el navegador:
```
$ ionic serve -l
```

### Ejecutar la aplicacion en tu telefono *smartphone*
```
ionic cordova run android
```

## Generando instalador APK
Ejecute el siguiente comando para generar el apk instalador de la aplicacion.
```
ionic cordova build android
```

## Especificaciones del entorno usado para el desarrollo

```
cli packages:

    @ionic/cli-utils  : 1.19.3
    ionic (Ionic CLI) : 3.20.1

global packages:

    cordova (Cordova CLI) : 8.1.2 (cordova-lib@8.1.1)

local packages:

    @ionic/app-scripts : 3.2.1
    Cordova Platforms  : android 6.3.0
    Ionic Framework    : ionic-angular 3.9.2

System:

    Android SDK Tools : 26.1.1
    Node              : v10.9.0
    npm               : 6.4.1
    OS                : Windows 8

```
