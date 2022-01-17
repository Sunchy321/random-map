<template>
    <q-page class="flex">
        <div id="map-container" />
    </q-page>
</template>

<style lang="sass" scoped>

#map-container
    flex: 0 0 100%
    align-self: stretch

    background-color: black

</style>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mapUrl = './map.png';

export default defineComponent({
    name: 'PageIndex',
    setup() {
        const map = ref<L.Map | null>(null);

        onMounted(() => {
            const leafMap = L.map('map-container', {
                crs:     L.CRS.Simple,
                minZoom: -5,
            });

            const overlayBounds = [[0, 0], [2901, 4498]] as L.LatLngBoundsLiteral;

            L.imageOverlay(mapUrl, overlayBounds).addTo(leafMap);

            leafMap.fitBounds(overlayBounds);

            map.value = leafMap;
        });
    },
});
</script>
