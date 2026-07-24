import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BlockList from '../components/blocks/BlockList';
import { fetchPageById, createPage, updatePage, setPageStatus, clearCurrentPage } from '../store/slices/pagesSlice';

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PageEditorPage({ mode }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector((s) => s.pages.current);

  // All form fields are local component state — deliberately not in Redux.
  // Redux holds the *saved* page (from the `current` slice field); this
  // local state is the draft being edited, only dispatched on Save.
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (mode === 'edit' && id) dispatch(fetchPageById(id));
    return () => dispatch(clearCurrentPage());
  }, [dispatch, mode, id]);

  useEffect(() => {
    if (mode === 'edit' && current) {
      setTitle(current.title);
      setSlug(current.slug);
      setBlocks(current.blocks || []);
      setMetaTitle(current.seo?.metaTitle || '');
      setMetaDescription(current.seo?.metaDescription || '');
      setSlugTouched(true);
    }
  }, [mode, current]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  };

  const buildPayload = (status) => ({
    title,
    slug,
    blocks,
    ...(status ? { status } : {}),
    seo: { metaTitle, metaDescription },
  });

  const handleSave = async (status) => {
    setSaving(true);
    setError(null);
    try {
      if (mode === 'create') {
        const result = await dispatch(createPage(buildPayload(status || 'draft')));
        if (createPage.fulfilled.match(result)) {
          navigate(`/pages/${result.payload._id}`, { replace: true });
        } else {
          setError(result.payload);
        }
      } else {
        const result = await dispatch(updatePage({ id, payload: buildPayload(status) }));
        if (!updatePage.fulfilled.match(result)) setError(result.payload);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = () => {
    const next = current?.status === 'published' ? 'draft' : 'published';
    dispatch(setPageStatus({ id, status: next }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mode === 'create' ? 'New Page' : 'Edit Page'}</h1>
          {mode === 'edit' && current && (
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${current.status === 'published' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>
              {current.status}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {mode === 'edit' && (
            <button onClick={handleTogglePublish} className="text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              {current?.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving || !title || !slug}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-lg px-4 py-2"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-400">/</span>
            <input
              value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {['content', 'seo'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px ${activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'content' ? (
        <BlockList blocks={blocks} onChange={setBlocks} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Meta title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Meta description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
