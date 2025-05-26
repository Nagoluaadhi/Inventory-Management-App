import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exportToExcel } from '../utils/exportExcel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Report() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ type: '', client_id: '', from: '', to: '' });
  const [clients, setClients] = useState([]);

  const loadClients = async () => {
    const res = await axios.get('http://localhost:3001/clients');
    setClients(res.data);
  };

  const loadReports = async () => {
    const res = await axios.get('http://localhost:3001/report', { params: filter });
    setData(res.data);
  };

  useEffect(() => {
    loadClients();
    loadReports();
  }, []);

  const exportPDF = () => {
    const input = document.getElementById('report-table');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select onChange={e => setFilter({ ...filter, type: e.target.value })} className="p-2 border rounded">
          <option value="">All Types</option>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>
        <select onChange={e => setFilter({ ...filter, client_id: e.target.value })} className="p-2 border rounded">
          <option value="">All Clients</option>
          {clients.map(cli => <option key={cli.id} value={cli.id}>{cli.client_name}</option>)}
        </select>
        <input type="date" onChange={e => setFilter({ ...filter, from: e.target.value })} className="p-2 border rounded" />
        <input type="date" onChange={e => setFilter({ ...filter, to: e.target.value })} className="p-2 border rounded" />
        <button onClick={loadReports} className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-4">Filter</button>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => exportToExcel(data, 'report')} className="bg-green-500 text-white px-4 py-1 rounded">Export Excel</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-1 rounded">Export PDF</button>
      </div>

      <div id="report-table">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2">S.No</th>
              <th className="border px-2">Type</th>
              <th className="border px-2">Client</th>
              <th className="border px-2">Item</th>
              <th className="border px-2">Qty</th>
              <th className="border px-2">Barcode</th>
              <th className="border px-2">Invoice</th>
              <th className="border px-2">Date</th>
              <th className="border px-2">Remark</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id}>
                <td className="border px-2">{i + 1}</td>
                <td className="border px-2">{row.transaction_type}</td>
                <td className="border px-2">{row.client_name}</td>
                <td className="border px-2">{row.item_name}</td>
                <td className="border px-2">{row.qty}</td>
                <td className="border px-2">{row.barcode}</td>
                <td className="border px-2">{row.invoice_no}</td>
                <td className="border px-2">{new Date(row.date).toLocaleDateString()}</td>
                <td className="border px-2">{row.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
