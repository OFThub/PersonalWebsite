import { Plus, Edit2, Trash2 } from 'lucide-react';

type DataTableProps<T extends { _id: string }> = {
  title: string;
  data: T[];
  columns: (keyof T)[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
};

export default function DataTable<T extends { _id: string }>({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title} ({data.length})</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold"
        >
          <Plus size={20} />
          Yeni Ekle
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col)} className="text-left p-3 text-cyan-400">
                {String(col)}
              </th>
            ))}
            <th className="text-right p-3 text-cyan-400">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id} className="border-b border-cyan-500/10">
              {columns.map(col => (
                <td key={String(col)} className="p-3">
                  {String(item[col])}
                </td>
              ))}
              <td className="p-3 text-right">
                <button onClick={() => onEdit(item)} className="mr-2">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(item._id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
