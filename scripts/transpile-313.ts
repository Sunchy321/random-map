import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { xml2js } from 'xml-js';

const itemsPath = './src/randomizer/3.13/items.json';

const projectPath = process.argv[2];
const resourcePath = join(projectPath, 'RandomizerMod3.0', 'Resources');

function readXml(filename: string): any {
    return xml2js(readFileSync(join(resourcePath, filename)).toString(), { compact: true }) as any;
}

const idMap: Record<string, string> = {
    'Deepnest_Map-Right_[Gives_Quill]': 'Deepnest_Map-Right',
};

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

const shops: Record<string, any> = { };

const shopsXml = readXml('shops.xml');

for (const item of shopsXml.randomizer.shop) {
    shops[item._attributes.name] = {
        itemLogic: item.itemLogic?._text,
        areaLogic: item.areaLogic?._text,
        roomLogic: item.roomLogic?._text,
    };
}

const data = [];

const itemsXml = readXml('items.xml');

for (const item of itemsXml.randomizer.item) {
    if (item.sceneName?._text == null) {
        continue;
    }

    const id = item._attributes.name.replace(/'/g, '_');

    const shopName = item.shopName?._text;

    const shop = shopName != null ? shops[shopName] : undefined;

    data.push({
        id:        idMap[id] ?? id,
        pool:      poolMap[item.pool?._text],
        scene:     item.sceneName?._text,
        itemLogic: item.itemLogic?._text ?? shop?.itemLogic,
        areaLogic: item.areaLogic?._text ?? shop?.areaLogic,
        roomLogic: item.roomLogic?._text ?? shop?.roomLogic,
    });
}

writeFileSync(itemsPath, JSON.stringify(data, null, 4));
