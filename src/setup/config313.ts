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

const skipByteLength = Math.ceil(skips.length / 8);
const poolByteLength = Math.ceil(pools.length / 8);
const miscByteLength = Math.ceil(miscs.length / 8);

function fromBits(bits: boolean[]): number {
    return Number.parseInt(
        bits.map(b => (b ? '1' : '0')).join('').padEnd(8, '0'),
        2,
    );
}

function toBits(num: number): boolean[] {
    return (num % 256)
        .toString(2)
        .padStart(8, '0')
        .split('')
        .map(v => v === '1');
}

function encode(config: Config): string {
    const numbers = [];

    for (let i = 0; i < skipByteLength; i += 1) {
        numbers.push(fromBits(skips.slice(i * 8, (i + 1) * 8).map(s => config.skip.includes(s))));
    }

    for (let i = 0; i < poolByteLength; i += 1) {
        numbers.push(fromBits(pools.slice(i * 8, (i + 1) * 8).map(p => config.pool.includes(p))));
    }

    for (let i = 0; i < miscByteLength; i += 1) {
        numbers.push(fromBits(miscs.slice(i * 8, (i + 1) * 8).map(m => config.misc.includes(m))));
    }

    numbers.push(modes.indexOf(config.mode));

    return Buffer.from(numbers).toString('base64');
}

function decode(code: string): Config {
    const buffer = Buffer.from(code, 'base64');

    if (buffer.length !== (skipByteLength + poolByteLength + miscByteLength + 1)) {
        return {
            skip: [],
            pool: [],
            misc: [],
            mode: 'item',
        };
    }

    const skipBits = buffer
        .slice(0, skipByteLength)
        .reduce((prev: boolean[], curr) => [...prev, ...toBits(curr)], []);

    const skip = skips.filter((_, i) => skipBits[i]);

    const poolBits = buffer
        .slice(skipByteLength, poolByteLength)
        .reduce((prev: boolean[], curr) => [...prev, ...toBits(curr)], []);

    const pool = pools.filter((_, i) => poolBits[i]);

    const miscBits = buffer
        .slice(skipByteLength + poolByteLength)
        .reduce((prev: boolean[], curr) => [...prev, ...toBits(curr)], []);

    const misc = miscs.filter((_, i) => miscBits[i]);

    const mode = modes[buffer[skipByteLength + poolByteLength + miscByteLength]];

    return {
        skip, pool, mode, misc,
    };
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
