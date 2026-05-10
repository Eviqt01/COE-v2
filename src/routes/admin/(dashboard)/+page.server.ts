import type { PageServerLoad } from './$types';
import { DashboardServiceTB } from '$lib/services/dashboard';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userData = await locals.safeGetSession();
	const dashboardService = new DashboardServiceTB(locals.supabase);

	const what_page = Number(url.searchParams.get('p') ?? 1);
	const offset = Number(url.searchParams.get('o') ?? 10);
	const searchTerm = url.searchParams.get('search');

	if (searchTerm) {
		const { data } = await dashboardService.searchDashboard({ searchTerm });

		return {
			user: userData.user,
			students: data,
			count: 0,
			what_page: 1,
			offset: 10,
			searchTerm
		};
	} else {
		const [data, count] = await Promise.all([
			(
				await dashboardService.getDashboardPaginated({
					page: what_page,
					limit: offset
				})
			).data,
			(await dashboardService.getDashboardCount()).count
		]);

		return {
			user: userData.user,
			students: data,
			count: count ?? 0,
			what_page,
			offset,
			searchTerm
		};
	}
};
