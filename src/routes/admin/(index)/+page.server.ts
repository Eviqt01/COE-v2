import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userData = await locals.safeGetSession();

	return {
		user: userData.user
	};
};
