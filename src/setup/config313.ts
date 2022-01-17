/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
import { computed, WritableComputedRef } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import { Buffer } from 'buffer';

import basic from 'data/3.13/basic.json';

export type ConfigSetup = {
    skip: WritableComputedRef<string[]>;
    pool: WritableComputedRef<string[]>;
    mode: WritableComputedRef<string>;
    misc: WritableComputedRef<string[]>;
};

type Config = {
    skip: string[];
    pool: string[];
    mode: string;
    misc: string[];
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
        get(): string[] {
            const { skip } = config.value;

            if (skip.every(s => basic.skips.includes(s))) {
                return skip;
            } else {
                return [];
            }
        },
        set(newValue: string[]) {
            if (newValue.every(s => basic.skips.includes(s))) {
                config.value = {
                    ...config.value,
                    skip: newValue,
                };
            }
        },
    });

    const pool = computed({
        get(): string[] {
            const { pool } = config.value;

            if (pool.every(p => basic.pools.includes(p))) {
                return pool;
            } else {
                return [];
            }
        },
        set(newValue: string[]) {
            if (newValue.every(p => basic.pools.includes(p))) {
                config.value = {
                    ...config.value,
                    pool: newValue,
                };
            }
        },
    });

    const mode = computed({
        get(): string {
            const { mode } = config.value;

            if (basic.modes.includes(mode)) {
                return mode;
            } else {
                return 'item';
            }
        },
        set(newValue: string) {
            if (basic.modes.includes(newValue)) {
                config.value = {
                    ...config.value,
                    mode: newValue,
                };
            }
        },
    });

    const misc = computed({
        get(): string[] {
            const { misc } = config.value;

            if (misc.every(m => basic.miscs.includes(m))) {
                return misc;
            } else {
                return [];
            }
        },
        set(newValue: string[]) {
            if (newValue.every(m => basic.miscs.includes(m))) {
                config.value = {
                    ...config.value,
                    misc: newValue,
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
