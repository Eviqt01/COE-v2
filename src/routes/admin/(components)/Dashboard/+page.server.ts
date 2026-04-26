import type { PageServerLoad } from './$types.ts';

export const load: PageServerLoad = async ({ locals }) => {
	const userData = await locals.safeGetSession();

	return {
		user: userData.user
	};
};
