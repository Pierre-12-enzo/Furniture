// src/components/LowStockTable.jsx
const LowStockTable = ({ lowStock }) => {
  return (
    <div className="overflow-x-auto">
      {lowStock?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Minimum Stock</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td className="text-red-600">{item.quantity}</td>
                <td>{item.minimumStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          No low stock items
        </p>
      )}
    </div>
  );
};

export default LowStockTable;