import type { PageServerLoad } from '../dashboard/$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userData = await locals.safeGetSession();

	return {
		user: userData.user
	};
};
