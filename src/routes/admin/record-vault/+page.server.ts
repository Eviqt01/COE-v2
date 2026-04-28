import type { PageServerLoad } from './$types';
import { StudentsServiceTB } from '$lib/services/students';

export const load: PageServerLoad = async ({ locals, url }) => {
	const studentServiceTb = new StudentsServiceTB(locals.supabase);

	const what_page = Number(url.searchParams.get('p') ?? 1);
	const offset = Number(url.searchParams.get('o') ?? 10);
	const searchTerm = url.searchParams.get('search');

	if (searchTerm) {
		const { data } = await studentServiceTb.searchFullname({ searchTerm: searchTerm });

		return {
			students: data,
			what_page: 10,
			offset: 1,
			count: 0,
			searchTerm
		};
	} else {
		const [data, count] = await Promise.all([
			(
				await studentServiceTb.getStudentsPaginated({
					page: what_page,
					limit: offset
				})
			).data,
			(await studentServiceTb.getStudentsCount()).count
		]);

		return {
			students: data,
			what_page,
			offset,
			count,
			searchTerm
		};
	}
};
