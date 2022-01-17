import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { xml2js } from 'xml-js';

const itemsPath = './src/data/3.13/items.json';

const projectPath = process.argv[2];
const resourcePath = join(projectPath, 'RandomizerMod3.0', 'Resources');

const poolMap: Record<string, string> = {
    Charm:              'charm',
    Cocoon:             'lifeblood_cocoon',
    CursedMask:         '',
    CursedNail:         '',
    CursedNotch:        '',
    Dreamer:            'dreamer',
    Egg:                'rancid_egg',
    EggShopItem:        '',
    EggShopLocation:    '',
    ElevatorPass:       '',
    Essence_Boss:       'boss_essence',
    Fake:               '',
    Flame:              'grimmkin_flame',
    Focus:              'focus',
    Geo:                'geo_chest',
    Grub:               'grub',
    GrubItem:           '',
    Journal:            'journal',
    JunkPitChest:       'junk_pit',
    Key:                'key',
    Map:                'map',
    Mask:               'mask_shard',
    Mimic:              'mimic',
    MimicItem:          '',
    Notch:              'charm_notch',
    Ore:                'pale_ore',
    PalaceJournal:      'journal',
    Relic:              'relic',
    Root:               'whisper_root',
    Skill:              'skill',
    SplitClaw:          '',
    SplitCloak:         '',
    SplitCloakLocation: '',
    Stag:               'stag',
    Vessel:             'vessel_fragment',
};

const data = [];

const itemsText = readFileSync(join(resourcePath, 'items.xml')).toString();

const itemsXml = xml2js(itemsText, { compact: true }) as any;

for (const item of itemsXml.randomizer.item) {
    if (item.sceneName?._text == null) {
        continue;
    }

    data.push({
        id:        item._attributes.name.replace(/'/g, '_'),
        pool:      poolMap[item.pool?._text],
        scene:     item.sceneName?._text,
        itemLogic: item.itemLogic?._text,
        areaLogic: item.areaLogic?._text,
        roomLogic: item.roomLogic?._text,
    });
}

writeFileSync(itemsPath, JSON.stringify(data, null, 4));
