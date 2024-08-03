/// <reference types="@types/google.maps" />
// <--Note: directive to reference the typefile

// Instructions to every other class on how they can be an argument to "addMarker"
export interface Mappable {
  location: {
    lat: number;
    lng: number;
  };
  markerContent(): string;
  color: string;
}
export class CustomMap {
  private googleMap: google.maps.Map;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(
      document.getElementById(divId) as HTMLElement,
      {
        zoom: 1,
        center: { lat: 0, lng: 0 },
        mapId: divId,
      }
    );
  }
  async addMarker(mappable: Mappable): Promise<void> {
    try {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const marker = new AdvancedMarkerElement({
        map: this.googleMap,
        position: { lat: mappable.location.lat, lng: mappable.location.lng },
      });
      marker.addListener("click", () => {
        const infoWindow = new google.maps.InfoWindow({
          content: mappable.markerContent(),
        });
        infoWindow.open(this.googleMap, marker);
      });
    } catch (error) {
      console.error("Failed to load the marker library: ", error);
    }
  }
}
