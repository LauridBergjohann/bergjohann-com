import type { PageDto } from '$lib/api/page-api';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
    const res = await fetch(`/api/pages/${params.slug}`);
    if (!res.ok) {
        error(404, {
            message: 'Page Not found'
        });
    }

    const page: PageDto = await res.json();

    return { page, pageTitle:page.title };
};