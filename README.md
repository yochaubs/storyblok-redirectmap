## Give control to SEO to maintain rewrite rules

# Why to use Redirect map
SEO team need to install and maintain the rewrite rules for campaigns or during site migration.

Most of the time, they need to request system administrator to install/modify the rewrite rules. 

SEO or content editors can maintain the rewrite rules ( source as key and destination as value ) in DATASOURCE in storyblok.



# How to use Redirect map

Developers can redirect the request in [Hooks](https://kit.svelte.dev/docs/hooks) if source is added in datasource before it is processed by page.

'Hooks' are app-wide functions you declare that SvelteKit will call in response to specific events, giving you fine-grained control over the framework's behaviour.

Pre-requiste :
- Following environment variables are added:
    - PUBLIC_STORYBLOK_API_KEY
    - PUBLIC_DATASOURCE_PATH : default value is redirectmap

```
import type { Handle } from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';
import {load} from '@yochaubs/storyblok-redirectmap';
import { PUBLIC_DATASOURCE_PATH } from '$env/static/public';
import { env as public_env } from '$env/dynamic/public';


export const handle: Handle = async ({event, resolve}) => {
    const entries = await load(public_env.PUBLIC_STORYBLOK_API_KEY, PUBLIC_DATASOURCE_PATH);    
    if( entries.get(event.url.pathname) ) {
        const redirectPath = entries.get(event.url.pathname);
        redirect(301, redirectPath || '/');
    }
    return resolve(event);
}

```


# Limitations
- Regular expression is not supported.
