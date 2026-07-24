import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, setPageStatus, deletePage } from '../store/slices/pagesSlice';

export default function PagesListPage() {
  const dispatch = useDispatch();
  const { items, pagination, status } = useSelector((s) => s.pages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    const timeout = setTimeout(() => dispatch(fetchPages(params)), 300); // debounce search
    return () => clearTimeout(timeout);
  }, [dispatch, search, statusFilter, page]);

  const handleToggleStatus = (p) => {
    dispatch(setPageStatus({ id: p._id, status: p.status === 'published' ? 'draft' : 'published' }));
  };

  const handleDelete = (p) => {
    if (window.confirm(`Delete "${p.title}"? This cannot be undone.`)) {
      dispatch(deletePage(p._id));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 text-sm">Manage every page on the public site</p>
        </div>
        <Link
          to="/pages/new"
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg text-center"
        >
          + New Page
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search by title…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Updated</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3">
                  <Link to={`/pages/${p._id}`} className="font-medium text-gray-800 hover:text-brand-600">{p.title}</Link>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">/{p.slug}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => handleToggleStatus(p)} className="text-sm font-medium text-brand-600 hover:underline">
                    {p.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link to={`/pages/${p._id}`} className="text-sm font-medium text-gray-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(p)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {status === 'succeeded' && items.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No pages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 rounded-lg text-sm ${n === page ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
