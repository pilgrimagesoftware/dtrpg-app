// data.js — Folio sample RPG library catalog.
// Real product metadata used as catalog data (like album/book titles in a library).
// Exposed on window for the (non-module) babel scripts to read.

const NOW = new Date('2026-06-23T12:00:00');

// [title, publisher, line, kind, format, pages, sizeMB, year, daysAgo, status, color, desc]
const RAW = [
  // Wizards of the Coast — D&D 5e
  ["Player's Handbook", "Wizards of the Coast", "Dungeons & Dragons 5e", "Core", "PDF", 320, 96, 2014, 412, "downloaded", "#1C2A44", "Core rules for players: species, classes, spells, equipment."],
  ["Dungeon Master's Guide", "Wizards of the Coast", "Dungeons & Dragons 5e", "Core", "PDF", 320, 88, 2014, 410, "downloaded", "#6B2230", "Tools and guidance for building and running campaigns."],
  ["Monster Manual", "Wizards of the Coast", "Dungeons & Dragons 5e", "Bestiary", "PDF", 352, 104, 2014, 408, "downloaded", "#20402F", "Hundreds of monsters with lore, stats, and tactics."],
  ["Curse of Strahd", "Wizards of the Coast", "Dungeons & Dragons 5e", "Adventure", "PDF", 256, 72, 2016, 220, "downloaded", "#34234A", "Gothic horror campaign in the cursed land of Barovia."],
  ["Xanathar's Guide to Everything", "Wizards of the Coast", "Dungeons & Dragons 5e", "Supplement", "PDF", 192, 58, 2017, 96, "cloud", "#15403F", "New subclasses, spells, and rules for players and DMs."],
  ["Tasha's Cauldron of Everything", "Wizards of the Coast", "Dungeons & Dragons 5e", "Supplement", "PDF + EPUB", 192, 61, 2020, 41, "cloud", "#45264A", "Customizable origins, subclasses, feats, and group patrons."],

  // Paizo — Pathfinder 2e
  ["Pathfinder Player Core", "Paizo", "Pathfinder 2e", "Core", "PDF", 464, 132, 2023, 188, "downloaded", "#7E2230", "Everything to build and play a Pathfinder character."],
  ["Pathfinder GM Core", "Paizo", "Pathfinder 2e", "Core", "PDF", 336, 98, 2023, 180, "downloaded", "#2E3A45", "Rules and advice for running the game as GM."],
  ["Pathfinder Monster Core", "Paizo", "Pathfinder 2e", "Bestiary", "PDF", 360, 118, 2024, 64, "cloud", "#1B3A33", "Over four hundred monsters for any encounter."],
  ["Abomination Vaults", "Paizo", "Pathfinder 2e", "Adventure", "PDF", 256, 79, 2021, 150, "downloaded", "#232529", "A three-part dungeon delve into a sunken stronghold."],

  // Free League
  ["Mörk Borg", "Free League", "Mörk Borg", "Core", "PDF", 96, 44, 2020, 73, "downloaded", "#C9A02C", "Doom-metal art-punk dungeon crawler; the world is ending."],
  ["The One Ring", "Free League", "Middle-earth", "Core", "PDF", 240, 86, 2022, 132, "downloaded", "#8A5A1E", "Adventure in the lands and ages of Tolkien's Middle-earth."],
  ["Alien: The Roleplaying Game", "Free League", "Alien RPG", "Core", "PDF", 392, 124, 2019, 210, "downloaded", "#182338", "Sci-fi horror and survival in the corporate frontier."],
  ["Tales from the Loop", "Free League", "Tales from the Loop", "Core", "PDF", 192, 64, 2017, 305, "cloud", "#16494E", "Kids solving mysteries in an alternate '80s of machines."],
  ["Vaesen", "Free League", "Vaesen", "Core", "PDF", 192, 70, 2020, 118, "downloaded", "#1B3A33", "Nordic folk horror; hunt the creatures of myth."],
  ["Forbidden Lands", "Free League", "Forbidden Lands", "Core", "PDF", 232, 81, 2018, 240, "cloud", "#7C3A24", "Open-world survival sandbox of raiders and explorers."],
  ["Blade Runner: The Roleplaying Game", "Free League", "Blade Runner", "Core", "PDF + EPUB", 280, 99, 2022, 88, "downloaded", "#2A2750", "Neo-noir replicant detective work in 2037 Los Angeles."],
  ["Twilight: 2000", "Free League", "Twilight: 2000", "Core", "PDF", 232, 77, 2021, 162, "cloud", "#46491F", "Open-world survival in the aftermath of a European war."],

  // Chaosium
  ["Call of Cthulhu: Keeper Rulebook", "Chaosium", "Call of Cthulhu 7e", "Core", "PDF", 448, 128, 2014, 360, "downloaded", "#20402F", "Investigative cosmic horror in the Lovecraftian tradition."],
  ["Pulp Cthulhu", "Chaosium", "Call of Cthulhu 7e", "Supplement", "PDF", 280, 92, 2016, 190, "cloud", "#7A2E3A", "Two-fisted action heroics against the Mythos."],
  ["RuneQuest: Roleplaying in Glorantha", "Chaosium", "RuneQuest", "Core", "PDF", 448, 140, 2018, 215, "downloaded", "#7C3A24", "Bronze-age myth and magic in the world of Glorantha."],
  ["Masks of Nyarlathotep", "Chaosium", "Call of Cthulhu 7e", "Adventure", "PDF", 656, 188, 2018, 134, "downloaded", "#232529", "Globe-spanning campaign to stop an apocalyptic cult."],

  // Modiphius
  ["Dune: Adventures in the Imperium", "Modiphius", "Dune", "Core", "PDF", 336, 110, 2021, 158, "downloaded", "#8A5A1E", "Houses, intrigue, and survival on the desert planet."],
  ["Star Trek Adventures", "Modiphius", "Star Trek", "Core", "PDF", 368, 116, 2017, 300, "cloud", "#1C2A44", "Explore strange new worlds in the final frontier."],
  ["Conan: Adventures in an Age Undreamed Of", "Modiphius", "Conan", "Core", "PDF", 368, 121, 2017, 276, "cloud", "#7C3A24", "Sword-and-sorcery across the Hyborian Age."],
  ["Achtung! Cthulhu", "Modiphius", "Achtung! Cthulhu", "Core", "PDF", 360, 113, 2021, 144, "downloaded", "#2E3A45", "Secret-war pulp horror against occult Nazi forces."],

  // R. Talsorian
  ["Cyberpunk RED", "R. Talsorian Games", "Cyberpunk", "Core", "PDF", 456, 134, 2020, 126, "downloaded", "#7E2230", "Style over substance in the dark future of Night City."],

  // Monte Cook Games
  ["Numenera Discovery", "Monte Cook Games", "Numenera", "Core", "PDF", 416, 122, 2018, 232, "cloud", "#15403F", "Science-fantasy a billion years in Earth's future."],
  ["Cypher System Rulebook", "Monte Cook Games", "Cypher System", "Core", "PDF", 416, 119, 2019, 198, "downloaded", "#2A2750", "The flexible engine behind Numenera, for any genre."],
  ["Invisible Sun", "Monte Cook Games", "Invisible Sun", "Setting", "PDF", 240, 84, 2018, 250, "cloud", "#45264A", "Surreal magic and hidden worlds for dedicated tables."],

  // Pelgrane Press
  ["13th Age", "Pelgrane Press", "13th Age", "Core", "PDF", 320, 95, 2013, 340, "downloaded", "#7A2E3A", "d20 fantasy built around your character's unique edge."],
  ["Trail of Cthulhu", "Pelgrane Press", "GUMSHOE", "Core", "PDF", 240, 71, 2008, 355, "cloud", "#232529", "Clue-driven 1930s investigative horror."],
  ["Night's Black Agents", "Pelgrane Press", "GUMSHOE", "Core", "PDF", 232, 73, 2012, 168, "downloaded", "#182338", "Burned spies versus a vampyric conspiracy."],

  // Renegade
  ["Vampire: The Masquerade 5th Ed.", "Renegade Game Studios", "World of Darkness", "Core", "PDF", 416, 130, 2018, 102, "downloaded", "#6B2230", "Personal horror and intrigue among the undead."],

  // Onyx Path
  ["Scion: Origin", "Onyx Path", "Scion", "Core", "PDF", 240, 82, 2019, 222, "cloud", "#8A5A1E", "Mortal children of the gods in the modern world."],
  ["Chronicles of Darkness", "Onyx Path", "World of Darkness", "Core", "PDF", 320, 97, 2015, 260, "cloud", "#232529", "A modern world of secret horrors lurking beneath."],

  // Goodman Games
  ["Dungeon Crawl Classics", "Goodman Games", "DCC RPG", "Core", "PDF", 488, 142, 2012, 175, "downloaded", "#8A5A1E", "Old-school sword-and-sorcery with deadly funnels."],
  ["Mutant Crawl Classics", "Goodman Games", "MCC RPG", "Core", "PDF", 320, 101, 2017, 192, "cloud", "#46491F", "Post-apocalyptic gonzo science-fantasy crawling."],

  // Kobold Press
  ["Tome of Beasts", "Kobold Press", "Dungeons & Dragons 5e", "Bestiary", "PDF", 432, 126, 2016, 138, "downloaded", "#1B3A33", "More than four hundred new monsters for 5e."],
  ["Tales of the Valiant", "Kobold Press", "Tales of the Valiant", "Core", "PDF", 360, 108, 2024, 58, "cloud", "#1C2A44", "A standalone evolution of the 5e ruleset."],

  // Cubicle 7
  ["Warhammer Fantasy Roleplay", "Cubicle 7", "WFRP 4e", "Core", "PDF", 368, 117, 2018, 205, "downloaded", "#7A2E3A", "Grim, perilous adventure in the Old World."],
  ["Wrath & Glory", "Cubicle 7", "Warhammer 40,000", "Core", "PDF", 456, 138, 2020, 120, "cloud", "#2E3A45", "Heroic action in the grim darkness of the far future."],

  // Magpie Games
  ["Avatar Legends", "Magpie Games", "Avatar", "Core", "PDF", 320, 99, 2022, 110, "downloaded", "#15403F", "Bend the elements and grow as a balanced hero."],
  ["Masks: A New Generation", "Magpie Games", "Powered by the Apocalypse", "Core", "PDF", 224, 68, 2016, 248, "cloud", "#2A2750", "Teen superheroes finding out who they really are."],

  // Evil Hat
  ["Blades in the Dark", "Evil Hat", "Forged in the Dark", "Core", "PDF", 336, 94, 2017, 84, "downloaded", "#232529", "Daring scoundrels building a crew in a haunted city."],
  ["Fate Core System", "Evil Hat", "Fate", "Core", "PDF", 302, 89, 2013, 330, "cloud", "#34234A", "A flexible, narrative engine for any setting."],
];

const CATALOG = RAW.map((r, i) => {
  const [title, publisher, line, kind, format, pages, sizeMB, year, daysAgo, status, color, desc] = r;
  const added = new Date(NOW.getTime() - daysAgo * 86400000);
  return {
    id: 'b' + (i + 1),
    title, publisher, line, kind, format, pages, sizeMB, year,
    status, color, desc,
    added, addedTs: added.getTime(),
  };
});

// Publishers with counts, sorted by count desc then name.
const PUBLISHERS = Object.values(
  CATALOG.reduce((acc, b) => {
    (acc[b.publisher] ||= { name: b.publisher, count: 0 }).count++;
    return acc;
  }, {})
).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

Object.assign(window, { CATALOG, PUBLISHERS });
