<template>
    <q-page class="flex">
        <div id="map-container" />
    </q-page>
</template>

<style lang="sass">

#map-container
    flex: 0 0 100%
    align-self: stretch

    background-color: black

.map-marker
    border-radius: 100px
    border-width: 1px
    border-color: white

    &, &.unknown, &.mixed
        background-color: gray

    &.dreamer, &.mask_shard, &.vessel_fragment, &.charm_notch, &.pale_ore
        background-color: white

    &.skill, &.focus
        background-color: yellow

    &.charm
        background-color: #5CCED6

    &.key
        background-color: #BF15A3

    &.grub, &.mimic
        background-color: #9DC380

    &.geo_chest
        background-color: #E1E1E1

    &.rancid_egg
        background-color: #A97A2F

    &.relic
        background-color: #DEA302

    &.whispering_root
        background-color: #CE5CD6

    &.boss_essence
        background-color: red

    &.map, &.stag, &.journal
        background-color: #4B6170

    &.lifeblood_cocoon
        background-color: #56FAFA

    &.grimmkin_flame
        background-color: #F74557

</style>

<script lang="ts">
import {
    computed, defineComponent, onMounted, watch,
} from 'vue';

import { useI18n } from 'vue-i18n';

import configSetup from 'src/setup/config';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { parseLogic, printLogic } from 'data/logic';
import { evalLogic as evalLogic313 } from 'data/3.13/logic';

import markers from 'data/marker.json';
import data313 from 'src/randomizer/3.13/locations.json';

const mapUrl = './map.png';

function locationActivated313(location: typeof data313[0], pools: string[]): boolean {
    if (!pools.includes(location.pool)) {
        return false;
    }

    if (['Focus', 'World_Sense'].includes(location.id) && pools.includes('lore_tablet')) {
        return false;
    }

    if (['Journal_Entry-Seal_of_Binding'].includes(location.id) && !pools.includes('palace')) {
        return false;
    }

    return true;
}

export default defineComponent({
    name: 'PageIndex',
    setup() {
        const i18n = useI18n();

        const {
            version,
            config313: {
                pool: pool313,
                skip: skip313,
                misc: misc313,
                mode: mode313,
            },
        } = configSetup();

        const realPool313 = computed(() => {
            const result = pool313.value.slice() as string[];

            if (misc313.value.includes('random_focus')) {
                result.push('focus');
            }

            if (misc313.value.includes('mimic')) {
                result.push('mimic');
            }

            return result;
        });

        const markLayer = new L.LayerGroup();

        onMounted(async () => {
            const leafMap = L.map('map-container', {
                crs:     L.CRS.Simple,
                zoom:    0,
                minZoom: -4,
                maxZoom: 2,
            });

            const overlayBounds = [[0, 0], [2901, 4498]] as L.LatLngBoundsLiteral;

            L.imageOverlay(mapUrl, overlayBounds).addTo(leafMap);

            leafMap.fitBounds(overlayBounds);

            markLayer.addTo(leafMap);

            function renderMarker() {
                const zoom = leafMap.getZoom();

                const iconSize = (() => {
                    switch (zoom) {
                    case -4:
                    case -3:
                        return 6;
                    case -2:
                    case -1:
                        return 8;
                    case 0:
                    case 1:
                    case 2:
                        return 12;
                    default:
                        return 0;
                    }
                })();

                markLayer.clearLayers();

                const groupedMarkers = [];

                for (const marker of markers) {
                    const data = data313.find(v => v.id === marker.id);

                    if (data == null) {
                        continue;
                    }

                    if (version.value === '3.13') {
                        if (!locationActivated313(data, realPool313.value)) {
                            continue;
                        }
                    }

                    const group = groupedMarkers.find(
                        m => m.coord[0] === marker.coord[0] && m.coord[1] === marker.coord[1],
                    );

                    const dataLogic = data[`${mode313.value}Logic`];

                    if (group != null) {
                        if (dataLogic !== group.logic) {
                            console.error(`Logic mismatch:\n${data.id} = ${dataLogic}\n${group.id.join(',')} = ${group.logic}`);
                        }

                        group.id.push(marker.id);

                        if (group.pool !== data.pool) {
                            group.pool = 'mixed';
                        }
                    } else {
                        groupedMarkers.push({
                            id:    [marker.id],
                            pool:  data.pool,
                            coord: marker.coord,
                            logic: dataLogic,
                        });
                    }
                }

                for (const marker of groupedMarkers) {
                    let popupContent = marker.id.map(id => i18n.t(`locations.${id}`)).join(',');

                    if (marker.logic != null) {
                        const parsedLogic = parseLogic(marker.logic);

                        const evaluatedLogic = evalLogic313(parsedLogic, skip313.value, misc313.value);

                        popupContent += `<hr>${
                            printLogic(evaluatedLogic, {
                                isTopLevel: true,
                                transform:  text => {
                                    if (/^.*\[.*\]$/.test(text)) {
                                        return text;
                                    } else {
                                        return i18n.t(`version313.term.${text.replace(/'/g, '_')}`);
                                    }
                                },
                            })
                        }`;
                    }

                    const popup = L.popup()
                        .setContent(`<div>${popupContent.replace(/\n/g, '<br>')}</div>`);

                    L.marker(marker.coord as L.LatLngExpression, {
                        icon: L.divIcon({
                            className: `map-marker ${marker.pool}`,
                            iconSize:  [iconSize, iconSize],
                        }),
                    })
                        .bindPopup(popup)
                        .addTo(markLayer);
                }
            }

            renderMarker();

            watch([version, realPool313], renderMarker);

            leafMap.on('zoomend', renderMarker);

            leafMap.on('click', (e: L.LeafletMouseEvent) => {
                const coord = e.latlng;
                const { lat } = coord;
                const { lng } = coord;
                console.log(`You clicked the map at latitude: ${lat} and longitude: ${lng}`);
            });
        });
    },
});
</script>
