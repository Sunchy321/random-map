import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { xml2js } from 'xml-js';

const outputPath = './public/items/data-313.json';

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
    Essence_Boss:       '',
    Fake:               '',
    Flame:              'grimmkin_flame',
    Focus:              '',
    Geo:                '',
    Grub:               'grub',
    GrubItem:           '',
    Journal:            'journal',
    JunkPitChest:       'junk_pit',
    Key:                'key',
    Map:                'map',
    Mask:               'mask_shard',
    Mimic:              '',
    MimicItem:          '',
    Notch:              '',
    Ore:                'pale_ore',
    PalaceJournal:      '',
    Relic:              '',
    Root:               'whisper_root',
    Skill:              '',
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
        id:        item._attributes.name,
        pool:      poolMap[item.pool?._text],
        scene:     item.sceneName?._text,
        itemLogic: item.itemLogic?._text,
        areaLogic: item.areaLogic?._text,
        roomLogic: item.roomLogic?._text,
    });
}

writeFileSync(outputPath, JSON.stringify(data, null, 4));
