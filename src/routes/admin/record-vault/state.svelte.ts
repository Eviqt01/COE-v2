import { createContext } from 'svelte';
import type { Students } from '$lib/services/students';

export class RecordVaultState {
	#rows = $state<Students[] | null>(null);
	#activeRow = $state<Students | null>(null);
	#searchingMode = $state(false);

	get rows() {
		return this.#rows;
	}

	set rows(v) {
		this.rows = v;
	}

	get activeRow() {
		return this.#activeRow;
	}

	set activeRow(v) {
		this.activeRow = v;
	}

	get searchingMode() {
		return this.#searchingMode;
	}

	set searchingMode(v) {
		this.searchingMode = v;
	}
}

export const [getRecordVaultState, setRecordVaultState] = createContext<RecordVaultState>();
