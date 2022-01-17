<template>
    <q-drawer bordered class="q-pa-md q-gutter-y-md">
        <q-select
            v-model="version" :options="versions"
            :label="$t('version')"
            outlined dense
        />

        <template v-if="version === '3.13'">
            <q-btn-group spread outline>
                <q-btn
                    v-for="(preset, name) in skipsPreset313" :key="name"
                    :label="$t(`version313.skipPreset.${name}`)"
                    @click="skips = preset"
                />
            </q-btn-group>

            <q-select
                v-model="skips" :options="skips313Options"
                :label="$t('skips')"
                multiple emit-value map-options
                outlined dense
            />

            <q-btn-group class="wrapable" outline>
                <q-btn
                    v-for="(preset, name) in itemsPreset313" :key="name"
                    :label="$t(`version313.itemPreset.${name}`)"
                    @click="items = preset"
                />
            </q-btn-group>

            <q-select
                v-model="items" :options="items313Options"
                :label="$t('items')"
                multiple emit-value map-options
                outlined dense
            />
        </template>
    </q-drawer>
</template>

<style lang="sass" scoped>

.wrapable
    flex-wrap: wrap

    justify-content: space-between

</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useI18n } from 'vue-i18n';

import optionsSetup from 'setup/options';

import {
    versions, skips313, skipsPreset313, items313, itemsPreset313,
} from 'src/options';

export default defineComponent({
    name: 'Drawer',
    setup() {
        const i18n = useI18n();

        const { version } = optionsSetup();

        const skips = ref<string[]>([]);
        const items = ref<string[]>([]);

        const skips313Options = skips313.map(s => ({
            label: i18n.t(`version313.skip.${s}`),
            value: s,
        }));

        const items313Options = items313.map(s => ({
            label: i18n.t(`version313.item.${s}`),
            value: s,
        }));

        return {
            versions,
            version,

            skips,
            skips313Options,
            skipsPreset313,

            items,
            items313Options,
            itemsPreset313,
        };
    },
});
</script>
