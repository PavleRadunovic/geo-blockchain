import React, {useState, useEffect, useRef} from "react";
import ReactDOM from 'react-dom/client';
import "./MapView.css";
import {Map, View} from 'ol';
import {Tile} from 'ol/layer';
import Overlay from 'ol/Overlay';
import {OSM, Vector as VectorSource} from 'ol/source';
import { Vector as VectorLayer } from "ol/layer";
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import {Draw, Modify, Snap, Select} from 'ol/interaction';
import {unByKey} from 'ol/Observable'

import MapContext from "./MapContext";

import Popup from './Popup.js';
import PopupResults from "./PopupResults";
import Spinner from "../Spinner";
import ChoiceOfgeometry from "./ChoiceOfgeometry";

function MapView({children}) {

    const mapRef = useRef();
    const [map, setMap] = useState(null);
    const [textPopup, setTextPopup] = useState({});
    const [results, setResults] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupResults, setShowPopupResults] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    let draw_interaction;
    // save the changed data
    let format = new GeoJSON()
    // this will be the data in the chosen format
    let data;
    const source = new VectorSource();
        const vector = new VectorLayer({
          name: 'new_object',
          source: source,
          style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
          },
        });

    const image = new CircleStyle({
        radius: 5,
        fill: new Fill({color: 'blue'}),
        stroke: new Stroke({ color: 'red', width: 1 }),
    });
    
    const styles = {
        'Point': new Style({
            image: image,
            text: new Text({
                font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
                placement: 'point',
                fill: new Fill({color: '#fff'}),
                offsetY: 15,
                stroke: new Stroke({color: '#000', width: 2}),
            })
        }),
        'MultiPoint': new Style({
            image: image,
        }),
        'MultiPolygon': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2,
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.5)',
            }),
        }),
        'Polygon': new Style({
            stroke: new Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
        }),
        'Circle': new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2,
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.2)',
            }),
        }),
    };

    useEffect(()=>{
        let options = {
            view: new View({
                center: [20.43, 44.80],
                zoom: 15,
                minZoom: 2,
                maxZoom: 19,
                projection: 'EPSG:4326'
            }),
            layers:[
                new Tile({
                    source: new OSM()
                }),
            ],
            controls: [],
        }

        let mapObject = new Map(options);
        mapObject.setTarget(mapRef.current);

        setMap(mapObject);

        let xmin = 20.419;
	    let ymin = 44.787;
	    let xmax = 20.45;
	    let ymax = 44.804;
	    mapObject.getView().fit([xmin, ymin, xmax, ymax], mapObject.getSize());

        addFirstObjects(mapObject);
        addFirstPoint(mapObject);

        /////////

        
        mapObject.addLayer(vector);

        // const modify = new Modify({source: source});
        // mapObject.addInteraction(modify);

        

        // addInteractions();

        return () => mapObject.setTarget(undefined);

    }, []);

    const showPopupObject = (event)=>{
        event.preventDefault();
        setShowPopupResults(false);
        changeCursor('pointer');

        addInteractions(map);
    }

    function addInteractions(map) {
        
        draw_interaction = new Draw({
        source: source,
        type: 'Polygon',
      });
      map.addInteraction(draw_interaction);
    //   snap = new Snap({source: source});
    //   mapObject.addInteraction(snap);
    //   console.log(draw)
    
    
        draw_interaction.on('drawend', function(event) {
            // var id = Math.random() * 1000000;
            // event.feature.setId(id);
            // console.log([event.feature.getGeometry().getCoordinates()]);
            let coordi = [event.feature.getGeometry().getCoordinates()]
            setTextPopup({
                type: 'polygon',
                coordi
            });
            changeCursor('');
            setShowPopup(true);


            
            
            try {
                // map.addLayer(vectorPolygonLayer(coordi, 'gfdgdf', 'dffdf', '1', '54/54'));
              
              vector.getSource().clear();
              map.removeInteraction(draw_interaction);
            } catch (e) {
              console.log(e)
              return;
            }
        });

        
    }

    const addFirstPoint = (map) =>{
        try{
            fetch(`http://localhost:3001/getHouseNumber`,{
                    method: 'GET',
                    // headers: {
                    //     'Accept': 'application/json',
                    //     'Content-Type': 'application/json'
                    //   }
                }).then(res => res.json())
                .then(data => {
                    const res = data.features;
                    res.forEach(item => {
                        map.addLayer(vectorLayer(item.geometry.coordinates[0], item.geometry.coordinates[1], item.properties.account, item.properties.contractAddress, item.properties.kucni_broj));
                    })

                //     map.addLayer(vectorLayer(lon, lat, data.account, data.contractAddress, data.houseNumber));
                //     console.log('ddddd')
                //     setShowPopup(false);
                //     setShowSpinner(false);
                });
        }
        catch(error){

        }
    }

    const addFirstObjects= (map) =>{
        try{
            fetch(`http://localhost:3001/getCadastralObjects`,{
                    method: 'GET',
                    // headers: {
                    //     'Accept': 'application/json',
                    //     'Content-Type': 'application/json'
                    //   }
                }).then(res => res.json())
                .then(data => {
                    const res = data.features;
                    res.forEach(item => {
                        map.addLayer(vectorPolygonLayer(item.geometry.coordinates, item.properties.account, item.properties.contractAddress, item.properties.brdelaparc, item.properties.brparcele));
                    })

                //     map.addLayer(vectorLayer(lon, lat, data.account, data.contractAddress, data.houseNumber));
                //     console.log('ddddd')
                //     setShowPopup(false);
                //     setShowSpinner(false);
                });
        }
        catch(error){

        }
    }

    const addPoint = () => {

        try{
            setShowSpinner(true);
            const houseNumber = document.querySelector('#input-field').value;
            const lon = textPopup.lon;
            const lat = textPopup.lat;
            const globalId = Math.floor(Math.random() * 1000000);
                fetch(`http://localhost:3001/addPoint`,{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        lat,
                        lon,
                        globalId,
                        houseNumber
                        })
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    map.addLayer(vectorLayer(lon, lat, data.account, data.contractAddress, data.houseNumber));
                    console.log('ddddd')
                    setShowPopup(false);
                    setShowSpinner(false);
                });
            } catch(error){
                setShowSpinner(false);
            }
        
    }

    const addObject = () => {

        try{
            setShowSpinner(true);
            const parcelNumber = document.querySelector('#input-field1').value;
            const objectNumber = document.querySelector('#input-field2').value;
            const globalId = Math.floor(Math.random() * 1000000);
            const coordi = textPopup.coordi

            fetch(`http://localhost:3001/addObject`,{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        coordi,
                        globalId,
                        objectNumber,
                        parcelNumber
                        })
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    map.addLayer(vectorPolygonLayer(coordi, data.account, data.contractAddress, objectNumber, parcelNumber));
                    console.log('ddddd')
                    setShowPopup(false);
                    setShowSpinner(false);
                });
            } catch(error){
                setShowSpinner(false);
            }
        
    }


    const showPopupView = (event)=>{
        event.preventDefault();
        setShowPopupResults(false);
        changeCursor('pointer');
        const mapClickEvent = map.on('click', evt => {
            const lon = evt.coordinate[0];
            const lat = evt.coordinate[1];
            console.log('dasdsa')
            setTextPopup({
                type: 'point',
                lon,
                lat
            })
            changeCursor('');
            setShowPopup(true);
            unByKey(mapClickEvent);
        })

    }

    



    const changeCursor = (cursor)=>{
        map.on('pointermove', function(e){
            map.getViewport().style.cursor = cursor;
        });
    }

    const getPoint = (event)=>{
        event.preventDefault();
        setShowPopupResults(false);

        changeCursor('pointer');

        let contractAddress = '';
        const mapClickEvent2 = map.on('click', evt => {
            setShowSpinner(true);
            map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
               if (feature && feature.getGeometry().getType() === 'Point') {
                 contractAddress = feature.values_.contractAddress
               } else {
                console.log('lose')
                }
             });

             if (contractAddress != '') {
                try{
                    fetch(`http://localhost:3001/getPoint`,{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            contractAddress
                            })
                    }).then(res => res.json())
                    .then(data => {
                        data.type = 'point';
                        setResults(data);
                        setShowPopupResults(true);
                        setShowSpinner(false);
                    });
                } catch(error){
                    setShowSpinner(false);
                }
    
             }
            setShowSpinner(false);
            changeCursor('');
            unByKey(mapClickEvent2);
        })
    }


    const getObjects = (event)=>{
        event.preventDefault();
        setShowPopupResults(false);

        changeCursor('pointer');

        let contractAddress = '';
        const mapClickEvent2 = map.on('click', evt => {
            setShowSpinner(true);
            map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                console.log(feature.getGeometry())
               if (feature && feature.getGeometry().getType() === 'MultiPolygon') {
                 contractAddress = feature.values_.contractAddress
               } else {
                console.log('lose')
                }
             });

             if (contractAddress != '') {
                try{
                    fetch(`http://localhost:3001/getObjects`,{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            contractAddress
                            })
                    }).then(res => res.json())
                    .then(data => {
                        data.type = 'polygon';
                        setResults(data);
                        setShowPopupResults(true);
                        setShowSpinner(false);
                    });
                } catch(error){
                    setShowSpinner(false);
                    console.log('error: ' + error)
                }
    
             }
            setShowSpinner(false);
            changeCursor('');
            unByKey(mapClickEvent2);
        })
    }


    const styleFunction = function (feature) {
        const style = styles[feature.getGeometry().getType()];
        style.getText().setText(feature.get("houseNumber"))
        return style;
    };

    const stylePolygonFunction = function (feature) {
        const style = styles[feature.getGeometry().getType()];
        return style;
    };

    const getPointFeature = function (long, lat, account, contractAddress, houseNumber) {

        let geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326',
                },
            },
            'features': [
                {
                    'type': 'Feature',
                    "properties": {
                        "longitude": long,
                        "latitude": lat,
                        "account": account,
                        "contractAddress": contractAddress,
                        "houseNumber": houseNumber
                      },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [long, lat],
                    },
                }
            ],
        };
    
        return geojsonObject
    }

    const getPolygonFeature = function (coords, account, contractAddress, objectNumber, parcelNumber) {

        let geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326',
                },
            },
            'features': [
                {
                    'type': 'Feature',
                    "properties": {
                        "account": account,
                        "contractAddress": contractAddress,
                        "objectNumber": objectNumber,
                        "parcelNumber": parcelNumber
                      },
                    'geometry': {
                        'type': 'MultiPolygon',
                        'coordinates': coords,
                    },
                }
            ],
        };
    
        return geojsonObject
    }

    const vectorLayer = function (long, lat, account, contractAddress, houseNumber) {
        return new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(getPointFeature(long, lat, account, contractAddress, houseNumber)),
            }),
            style: styleFunction,
        });
    }

    const vectorPolygonLayer = function (coords, account, contractAddress, objectNumber, parcelNumber) {
        return new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(getPolygonFeature(coords, account, contractAddress, objectNumber, parcelNumber)),
            }),
            style: stylePolygonFunction,
        });
    }

    const hidePopup = () => {
        console.log('ssss')
        setShowPopup(false);
    }

    const hidePopupResults = () => {
        console.log('ssss')
        setShowPopupResults(false);
    }

    return (
        <MapContext.Provider value={{map}}>
            <>
                <div ref={mapRef} className="ol-map">
                    {children}
                </div>
                {/* <div className='feature-objects'>
                    <div>
                        <button onClick={showPopupView} type="button" className="btn btn-light">Add point</button>
                    </div>
                    <div>
                        <button onClick={getPoint} type="button" className="btn btn-light">Get point</button>
                    </div>
                </div> */}
                <ChoiceOfgeometry feature='feature' showPopupView={showPopupView} getPoint={getPoint} titleAdd='Add point' titleGet='Get point'/>
                <ChoiceOfgeometry feature='feature-objects' showPopupView={showPopupObject} getPoint={getObjects} titleAdd='Add objects' titleGet='Get objects'/>
                
                {showPopup ? <Popup textPopup = {textPopup} addPoint = {textPopup.type === 'point' ? addPoint : addObject} hidePopup = {hidePopup}/> : null}
                {showPopupResults ? <PopupResults  results={results} hidePopupResults={hidePopupResults}/> : null}
                {showSpinner ? <Spinner/> : null } 

            </>
            
        </MapContext.Provider>
        
    )
}

export default MapView;
