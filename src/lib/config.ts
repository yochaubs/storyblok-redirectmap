export interface Configuration {
    datasource_path: string;
    api_key: string;
}

export class Config {
    private datasource_path: string;
    private api_key: string;

    constructor(configuration: Configuration) {
        this.datasource_path = configuration.datasource_path || 'redirectmap';
        this.api_key = configuration.api_key || 'default-api-key';
    }

    getConfig() {
        return {
            datasource: this.datasource_path,
            apiKey: this.api_key,
        };
    }
}