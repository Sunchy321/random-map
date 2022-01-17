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
                    v-for="(preset, name) in skipPreset313" :key="name"
                    :label="$t(`version313.skipPreset.${name}`)"
                    @click="skip313 = preset"
                />
            </q-btn-group>

            <q-select
                v-model="skip313" :options="skipOptions313"
                :label="$t('skips')"
                multiple emit-value map-options
                use-chips outlined dense
            >
                <template #option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label> {{ opt.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-btn-group class="wrapable" outline>
                <q-btn
                    v-for="(preset, name) in poolPreset313" :key="name"
                    :label="$t(`version313.poolPreset.${name}`)"
                    @click="pool313 = preset"
                />
            </q-btn-group>

            <q-select
                v-model="pool313" :options="poolOptions313"
                :label="$t('pools')"
                multiple emit-value map-options
                use-chips outlined dense
            >
                <template #option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label> {{ opt.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                v-model="misc313" :options="miscOptions313"
                :label="$t('misc')"
                multiple emit-value map-options
                use-chips outlined dense
            >
                <template #option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label> {{ opt.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

            <q-select
                v-model="mode313" :options="modeOptions313"
                :label="$t('mode')"
                emit-value map-options
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
import { defineComponent } from 'vue';

import { useI18n } from 'vue-i18n';

import dataSetup from 'src/setup/config';

import versions from 'data/versions.json';
import basic313 from 'data/3.13/basic.json';

export default defineComponent({
    name: 'Drawer',
    setup() {
        const i18n = useI18n();

        const {
            version,
            config313: {
                skip: skip313,
                pool:pool313,
                mode:mode313,
                misc:misc313,
            },
        } = dataSetup();

        const skipOptions313 = basic313.skips.map(s => ({
            label: i18n.t(`version313.skip.${s}`),
            value: s,
        }));

        const poolOptions313 = basic313.pools.map(s => ({
            label: i18n.t(`version313.pool.${s}`),
            value: s,
        }));

        const modeOptions313 = basic313.modes.map(s => ({
            label: i18n.t(`version313.mode.${s}`),
            value: s,
        }));

        const miscOptions313 = basic313.miscs.map(s => ({
            label: i18n.t(`version313.misc.${s}`),
            value: s,
        }));

        return {
            versions,
            version,

            skip313,
            skipOptions313,
            skipPreset313: basic313.skipsPreset,

            pool313,
            poolOptions313,
            poolPreset313: basic313.poolPreset,

            mode313,
            modeOptions313,

            misc313,
            miscOptions313,
        };
    },
});
</script>
