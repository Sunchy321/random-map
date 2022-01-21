/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
import { computed, WritableComputedRef } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import { Buffer } from 'buffer';

import {
    Skip, Pool, Mode, Misc,
    skips, pools, modes, miscs,
} from 'src/randomizer/3.13/basic';

export type ConfigSetup = {
    skip: WritableComputedRef<Skip[]>;
    pool: WritableComputedRef<Pool[]>;
    mode: WritableComputedRef<Mode>;
    misc: WritableComputedRef<Misc[]>;
};

type Config = {
    skip: Skip[];
    pool: Pool[];
    mode: Mode;
    misc: Misc[];
};

function encode(config: Config): string {
    return Buffer.from(JSON.stringify(config)).toString('base64');
}

function decode(code: string): Config {
    const buffer = Buffer.from(code, 'base64');

    try {
        const data = JSON.parse(buffer.toString());

        return {
            skip: data.skip ?? [],
            pool: data.pool ?? [],
            misc: data.misc ?? [],
            mode: data.mode ?? 'item',
        };
    } catch (e) {
        return {
            skip: [],
            pool: [],
            misc: [],
            mode: 'item',
        };
    }
}

export default function data313Setup(): ConfigSetup {
    const router = useRouter();
    const route = useRoute();

    const config = computed({
        get(): Config {
            return decode(route.query.config as string ?? '{}');
        },
        set(newValue: Config) {
            router.replace({
                path:  route.path,
                query: { ...route.query, config: encode(newValue) },
            });
        },
    });

    const skip = computed({
        get(): Skip[] {
            const { skip } = config.value;

            if (skip.every(s => skips.includes(s))) {
                return skip;
            } else {
                return [];
            }
        },
        set(newValue: Skip[]) {
            if (newValue.every(s => skips.includes(s))) {
                config.value = {
                    ...config.value,
                    skip: newValue.sort((a, b) => skips.indexOf(a) - skips.indexOf(b)),
                };
            }
        },
    });

    const pool = computed({
        get(): Pool[] {
            const { pool } = config.value;

            if (pool.every(p => pools.includes(p))) {
                return pool;
            } else {
                return [];
            }
        },
        set(newValue: Pool[]) {
            if (newValue.every(p => pools.includes(p))) {
                config.value = {
                    ...config.value,
                    pool: newValue.sort((a, b) => pools.indexOf(a) - pools.indexOf(b)),
                };
            }
        },
    });

    const mode = computed({
        get(): Mode {
            const { mode } = config.value;

            if (modes.includes(mode)) {
                return mode;
            } else {
                return 'item';
            }
        },
        set(newValue: Mode) {
            if (modes.includes(newValue)) {
                config.value = {
                    ...config.value,
                    mode: newValue,
                };
            }
        },
    });

    const misc = computed({
        get(): Misc[] {
            const { misc } = config.value;

            if (misc.every(m => miscs.includes(m))) {
                return misc;
            } else {
                return [];
            }
        },
        set(newValue: Misc[]) {
            if (newValue.every(m => miscs.includes(m))) {
                config.value = {
                    ...config.value,
                    misc: newValue.sort((a, b) => miscs.indexOf(a) - miscs.indexOf(b)),
                };
            }
        },
    });

    return {
        skip,
        pool,
        mode,
        misc,
    };
}
