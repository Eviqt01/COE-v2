import type { SupabaseClient } from '@supabase/supabase-js';

type GET_STUDENTS_PAGINATED = {
	page: number;
	limit: number;
};

export type Students = {
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

export class StudentsServiceTB {
	constructor(private readonly supabase?: SupabaseClient) {}

	async getStudentsPaginated({ page, limit }: GET_STUDENTS_PAGINATED) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { data, error } = await this.supabase
			.from('students')
			.select('*')
			.order('full_name', { ascending: true })
			.range((page - 1) * limit, page * limit - 1);

		if (error) return { data: null, error: error.message };

		return { data: data as Students[], error: null };
	}

	async getStudentsCount() {
		if (!this.supabase) return { count: null, error: 'Supabase client not initialized' };

		const { count, error } = await this.supabase.from('students').select('id', { count: 'exact' });

		if (error) return { count: null, error: error.message };

		return { count, error: null };
	}

	async searchStudents({ searchTerm }: { searchTerm: string }) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { data, error } = await this.supabase
			.from('students')
			.select('*')
			.order('full_name', { ascending: true })
			.or(`full_name.ilike.%${searchTerm}%,lrn.ilike.%${searchTerm}`);
		if (error) return { data: null, error: error.message };

		return { data: data as Students[], error: null };
	}

	async deleteStudent({ id, lrn }: { id: string; lrn: string }) {
		if (!this.supabase) return { error: 'Supabase client not initialized' };

		const { error } = await this.supabase.rpc('delete_student', {
			p_id: id,
			p_lrn: lrn
		});

		if (error) return { error: error.message };

		return { error: null };
	}
}
