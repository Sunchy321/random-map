import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { xml2js } from 'xml-js';

const locationsPath = './src/randomizer/3.13/locations.json';

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

for (const shop of shopsXml.randomizer.shop) {
    shops[shop._attributes.name] = {
        itemLogic: shop.itemLogic?._text,
        areaLogic: shop.areaLogic?._text,
        roomLogic: shop.roomLogic?._text,
    };
}

const data = [];

const locationsXml = readXml('items.xml');

for (const location of locationsXml.randomizer.item) {
    if (location.sceneName?._text == null) {
        continue;
    }

    const id = location._attributes.name.replace(/'/g, '_');

    const shopName = location.shopName?._text;

    const shop = shopName != null ? shops[shopName] : undefined;

    data.push({
        id:        idMap[id] ?? id,
        pool:      poolMap[location.pool?._text],
        scene:     location.sceneName?._text,
        itemLogic: location.itemLogic?._text ?? shop?.itemLogic,
        areaLogic: location.areaLogic?._text ?? shop?.areaLogic,
        roomLogic: location.roomLogic?._text ?? shop?.roomLogic,
    });
}

writeFileSync(locationsPath, JSON.stringify(data, null, 4));
