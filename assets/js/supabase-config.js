// ============================================================
//  DATABASE CONFIGURATION
// ============================================================
// Set USE_LOCAL_DB = true to use persistent local browser storage (localStorage)
// Set USE_LOCAL_DB = false to use Supabase Cloud backend
const USE_LOCAL_DB = false;

const SUPABASE_URL = 'https://bmhbjdtbvtvhexsvxojt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaGJqZHRidnR2aGV4c3Z4b2p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTI3NDQ0OCwiZXhwIjoyMTA2ODUwNDQ4fQ.cAGIfIQcyZZMRfi2OC_xfOuno4fcWcvBM-hPF1KV-6w';

// ── Local Database Client (Simulates Supabase PostgREST API using localStorage)
class LocalDatabase {
  constructor() {
    this.auth = {
      onAuthStateChange: (cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => {}
    };
  }

  _getKey(table) {
    return 'cogculture_db_' + table;
  }

  _getRows(table) {
    try {
      const raw = localStorage.getItem(this._getKey(table));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Error reading local table ' + table, e);
      return [];
    }
  }

  _setRows(table, rows) {
    try {
      localStorage.setItem(this._getKey(table), JSON.stringify(rows));
    } catch (e) {
      console.warn('Error writing local table ' + table, e);
    }
  }

  from(table) {
    const self = this;
    let action = 'select';
    let insertData = null;
    let updateData = null;
    let filters = [];
    let orderCol = null;
    let orderAsc = true;
    let limitNum = null;
    let selectCols = '*';

    const query = {
      select(cols = '*') {
        if (action !== 'insert') action = 'select';
        selectCols = cols;
        return query;
      },
      insert(data) {
        action = 'insert';
        insertData = data;
        return query;
      },
      update(data) {
        action = 'update';
        updateData = data;
        return query;
      },
      delete() {
        action = 'delete';
        return query;
      },
      eq(col, val) {
        filters.push({ col, val: String(val) });
        return query;
      },
      order(col, { ascending = true } = {}) {
        orderCol = col;
        orderAsc = ascending;
        return query;
      },
      limit(n) {
        limitNum = n;
        return query;
      },
      async _exec() {
        let rows = self._getRows(table);

        if (action === 'insert') {
          const items = Array.isArray(insertData) ? insertData : [insertData];
          const inserted = items.map(item => {
            const row = {
              id: item.id || ('loc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6)),
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
              ...item
            };
            if (table === 'proposal_versions' && !row.version_number) {
              const prev = rows.filter(r => String(r.proposal_id) === String(row.proposal_id));
              row.version_number = prev.length + 1;
            }
            if (table === 'custom_users' && row.is_admin === undefined) {
              row.is_admin = rows.length === 0; // First registered user is admin
            }
            return row;
          });
          rows.push(...inserted);
          self._setRows(table, rows);
          const ret = Array.isArray(insertData) ? inserted : inserted[0];
          return { data: ret, error: null };
        }

        if (action === 'update') {
          let updatedList = [];
          rows = rows.map(r => {
            const match = filters.every(f => String(r[f.col]) === f.val);
            if (match) {
              const merged = { ...r, ...updateData, updated_at: new Date().toISOString() };
              updatedList.push(merged);
              return merged;
            }
            return r;
          });
          self._setRows(table, rows);
          return { data: updatedList, error: null };
        }

        if (action === 'delete') {
          const remaining = rows.filter(r => !filters.every(f => String(r[f.col]) === f.val));
          self._setRows(table, remaining);
          return { data: null, error: null };
        }

        // Action: select
        let results = rows.filter(r => filters.every(f => String(r[f.col]) === f.val));
        if (orderCol) {
          results.sort((a, b) => {
            const valA = a[orderCol] ?? '';
            const valB = b[orderCol] ?? '';
            if (valA < valB) return orderAsc ? -1 : 1;
            if (valA > valB) return orderAsc ? 1 : -1;
            return 0;
          });
        }
        if (limitNum !== null) {
          results = results.slice(0, limitNum);
        }
        if (selectCols && selectCols !== '*') {
          const cols = selectCols.split(',').map(c => c.trim());
          results = results.map(r => {
            const out = {};
            cols.forEach(c => { if (c in r) out[c] = r[c]; });
            return out;
          });
        }
        return { data: results, error: null };
      },
      async single() {
        const res = await query._exec();
        if (res.error) return res;
        const item = Array.isArray(res.data) ? res.data[0] : res.data;
        return { data: item || null, error: item ? null : { message: 'Row not found' } };
      },
      async maybeSingle() {
        const res = await query._exec();
        if (res.error) return res;
        const item = Array.isArray(res.data) ? res.data[0] : res.data;
        return { data: item || null, error: null };
      },
      then(resolve, reject) {
        return query._exec().then(resolve, reject);
      }
    };
    return query;
  }
}

// ── Database Client Factory
let _db = null;

function getDB() {
  if (!_db) {
    if (USE_LOCAL_DB) {
      console.log('⚡ [CogCulture] Using Local Database (localStorage)');
      _db = new LocalDatabase();
    } else {
      if (typeof supabase === 'undefined') {
        console.error('[CogCulture] Supabase CDN script not loaded.');
        return null;
      }
      _db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    }
  }
  return _db;
}
