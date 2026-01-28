import { Plus, Edit2, Trash2 } from 'lucide-react';

interface DataTableProps {
  title: string;
  data: any[];
  columns: string[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function DataTable({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
}: DataTableProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {title} ({data.length})
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Plus size={20} />
          Yeni Ekle
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Henüz veri yok</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20">
                {columns.map((col) => (
                  <th key={col} className="text-left p-3 font-semibold text-cyan-400">
                    {col}
                  </th>
                ))}
                <th className="text-right p-3 font-semibold text-cyan-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-b border-cyan-500/10 hover:bg-white/5">
                  {columns.map((col) => (
                    <td key={col} className="p-3">
                      {String(item[col])}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 hover:bg-cyan-500/20 rounded-lg mr-2 transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}