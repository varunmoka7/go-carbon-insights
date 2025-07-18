import React, { useState } from 'react';
import { X, Eye, Edit3 } from 'lucide-react';

const categories = [
  { name: 'General', value: 'general' },
  { name: 'Scope 1-2-3', value: 'scope' },
  { name: 'Regulations', value: 'regulations' },
  { name: 'Software', value: 'software' },
  { name: 'Industry Specific', value: 'industry' },
];

const tagSuggestions = ['SBTi', 'GHG Protocol', 'CSRD', 'Carbon Accounting', 'Supply Chain', 'Net Zero'];

const NewTopicModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0].value);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mode, setMode] = useState<'question' | 'discussion'>('question');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);

  if (!open) return null;

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagInput('');
  };
  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181818] rounded-xl shadow-2xl w-full max-w-2xl p-8 relative border border-[#232323]">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-emerald-400" onClick={onClose} aria-label="Close"><X className="w-6 h-6" /></button>
        <h2 className="text-2xl font-bold text-white mb-6">{mode === 'question' ? 'Ask a Question' : 'Start a Discussion'}</h2>
        <div className="flex gap-4 mb-4">
          <button
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'question' ? 'bg-emerald-600 text-white' : 'bg-[#232323] text-gray-300 hover:bg-emerald-900'}`}
            onClick={() => setMode('question')}
          >Ask Question</button>
          <button
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'discussion' ? 'bg-emerald-600 text-white' : 'bg-[#232323] text-gray-300 hover:bg-emerald-900'}`}
            onClick={() => setMode('discussion')}
          >Start Discussion</button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-semibold mb-1">Title</label>
          <input
            className="w-full rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
            placeholder="Enter a descriptive title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-300 font-semibold mb-1">Category</label>
            <select
              className="w-full rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 font-semibold mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-1">
              {tags.map(tag => (
                <span key={tag} className="bg-[#232323] text-emerald-300 border border-emerald-700 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  {tag}
                  <button className="ml-1 text-gray-400 hover:text-red-400" onClick={() => handleRemoveTag(tag)} aria-label="Remove tag">×</button>
                </span>
              ))}
            </div>
            <input
              className="w-full rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
              placeholder="Add tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  handleAddTag(tagInput.trim());
                  e.preventDefault();
                }
              }}
              list="tag-suggestions"
            />
            <datalist id="tag-suggestions">
              {tagSuggestions.filter(t => !tags.includes(t)).map(tag => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-semibold mb-1">Content</label>
          <div className="flex gap-2 mb-2">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${!preview ? 'bg-emerald-600 text-white' : 'bg-[#232323] text-gray-300 hover:bg-emerald-900'}`}
              onClick={() => setPreview(false)}
            ><Edit3 className="inline w-4 h-4 mr-1" /> Edit</button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${preview ? 'bg-emerald-600 text-white' : 'bg-[#232323] text-gray-300 hover:bg-emerald-900'}`}
              onClick={() => setPreview(true)}
            ><Eye className="inline w-4 h-4 mr-1" /> Preview</button>
          </div>
          {!preview ? (
            <textarea
              className="w-full min-h-[120px] rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 font-mono"
              placeholder="Write your question or discussion details... (Markdown supported)"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          ) : (
            <div className="w-full min-h-[120px] rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 px-3 font-mono whitespace-pre-line">
              {content || <span className="text-gray-500">Nothing to preview yet.</span>}
            </div>
          )}
        </div>
        <button
          className="w-full mt-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onClick={() => onSubmit && onSubmit({ title, category, tags, content, mode })}
          disabled={!title.trim() || !content.trim()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewTopicModal; 