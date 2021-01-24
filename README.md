# Report

## Autore
Christian Corrò - 133110

## Descrizione

## Risultati
<img src="images/report/final.png" alt="Risultato finale">

## Struttura dei file
```
dreamcaster 
└───css                     
│   │    style.css          - foglio di stile generale
│   │    sidebar.css        - foglio di stile per la sidebar
│   │    main-menu.css      - foglio di stile per il pulsante della sidebar
└───fonts  
│   └─── ...                - font utilizzati 
└───images  
│   └─── icons              - icone del sito             
│   └─── journal            - immagini per il diario              
│   └─── material-previews  - immagini per le preview dei materiali nella sidebar             
│   └─── report             - immagini per la relazione finale
└───js  
│   │    main.js            - script principale          
│   │    sidebar.js         - script per gestire gli eventi della sidebar          
│   │    main-menu.js       - script per gestire l'apertura/chiusura della sidebar          
│   └─── libs               - librerie
└───models                  - modello 3D
│   └─── stratocaster
└───textures                - modello 3D
│   └─── cubemaps           - envMap e irradianceMap
│   └─── materials          - texture per i vari materiali
│   index.html             
```

## Implementazione
### Software e piattaforme utilizzate
* [**3D Studio Max**](https://www.autodesk.com/products/3ds-max/) (licenza studente) per modificare il modello
* [**CC0 Textures**](https://cc0textures.com/) per le texture PBR gratuite
* [**Riot** ](https://cc0textures.com/)(Radical Image Optimization Tool) per ridurre il peso delle texture

## Prestazioni
*  PC CPU i5-7200U 2.5 GHz, RAM 8 GB
    * Chrome 88: **60 fps**
    * Edge 88: **60 fps**
    * Firefox 83: **60 fps**
* iPad Air 3
    * Chrome: **55 fps**
    * Safari: **50 fps**
* Samsung Galaxy s8
    * Chrome: **60 fps** 
## Sviluppi futuri
Permettere di aggiungere materiali personalizzati anche con l'upload di texture.

## Crediti
* [Modello Stratocaster](https://evermotion.org/downloads/show/322/fender-stratocaster-3d-model#x) scaricato con licenza CC-BY-NC.
* Cubemap scaricata da [freestocktextures.com](https://freestocktextures.com/)
