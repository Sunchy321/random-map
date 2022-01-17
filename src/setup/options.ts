import { computed, WritableComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { versions } from '../options';

export default function optionsSetup(): {
    version: WritableComputedRef<string>;
} {
    const router = useRouter();
    const route = useRoute();

    const version = computed({
        get(): string {
            return (route.query.version as string) ?? versions[0];
        },
        set(newValue: string) {
            if (versions.includes(newValue)) {
                router.replace({
                    path:  route.path,
                    query: {
                        ...route.query,
                        version: newValue,
                    },
                });
            }
        },
    });

    return {
        version,
    };
}
