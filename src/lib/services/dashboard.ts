import type { SupabaseClient } from '@supabase/supabase-js';
import type { Students } from './students';

type GET_DASHBOARD_PAGINATED = {
	page: number;
	limit: number;
};

export class DashboardServiceTB {
	constructor(private readonly supabase?: SupabaseClient) {}

	async getDashboardPaginated({ page, limit }: GET_DASHBOARD_PAGINATED) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { data, error } = await this.supabase
			.from('dashboard')
			.select('*')
			.order('created_at', { ascending: false })
			.range((page - 1) * limit, page * limit - 1);

		if (error) return { data: null, error: error.message };

		return { data: data as Students[], error: null };
	}

	async getDashboardCount() {
		if (!this.supabase) return { count: null, error: 'Supabase client not initialized' };
		const { count, error } = await this.supabase.from('dashboard').select('id', { count: 'exact' });

		if (error) return { count: null, error: error.message };

		return { count, error: null };
	}

	async deleteDashboardRecord(id: string) {
		if (!this.supabase) return { error: 'Supabase client not initialized' };

		const { error } = await this.supabase.from('dashboard').delete().eq('id', id);

		if (error) return { error: error.message };

		return { error: null };
	}

	async restoreFromDashboard({ id, lrn }: { id: string; lrn: string }) {
		if (!this.supabase) return { error: 'Supabase client not initialized' };

		// Using the user's new RPC
		const { error } = await this.supabase.rpc('dashboard_records', {
			p_id: id,
			p_lrn: lrn
		});

		if (error) return { error: error.message };

		return { error: null };
	}

	async searchDashboard({ searchTerm }: { searchTerm: string }) {
		if (!this.supabase) return { data: null, error: 'Supabase client not initialized' };

		const { data, error } = await this.supabase
			.from('dashboard')
			.select('*')
			.order('created_at', { ascending: false })
			.or(`full_name.ilike."%${searchTerm}%",lrn.ilike."%${searchTerm}%"`);

		if (error) return { data: null, error: error.message };

		return { data: data as Students[], error: null };
	}
}
