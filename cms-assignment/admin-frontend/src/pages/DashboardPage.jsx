import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const StatCard = ({ label, value, tone }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-bold ${tone}`}>{value}</p>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Overview of your CMS content</p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Pages" value={stats.total} tone="text-gray-900" />
            <StatCard label="Published" value={stats.published} tone="text-brand-600" />
            <StatCard label="Drafts" value={stats.draft} tone="text-amber-600" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Recently updated</h2>
              <Link to="/pages/new" className="text-sm font-medium text-brand-600 hover:underline">
                + New Page
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {stats.recent.map((p) => (
                <li key={p._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <Link to={`/pages/${p._id}`} className="font-medium text-gray-800 hover:text-brand-600">
                      {p.title}
                    </Link>
                    <p className="text-xs text-gray-400">/{p.slug}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
              {stats.recent.length === 0 && <li className="px-5 py-6 text-center text-gray-400 text-sm">No pages yet.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
