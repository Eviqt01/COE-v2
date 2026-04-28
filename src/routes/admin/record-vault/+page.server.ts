import type { PageServerLoad } from './$types';
import { StudentsServiceTB } from '$lib/services/students';

export const load: PageServerLoad = async ({ locals, url }) => {
	const studentServiceTb = new StudentsServiceTB(locals.supabase);

	const what_page = Number(url.searchParams.get('p') ?? 1);
	const offset = Number(url.searchParams.get('o') ?? 10);

	const { data } = await studentServiceTb.getStudentsPaginated({
		page: what_page,
		limit: offset
	});

	const { count } = await studentServiceTb.getStudentsCount();

	return {
		students: data ?? [],
		what_page,
		offset,
		count
	};
};
