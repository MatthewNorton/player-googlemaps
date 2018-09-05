// CUSTOM JS Google Maps ----------------------------------------------------*/
declare var manywho: any;
declare var google: any;

import * as React from 'react';
import './index.css';

/* TODO 
    - code clean up
    - seperate properties, states
    - seperate component
    - adding dynamic longitude latidue 
*/


let marker, map, location, place, infowindow;

class googleMaps extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 14,
            maptype: 'roadmap', // terrain // roadmap
            heading: 90,
            tilt: 75,
            place_formatted: '',
            place_id: '',
            place_location: '',
            rotateControl: true,
            lat: 1.34,
            long: 103.54,
            markers: []
        }
    }
    componentDidMount () {
        // Get the component's model, which includes any values bound to it
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);

        // Create the map in an element on the page
        let map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: this.state.lat, lng: this.state.long },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            tilt: this.state.tilt,
        });

        // Loop through all the data in the value this component is bound to
        model.objectData.forEach(result => {
            // Assume the latitude is the 1st "display column" set in the page component
            const latitude = result.properties.find(property => property.typeElementPropertyId === columns[0].typeElementPropertyId);

            // Assume the longitude is the 2nd "display column" set in the page component
            const longitude = result.properties.find(property => property.typeElementPropertyId === columns[1].typeElementPropertyId);

            // Assume the name is the 3rd "display column" set in the page component
            const name = result.properties.find(property => property.typeElementPropertyId === columns[2].typeElementPropertyId);

            // Add the list object as a marker on the map
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude.contentValue, longitude.contentValue),
                map: map,
                title: name.contentValue
            });
        });

        // adding auto complete input field
        let inputNode = document.getElementById('ac-input');
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputNode)
        let autoComplete = new google.maps.places.Autocomplete(inputNode);

        autoComplete.addListener('place_changed', () => {
            place = autoComplete.getPlace();
            location = place.geometry.location;

            this.setState({
                place_formatted: place.formatted_address,
                place_id: place.place_id,
                place_location: location.toString(),
            });

            // display selected place on map
            map.fitBounds(place.geometry.viewport);
            map.setCenter(location);

            marker.setPlace({
                placeId: place.place_id,
                location: location,
            });
        });
    }
    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>    
                <div className="content-wrapper">
                    <div id='autocomplete-input'>
                        <input id="ac-input" type='text' placeholder='Enter a location' />
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register('google-map', googleMaps);
export default googleMaps;
