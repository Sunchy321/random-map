<template>
    <q-layout view="hHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title>{{ $t('title') }}</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <router-view v-model="leftDrawerOpen" name="drawer" />

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MainLayout',

    setup() {
        const leftDrawerOpen = ref(false);

        const toggleLeftDrawer = () => {
            leftDrawerOpen.value = !leftDrawerOpen.value;
        };

        return {
            leftDrawerOpen,
            toggleLeftDrawer,
        };
    },
});
</script>
