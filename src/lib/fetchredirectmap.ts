import type { Handle } from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
//import { writable } from 'svelte/store';
import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { ISbResult } from '@storyblok/svelte';

//export const storyblokDatasourceEntries = writable<Map<string, string>>(new Map<string, string>());

const emptyResponse: ISbResult = { data: undefined, perPage: 0, total: 0, headers: new Headers() };

const DATASOURCE_PATH = 'redirectmap';
const STORYBLOK_API_KEY = 'ozHt8VvbARQxWitorMFb9gtt';

export async function getDatasourceData(
    path: string
): Promise<ISbResult> {
    const storyblokApi = await useStoryblokApi();
    const url = 'cdn/datasource_entries';

    return storyblokApi
        .get(url, { datasource: path})
        .then((response) => {
            return response;
        })
        .catch(() => {
            console.info('Error while fetching datasource data from storyblok');
            return emptyResponse;
        });
}

export async function initStoryblok(): Promise<void> {
    await storyblokInit({
        accessToken: STORYBLOK_API_KEY,
        use: [apiPlugin],
        apiOptions: {
            region: 'eu'
        }
    });
}

export async function isStoryblokAlreadyInit(): Promise<boolean> {
    const storyblokApi = await useStoryblokApi();
    return storyblokApi !== null;
}

export const load = async () : Promise<Map<string, string>> => {
    let mapOfEntries: Map<string, string> = new Map();
    await isStoryblokAlreadyInit().then((isInit) => {
        if (!isInit) {
            initStoryblok();
        }
    });

    // Get storyblok datasource entries and store them for global usage
    await getDatasourceData(
        DATASOURCE_PATH
    ).then((response) => {
        if (response.data?.datasource_entries) {
            mapOfEntries = new Map(
                response.data.datasource_entries.map((entry: { name: string; value: string }) => [
                    entry.name,
                    entry.value
                ])
            );
        }
    });
    return mapOfEntries;
};



export const redirectHandle: Handle = async ({event, resolve}) => {
    const entries = await load();    
    if( entries.get(event.url.pathname) ) {
        const redirectPath = entries.get(event.url.pathname);
        redirect(302, redirectPath || '/');
    }
    return await resolve(event);
}