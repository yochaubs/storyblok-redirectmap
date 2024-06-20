import { Config } from '$lib/config';
import { StoryblokService } from '$lib/services/storyblokServices';
import type { ISbResult } from '@storyblok/svelte';

export const load = async (
  storyblokKey: string,
  datasourcePath: string,
): Promise<Map<string, string>> => {
  const config = new Config({ datasource_path: datasourcePath, api_key: storyblokKey });
  const storyblokService = new StoryblokService(config.getConfig().apiKey);

  let mapOfEntries: Map<string, string> = new Map();

  await storyblokService.initStoryblok();

  const response: ISbResult = await storyblokService.getDatasourceData(
    config.getConfig().datasource,
  );

  if (response.data?.datasource_entries) {
    mapOfEntries = new Map(
      response.data.datasource_entries.map((entry: { name: string; value: string }) => [
        entry.name,
        entry.value,
      ]),
    );
  }

  return mapOfEntries;
};

/** 
export const redirectHandle: Handle = async ({event, resolve}) => {
    const entries = await load(storyblokKey: string, datasourcePath: string);    
    if( entries.get(event.url.pathname) ) {
        const redirectPath = entries.get(event.url.pathname);
        redirect(301, redirectPath || '/');
    }
    return resolve(event);
} */
