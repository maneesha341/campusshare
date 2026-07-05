const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'Other'];
const CONDITIONS = ['New', 'Good', 'Fair'];

// Controlled filter sidebar. `filters` and `setFilters` are lifted state from the parent page.
const Filters = ({ filters, setFilters, onApply }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="bg-white border-2 border-ink/10 rounded-2xl p-5 space-y-5 h-fit md:sticky md:top-20 shadow-card mb-4 md:mb-0">
      <h3 className="font-display font-semibold text-ink text-lg">🔎 Filters</h3>

      <div>
        <label className="text-sm font-medium text-ink/80">Department</label>
        <select
          value={filters.department || ''}
          onChange={(e) => update('department', e.target.value)}
          className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Semester</label>
        <select
          value={filters.semester || ''}
          onChange={(e) => update('semester', e.target.value)}
          className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
        >
          <option value="">All semesters</option>
          {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Subject</label>
        <input
          type="text"
          value={filters.subject || ''}
          onChange={(e) => update('subject', e.target.value)}
          placeholder="e.g. Thermodynamics"
          className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/80">Condition</label>
        <select
          value={filters.condition || ''}
          onChange={(e) => update('condition', e.target.value)}
          className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium text-ink/80">Min ₹</label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => update('minPrice', e.target.value)}
            className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Max ₹</label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => update('maxPrice', e.target.value)}
            className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full bg-brand-500 text-white py-2.5 rounded-full text-sm font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default Filters;