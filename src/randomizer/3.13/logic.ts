import {
    EvaluatedLogic, and, or, term,
} from '../logic';

import { Skip, Misc } from './basic';

const macroMap: Record<string, (options: {
    skips: Skip[];
    miscs: Misc[];
}) => EvaluatedLogic | null> = {
    'LEFTSLASH':  ({ miscs }) => term('LEFTSLASH', miscs.includes('cursed_nail') ? undefined : true),
    'RIGHTSLASH': ({ miscs }) => term('RIGHTSLASH', miscs.includes('cursed_nail') ? undefined : true),
    'SIDESLASH':  ({ miscs }) => or(['LEFTSLASH', 'RIGHTSLASH'], miscs.includes('cursed_nail') ? true : undefined),
    'UPSLASH':    ({ miscs }) => term('UPSLASH', miscs.includes('cursed_nail') ? undefined : true),
    'FOCUS':      ({ miscs }) => term('FOCUS', miscs.includes('random_focus') ? undefined : true),

    '2MASKS': ({ miscs }) => term('2MASKS', miscs.includes('curse') ? undefined : true),
    '4MASKS': ({ miscs }) => term('4MASKS', miscs.includes('curse') ? undefined : true),

    '2NOTCHES': ({ miscs }) => term('2NOTCHES', miscs.includes('cursed_notch') ? undefined : true),

    'MILDSKIPS':        ({ skips }) => term('MILDSKIPS', skips.includes('mild')),
    'SHADESKIPS':       ({ skips }) => term('SHADESKIPS', skips.includes('shade')),
    'ACIDSKIPS':        ({ skips }) => term('ACIDSKIPS', skips.includes('acid')),
    'LEFTSKIPACID':     ({ skips }) => term('LEFTSKIPACID', skips.includes('acid') ? undefined : false),
    'RIGHTSKIPACID':    ({ skips }) => term('RIGHTSKIPACID', skips.includes('acid') ? undefined : false),
    'FIREBALLSKIPS':    ({ skips }) => term('FIREBALLSKIPS', skips.includes('fireball')),
    'AIRSTALL':         ({ skips }) => term('AIRSTALL', skips.includes('fireball') ? undefined : false),
    'SPIKETUNNELS':     ({ skips }) => term('SPIKETUNNELS', skips.includes('tunnel')),
    'LEFTTUNNEL':       ({ skips }) => term('LEFTTUNNEL', skips.includes('tunnel') ? undefined : false),
    'RIGHTTUNNEL':      ({ skips }) => term('RIGHTTUNNEL', skips.includes('tunnel') ? undefined : false),
    'DARKROOMS':        ({ skips }) => term('DARKROOMS', skips.includes('dark')),
    'SPICYSKIPS':       ({ skips }) => term('SPICYSKIPS', skips.includes('spicy')),
    'SPICYCOMBATSKIPS': ({ skips }) => term('SPICYCOMBATSKIPS', skips.includes('spicy')),

    'CYCLONE': () => term('Cyclone_Slash'),
};

export function evalLogic(logic: EvaluatedLogic, skips: Skip[], miscs: Misc[]): EvaluatedLogic {
    if (logic.value != null) {
        return logic;
    }

    if (logic.type === 'term') {
        const macro = macroMap[logic.expr];

        if (macro != null) {
            return macro({ skips, miscs }) ?? logic;
        } else {
            return logic;
        }
    } else {
        const evaluated = logic.expr.map(l => evalLogic(l, skips, miscs));

        if (logic.type === 'and') {
            return and(evaluated);
        } else {
            return or(evaluated);
        }
    }
}
