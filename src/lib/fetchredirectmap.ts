import type { Handle } from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { ISbResult } from '@storyblok/svelte';

const emptyResponse: ISbResult = { data: undefined, perPage: 0, total: 0, headers: new Headers() };

export interface Configuration {
    datasource_path: string;
    api_key: string;
}

async function initStoryblok(storyblokKey: string): Promise<void> {
    await storyblokInit({
        accessToken: storyblokKey,
        use: [apiPlugin],
        apiOptions: {
            region: 'eu'
        }
    });
}

async function isStoryblokAlreadyInit(): Promise<boolean> {
    const storyblokApi = await useStoryblokApi();
    return storyblokApi !== null;
}

export class Config {
    private datasource_path: string;
    private api_key: string;
    constructor(private configuration: Configuration) {
        this.datasource_path = configuration.datasource_path || 'https://default-api.com';
        this.api_key = configuration.api_key || 'default-api-key';
    }


    getConfig() {
        return {
            datasource: this.datasource_path,
            apiKey: this.api_key,
        };
    }
    

}

async function getDatasourceData(
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



export const load = async (storyblokKey: string, datasourcePath: string ) : Promise<Map<string, string>> => {
    let mapOfEntries: Map<string, string> = new Map();
    await isStoryblokAlreadyInit().then((isInit) => {
        if (!isInit) {
            initStoryblok(storyblokKey);
        }
    });

    // Get storyblok datasource entries and store them for global usage
    await getDatasourceData(
        datasourcePath
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


/** 
export const redirectHandle: Handle = async ({event, resolve}) => {
    const entries = await load(storyblokKey: string, datasourcePath: string);    
    if( entries.get(event.url.pathname) ) {
        const redirectPath = entries.get(event.url.pathname);
        redirect(301, redirectPath || '/');
    }
    return resolve(event);
} */