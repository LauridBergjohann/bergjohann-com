import type { Locale } from '$lib/i18n/locale';
import type { Messages } from '$lib/i18n/messages';
import type { NavigationEntry } from './navigation-api';
export type SiteDto = { locale: Locale; messages: Messages; navigation: NavigationEntry[] };
