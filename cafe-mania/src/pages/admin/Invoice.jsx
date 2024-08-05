import React, { useState } from 'react';
import '../../Assets/CSS/Invoice.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const Invoice = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [waiter, setWaiter] = useState('');
  const [table, setTable] = useState('');

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 0, rate: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.quantity * item.rate;
    });

    const cgst = subtotal * 0.06;
    const sgst = subtotal * 0.06;
    const total = subtotal + cgst + sgst;

    return {
      subtotal: subtotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const generateInvoice = () => {
    if (!name) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter name !!!',
      });
      return;
    }

    if (items.length === 0) {
      Swal.fire({
        icon: 'error',
        text: 'Please add at least one item before generating the invoice.',
        showConfirmButton: true,
      });
      return;
    }

    const { subtotal, cgst, sgst, total } = calculateTotal();

    // Logic to generate and style your invoice HTML
    const invoiceHTML = `
      <div class="invoice container">
        <div class="header text-center">
          <h1 class="mb-1">Cafe-Mania</h1>
          <p>Nikol, Ahmedabad, India</p>
          <p>Mobile No.: 9737982616</p><br/>
          <h2 class="mt-4 mb-4">Invoice</h2>
          <div class="invoice-details d-flex justify-content-between">
            <p>Invoice No: 10</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <hr style="border-top: 2px dashed #000;">
          <div class="customer-details text-left mt-3">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Address:</strong> ${address}</p>
          </div>
          <hr style="border-top: 2px dashed #000;">
        </div>
        <table class="table table-bordered mt-4">
          <thead class="thead-dark">
            <tr>
              <th>Item Name</th>
              <th>Qty.</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr key=${index}>
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
                <td>${item.rate}</td>
                <td>${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Subtotal</td>
              <td>${subtotal}</td>
            </tr>
            <tr>
              <td colspan="3">CGST (6%)</td>
              <td>${cgst}</td>
            </tr>
            <tr>
              <td colspan="3">SGST (6%)</td>
              <td>${sgst}</td>
            </tr>
            <tr class="total">
              <td colspan="3"><strong>Total Payable Value</strong></td>
              <td><strong>${total}</strong></td>
            </tr>
          </tfoot>
        </table>
        <hr style="border-top: 2px dashed #000;">
        ${waiter || table ? `<div>
          ${waiter ? `<p><strong>Waiter:</strong> ${waiter}</p>` : ''}
          ${table ? `<p><strong>Table:</strong> ${table}</p>` : ''}
        </div>
        <hr style="border-top: 2px dashed #000;">`: ''}
        <p class="thank-you text-center mt-4">Thank You, Visit again!!!</p>
        <button class="print-button btn btn-success mt-3" onClick="window.print()">Print Invoice</button>
      </div>
    `;

    // Open a new window with the generated invoice for print
    const newWindow = window.open('', '_blank');
    newWindow.document.body.innerHTML = invoiceHTML;
    newWindow.document.head.innerHTML = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .invoice {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          page-break-after: always;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
        }
        .customer-details{
          display: block;
          text-align: left;
          margin-top: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tfoot td {
          font-weight: bold;
        }
        .total {
          background-color: #f2f2f2;
        }
        .thank-you {
          text-align: center;
          margin-top: 20px;
        }
        .print-button {
          display: block; /* Always show button */
          position: fixed;
          bottom: 20px;
          height: 50px;
          width: 105px;
          border-radius: 10px;
          right: 20px;
          z-index: 1000;
        }
        @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 0;
          }
          .print-button {
            display: none; /* Hide button during print */
          }
            header, footer {
            display: none; /* Hide header and footer */
          }
        }
      </style>
    `;
  };

  return (
    <div className="container my-5 p-3" id='InvoiceGen'>
      <div className="card">
        <div className="card-body">

          <h1 className="mb-4">Invoice Generator</h1>
          <div className="form-group mb-3">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Address:</label>
            <textarea
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-md-6 form-group mb-3">
              <label>Waiter:</label>
              <input
                type="text"
                className="form-control"
                value={waiter}
                onChange={(e) => setWaiter(e.target.value)}
              />
            </div>
            <div className="col-md-6 form-group mb-3">
              <label>Table:</label>
              <input
                type="text"
                className="form-control"
                value={table}
                onChange={(e) => setTable(e.target.value)}
              />
            </div>
          </div>
          <h2 className="mt-4 mb-3">Items</h2>
          <button className='btn btn-primary mb-2' onClick={addItem}>Add Item</button>
          {items.map((item, index) => (
            <div key={index} className="form-group row mb-3">
              <div className="col-md-4">
                <label>Item Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label>Qty:</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label>Rate:</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className='btn btn-danger' onClick={() => removeItem(index)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="total-section mt-4">
            <h3>Total Amount:</h3>
            <p>Subtotal: ${calculateTotal().subtotal}</p>
            <p>CGST (6%): ${calculateTotal().cgst}</p>
            <p>SGST (6%): ${calculateTotal().sgst}</p>
            <p><strong>Total: ${calculateTotal().total}</strong></p>
          </div>
          <button className='btn btn-success mt-3' onClick={generateInvoice}>Generate Invoice</button>

        </div>
      </div>
    </div>
  );
};

export default Invoice;
