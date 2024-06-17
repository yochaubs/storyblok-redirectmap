import { apiPlugin, storyblokInit, useStoryblokApi } from '@storyblok/svelte';
import type { ISbResult } from '@storyblok/svelte';

const emptyResponse: ISbResult = { data: undefined, perPage: 0, total: 0, headers: new Headers() };

export class StoryblokService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async initStoryblok(): Promise<void> {
        const isInit = await this.isStoryblokAlreadyInit();
        if (!isInit) {
            await storyblokInit({
                accessToken: this.apiKey,
                use: [apiPlugin],
                apiOptions: {
                    region: 'eu'
                }
            });
        }
    }

    private async isStoryblokAlreadyInit(): Promise<boolean> {
        const storyblokApi = await useStoryblokApi();
        return storyblokApi !== null;
    }

    async getDatasourceData(path: string): Promise<ISbResult> {
        const storyblokApi = await useStoryblokApi();
        const url = 'cdn/datasource_entries';
        
        return storyblokApi
            .get(url, { datasource: path })
            .then((response) => {
                return response;
            })
            .catch(() => {
                console.info('Error while fetching datasource data from Storyblok');
                return emptyResponse;
            });
    }
}