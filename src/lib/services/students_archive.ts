import type { SupabaseClient } from '@supabase/supabase-js';

type GET_STUDENTS_ARCHIVE_PAGINATED = {
	page: number;
	limit: number;
};
export type StudentsArchive = {
	id: string;
	lrn: string;
	full_name: string;
	gender: string;
	date_of_first: string;
	grade_section: string;
	school_year: string;
	adviser: string;
	created_at: string;
};

export class StudentsArchiveServiceTB {
	constructor(private readonly supabase?: SupabaseClient) {}
	async getStudentsArchivePaginated({ page, limit }: GET_STUDENTS_ARCHIVE_PAGINATED) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { data, error } = await this.supabase
			.from('students_archive')
			.select('*')
			.order('full_name', { ascending: true })
			.range((page - 1) * limit, page * limit - 1);

		if (error) return { data: null, error: error.message };

		return { data: data as StudentsArchive[], error: null };
	}

	async getStudentsCountArchive() {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };
		const { data, error } = await this.supabase
			.from('students_archive')
			.select('id', { count: 'exact' });

		if (error) return { data: null, error: error.message };

		return { data: data as StudentsArchive[], error: null };
	}

	async searchStudentsArchive({ SearchTerm }: { SearchTerm: string }) {
		if (!this.supabase) return { data: null, error: 'Supbase client not initalized' };

		const { data, error } = await this.supabase
			.from('students_archive')
			.select('*')
			.order('full_name', { ascending: true })
			.or(`full_name.ilike%${SearchTerm}%,lrn.ilike%${SearchTerm}`);

		if (error) return { data: null, error: error.message };

		return { data: data as StudentsArchive[], error: null };
	}

	async archiveStudents({ id, lrn }: { id: string; lrn: string }) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { error } = await this.supabase.rpc('archive_students', {
			p_id: id,
			p_lrn: lrn
		});

		if (error) return { error: error.message };

		return { error: null };
	}
}
