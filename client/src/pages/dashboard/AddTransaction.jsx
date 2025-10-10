import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../../redux/slices/memberSlice";

export default function AddTransaction() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ amount: "", type: "donation" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransaction(form));
    setForm({ amount: "", type: "donation" });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow max-w-md"
      >
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 mb-2 w-full"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 mb-2 w-full"
        >
          <option value="donation">Donation</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
}
