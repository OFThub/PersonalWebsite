type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextAreaField({ label, value, onChange }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
      />
    </div>
  );
}
