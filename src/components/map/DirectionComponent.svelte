<script>
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import L from "leaflet";

  import MapZoomControllComponent from "./MapZoomControllComponent.svelte";
  import MapControlComponent from "./MapToolbarComponent.svelte";

  import {
    getCurrentLocation,
    getDirection,
  } from "../../lib/module/map.direction";

  import {
    markerHotel,
    markerResto,
    markerTour,
  } from "../../lib/module/map.marker";

  export let destination;

  // console.log(dest);

  let map;

  function updateSize() {
    if (map) {
      map.invalidateSize();
    }
  }

  onMount(() => {
    map = L.map(document.querySelector(".map"), {
      doubleClickZoom: false,
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([-2.9472475, 115.1483882], 11);

    // Leaflet control
    let toolbarComponent;
    let zoomControlComponent;
    let toolbar = L.control({ position: "topleft" });
    let zoomControl = L.control({ position: "bottomright" });

    // zoom controll
    zoomControl.onAdd = (map) => {
      let wrapper = L.DomUtil.create("div");
      zoomControlComponent = new MapZoomControllComponent({
        target: wrapper,
        props: {},
      });

      zoomControlComponent.$on("map-zoom-in", () => {
        map.zoomIn();
      });
      zoomControlComponent.$on("map-zoom-out", () => {
        map.zoomOut();
      });

      return wrapper;
    };

    // toolbar controll
    toolbar.onAdd = (map) => {
      let wrapper = L.DomUtil.create("div");
      toolbarComponent = new MapControlComponent({
        target: wrapper,
        props: {},
      });

      toolbarComponent.$on("back-to-list", () => {
        pop();
      });

      return wrapper;
    };

    toolbar.onRemove = (map) => {
      if (toolbarComponent) {
        toolbarComponent.$destroy();
        toolbarComponent = null;
      }
    };

    // initialize Marker
    if (destination.destType === "tours") {
      let tour = L.marker([destination.lat, destination.lng], {
        icon: markerTour(),
      });
      tour.bindPopup(`Lokasi wisata ${destination.destTitle}`);
      tour.addTo(map);
      map.flyTo([destination.lat, destination.lng], 10);
    } else if (destination.destType === "resto") {
      let resto = L.marker([destination.lat, destination.lng], {
        icon: markerResto(),
      });
      resto.bindPopup(`Lokasi rumah makan ${destination.destTitle}`);
      resto.addTo(map);
      map.flyTo([destination.lat, destination.lng], 10);
    } else if (destination.destType === "hotel") {
      let hotel = L.marker([destination.lat, destination.lng], {
        icon: markerHotel(),
      });
      hotel.bindPopup(`Lokasi hotel ${destination.destTitle}`);
      hotel.addTo(map);
      map.flyTo([destination.lat, destination.lng], 10);
    }

    // create direction

    getCurrentLocation().then((currentCoords) => {
      L.marker([currentCoords.lat, currentCoords.lng]).addTo(map);

      let currentPos = `${currentCoords.lng},${currentCoords.lat}`;
      let targetDest = `${destination.lng},${destination.lat}`;

      getDirection(targetDest, currentPos).then((direction) => {
        L.geoJSON(direction.geoJsonPath, {
          style: {
            color: "#00d6a1",
            weight: 3,
            opacity: 1,
          },

          onEachFeature: (feature, layer) => {
            let popupOptions = { maxWidth: 200 };
            layer.bindPopup(
              `
                <span>Jarak : ${direction.distance.value} ${direction.distance.unit}</span>
                <br>
                <span>Waktu Tempuh : ${direction.duration.hour} jam ${direction.duration.minute} menit ${direction.duration.second} detik</span>
              `,
              popupOptions,
            );
          },
        }).addTo(map);
      });
    });

    // registering custom control to map
    zoomControl.addTo(map);
    toolbar.addTo(map);

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  });
</script>

<svelte:window on:resize={updateSize} />

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  />

  <title>home</title>
</svelte:head>

<div class="w-full">
  <div class="map h-screen" />
</div>
