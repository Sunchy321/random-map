import { computed, WritableComputedRef } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import versions from 'data/versions.json';

import config313Setup, { ConfigSetup as ConfigSetup313 } from './config313';

type ConfigSetup = {
    version: WritableComputedRef<string>;
    config313: ConfigSetup313;
};

export default function configSetup(): ConfigSetup {
    const router = useRouter();
    const route = useRoute();

    const version = computed({
        get(): string {
            if (versions.includes(route.query.version as string)) {
                return route.query.version as string;
            } else {
                return versions[0];
            }
        },
        set(newValue: string) {
            if (versions.includes(newValue)) {
                router.replace({
                    path:  route.path,
                    query: { ...route.query, version: newValue },
                });
            }
        },
    });

    return {
        version,
        config313: config313Setup(),
    };
}
