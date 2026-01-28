export function InputField({ label, value, onChange, type = 'text', required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
      />
    </div>
  );
}

export function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-cyan-400" size={32} />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-gray-400">{title}</h3>
    </div>
  );
}