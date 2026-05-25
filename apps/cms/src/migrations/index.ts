import * as migration_20260525_151539_topbar_social_to_right_links from './20260525_151539_topbar_social_to_right_links';
import * as migration_20260525_152707_localization_ru_en from './20260525_152707_localization_ru_en';

export const migrations = [
  {
    up: migration_20260525_151539_topbar_social_to_right_links.up,
    down: migration_20260525_151539_topbar_social_to_right_links.down,
    name: '20260525_151539_topbar_social_to_right_links',
  },
  {
    up: migration_20260525_152707_localization_ru_en.up,
    down: migration_20260525_152707_localization_ru_en.down,
    name: '20260525_152707_localization_ru_en'
  },
];
