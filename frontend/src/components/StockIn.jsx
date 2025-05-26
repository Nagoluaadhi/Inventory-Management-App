import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exportToExcel } from '../utils/exportExcel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BarcodeScanner from './BarcodeScanner';

export default function StockIn() {
  const [form, setForm] = useState({
    date: '',
    inventory_id: '',
    client_id: '',
    barcode: '',
    invoice_no: '',
    qty: '',
    remark: ''
  });

  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);
  const [scannerVisible, setScannerVisible] = useState(false);

  const loadDropdowns = async () => {
    const [invRes, cliRes, stockRes] = await Promise.all([
      axios.get('http://localhost:3001/inventory'),
      axios.get('http://localhost:3001/clients'),
      axios.get('http://localhost:3001/stockin')
    ]);
    setInventory(invRes.data);
    setClients(cliRes.data);
    setData(stockRes.data);
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Get the logged-in user
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.id) {
    alert('User not logged in.');
    return;
  }

  // ✅ Basic client-side validation
  if (!form.date || !form.inventory_id || !form.client_id || !form.barcode || !form.qty) {
    alert('Please fill all required fields.');
    return;
  }

  try {
    // ✅ Add user_id to the form data
    await axios.post('http://localhost:3001/stockin', {
      ...form,
      user_id: user.id
    });

    // Reset form
    setForm({
      date: '',
      inventory_id: '',
      client_id: '',
      barcode: '',
      invoice_no: '',
      qty: '',
      remark: ''
    });

    setScannerVisible(false);
    loadDropdowns();
  } catch (err) {
    console.error('StockIn submission failed:', err);
    alert('Error submitting Stock IN. Please check the server and try again.');
  }
};


const handleScan = (value) => {
  if (form.barcode === value) {
    // same barcode scanned again → increment quantity
    const currentQty = parseInt(form.qty || '1', 10);
    setForm({ ...form, qty: (currentQty + 1).toString() });
  } else {
    // new barcode → reset qty to 1
    setForm({ ...form, barcode: value, qty: '1' });
  }
  setScannerVisible(false);
};


  const exportPDF = () => {
    const input = document.getElementById('stockin-table');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('stockin_report.pdf');
    });
  };
const deleteStockIn = async (id) => {
  if (!window.confirm('Are you sure you want to delete this entry?')) return;
  try {
    await axios.delete(`http://localhost:3001/stockin/${id}`);
    loadDropdowns(); // Refresh the table
  } catch (err) {
    console.error(err);
    alert('Failed to delete Stock IN entry');
  }
};

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Stock IN</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />
        <select value={form.inventory_id} onChange={(e) => setForm({ ...form, inventory_id: e.target.value })} className="p-2 border rounded">
          <option value="">Select Item</option>
          {inventory.map(item => <option key={item.id} value={item.id}>{item.item_name}</option>)}
        </select>
        <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="p-2 border rounded">
          <option value="">Select Client</option>
          {clients.map(cli => <option key={cli.id} value={cli.id}>{cli.client_name}</option>)}
        </select>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1">Barcode</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Scan or enter barcode"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              className="p-2 border rounded flex-1"
            />
            <button type="button" onClick={() => setScannerVisible(!scannerVisible)} className="bg-blue-600 text-white px-3 py-1 rounded">
              {scannerVisible ? 'Close' : 'Scan'}
            </button>
          </div>
          {scannerVisible && <BarcodeScanner onScan={handleScan} />}
        </div>

        <input type="text" placeholder="Invoice No" value={form.invoice_no} onChange={(e) => setForm({ ...form, invoice_no: e.target.value })} className="p-2 border rounded" />
        <input type="number" placeholder="Quantity" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} className="p-2 border rounded" />
        <input type="text" placeholder="Remark" value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} className="p-2 border rounded col-span-3" />
        <div className="md:col-span-3 flex justify-end">
  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded w-auto">
    Add Stock IN
  </button>
</div>

      </form>

      <div className="flex gap-4 mb-4">
        <button onClick={() => exportToExcel(data, 'stockin_report')} className="bg-green-500 text-white px-4 py-1 rounded">Export Excel</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-1 rounded">Export PDF</button>
      </div>

      <div id="stockin-table">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2">S.No</th>
              <th className="border px-2">Item</th>
              <th className="border px-2">Client</th>
              <th className="border px-2">Barcode</th>
              <th className="border px-2">Invoice</th>
              <th className="border px-2">Qty</th>
              <th className="border px-2">Remark</th>
              <th className="border px-2">Date</th>
              <th className="border px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id}>
                <td className="border px-2">{i + 1}</td>
                <td className="border px-2">{row.item_name}</td>
                <td className="border px-2">{row.client_name}</td>
                <td className="border px-2">{row.barcode}</td>
                <td className="border px-2">{row.invoice_no}</td>
                <td className="border px-2">{row.qty}</td>
                <td className="border px-2">{row.remark}</td>
                <td className="border px-2">{new Date(row.date).toLocaleDateString()}</td>
                <td className="border px-2">
      <button
        onClick={() => deleteStockIn(row.id)}
        className="bg-red-600 text-white px-2 py-0.5 text-xs rounded"
      >
        Delete
      </button>
    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
