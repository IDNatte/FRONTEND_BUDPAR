<script>
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import L from "leaflet";

  import { API } from "../../lib/config";

  import MapZoomControllComponent from "./MapZoomControllComponent.svelte";
  import MapControlComponent from "./MapToolbarComponent.svelte";

  import {
    markerHotel,
    markerResto,
    markerTour,
  } from "../../lib/module/map.marker";

  export let tours;
  export let hotel;
  export let resto;

  let map;

  async function fetchLocationCoords(id, endpoint) {
    let data = await fetch(`${API}/${endpoint}/${id}/show`);

    if (data.status === 200) {
      let detailData = await data.json();

      return detailData;
    } else {
      throw new Error("Cannot fetch data!");
    }
  }

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

      toolbarComponent.$on("map-filter", () => {
        console.log("show filter");
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
    for (let hotelIdx in hotel.objectIDList) {
      let hotelId = hotel.objectIDList[hotelIdx];
      fetchLocationCoords(hotelId, "hotel").then((data) => {
        L.marker(
          [data.data.hotel_detail.latitude, data.data.hotel_detail.longitude],
          {
            icon: markerHotel(),
          },
        )
          .bindPopup(`Hotel ${data.data.hotel_detail.name}`)
          .addTo(map);
      });
    }

    for (let restoIdx in resto.objectIDList) {
      let restoId = resto.objectIDList[restoIdx];
      fetchLocationCoords(restoId, "food").then((data) => {
        L.marker(
          [data.data.food_detail.latitude, data.data.food_detail.longitude],
          {
            icon: markerResto(),
          },
        )
          .bindPopup(`Restoran ${data.data.food_detail.name}`)
          .addTo(map);
      });
    }

    for (let toursIdx in tours.objectIDList) {
      let toursId = tours.objectIDList[toursIdx];
      fetchLocationCoords(toursId, "tourist-attraction").then((data) => {
        L.marker(
          [data.data.wisata_detail.latitude, data.data.wisata_detail.longitude],
          {
            icon: markerTour(),
          },
        )
          .bindPopup(`wisata ${data.data.wisata_detail.name}`)
          .addTo(map);
      });
    }

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
