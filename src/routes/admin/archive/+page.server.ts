import type { PageServerLoad } from './$types';
import { StudentsArchiveServiceTB } from '$lib/services/students_archive';

export const load: PageServerLoad = async ({ locals, url }) => {
	const studentArchiveServiceTb = new StudentsArchiveServiceTB(locals.supabase);

	const what_page = Number(url.searchParams.get('p') ?? 1);
	const offset = Number(url.searchParams.get('o') ?? 10);
	const searchTerm = url.searchParams.get('search');

	if (searchTerm) {
		const { data } = await studentArchiveServiceTb.searchStudentsArchive({
			searchTerm: searchTerm
		});

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
				await studentArchiveServiceTb.getStudentsArchivePaginated({
					page: what_page,
					limit: offset
				})
			).data,
			(await studentArchiveServiceTb.getStudentsCountArchive()).count
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
