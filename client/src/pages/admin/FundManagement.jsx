// src/pages/admin/FundManagement.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { fetchUsers } from "../../redux/slices/adminSlice";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon as UserSolidIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

// ==============
// Admin Info Hook
// ==============
const useAdminInfo = () => {
  return useMemo(() => {
    try {
      const data = localStorage.getItem("user");
      if (!data) return null;
      const parsed = JSON.parse(data);
      return {
        name: parsed.name || "Admin",
        role: parsed.role || "N/A",
        id: parsed._id || parsed.id,
      };
    } catch {
      return { name: "Admin", role: "N/A", id: null };
    }
  }, []);
};

// =================
// Admin Profile Card
// =================
const AdminProfileCard = ({ user }) => {
  if (!user) return null;
  return (
    <div className="mb-6 rounded-xl bg-gray-800 p-5 text-white shadow-xl">
      <div className="flex items-center space-x-4">
        <UserCircleIcon className="h-16 w-16 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm capitalize text-indigo-300">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

// ================
// Stat Card
// ================
const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`rounded-xl p-5 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-3xl font-bold">৳{value.toLocaleString("en-IN")}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);

// ================
// Transaction Form
// ================
const TransactionForm = ({ type, users, onTransactionSuccess, adminId }) => {
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    purpose: "",
    month: new Date().toISOString().substring(0, 7),
  });
  const [loading, setLoading] = useState(false);
  const isCredit = type === "credit";

  const verifiedUsers = users.filter((u) => u.isVerified);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      userId: isCredit ? formData.userId : null,
      amount: Number(formData.amount),
      type,
      purpose: formData.purpose,
      month: isCredit ? formData.month : null,
      createdBy: adminId,
    };

    try {
      await axiosInstance.post("/funds", payload);
      toast.success(`${isCredit ? "Credit" : "Debit"} entry successful!`);
      onTransactionSuccess();
      setFormData({
        userId: "",
        amount: "",
        purpose: "",
        month: new Date().toISOString().substring(0, 7),
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-gray-800 p-6 shadow-2xl">
      <h3
        className={`mb-4 text-xl font-bold ${
          isCredit ? "text-green-400" : "text-red-400"
        }`}
      >
        {isCredit ? "Add Credit Entry" : "Add Debit Entry"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isCredit && (
          <>
            <select
              required
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              className="w-full rounded-md border-gray-600 bg-gray-700 py-2 px-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Donor</option>
              {verifiedUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="month"
              required
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className="w-full rounded-md border-gray-600 bg-gray-700 py-2 px-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            />
          </>
        )}

        <input
          type="number"
          required
          min="1"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Amount (৳)"
          className="w-full rounded-md border-gray-600 bg-gray-700 py-2 px-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
        />

        <input
          type="text"
          value={formData.purpose}
          onChange={(e) =>
            setFormData({ ...formData, purpose: e.target.value })
          }
          placeholder="Purpose / Note"
          className="w-full rounded-md border-gray-600 bg-gray-700 py-2 px-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading || (isCredit && !formData.userId)}
          className={`w-full rounded-lg py-2 font-semibold text-white shadow-md transition-all duration-300 ${
            isCredit
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } disabled:opacity-50`}
        >
          {loading ? "Processing..." : "Add Record"}
        </button>
      </form>
    </div>
  );
};

// =================
// Timeline Item
// =================
const TimelineItem = ({ tx }) => {
  const isCredit = tx.type === "credit";

  return (
    <div className="relative mb-6 flex items-start pl-10">
      <div className="absolute left-4 top-2 h-full w-0.5 bg-gray-300"></div>
      <div
        className={`absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full ${
          isCredit ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>

      <div className="w-full rounded-lg bg-white p-4 shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <p
            className={`text-xl font-bold ${
              isCredit ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCredit ? "+" : "-"} ৳{tx.amount}
          </p>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold capitalize text-gray-600">
            {tx.type}
          </span>
        </div>

        <p className="mt-2 text-gray-800">{tx.purpose}</p>
        {tx.month && <p className="text-xs text-gray-500">Month: {tx.month}</p>}

        <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-600">
          {isCredit && (
            <p className="flex items-center">
              <UserSolidIcon className="mr-1.5 h-4 w-4 text-green-500" />
              <strong>Donor:</strong> {tx.user?.name || "Deleted User"}
            </p>
          )}
          <p className="flex items-center">
            <UserCircleIcon className="mr-1.5 h-4 w-4 text-indigo-500" />
            <strong>Recorder:</strong> {tx.createdBy?.name || "Deleted User"}
          </p>
          <p className="flex items-center text-gray-500">
            <ClockIcon className="mr-1.5 h-4 w-4" />
            {new Date(tx.date).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================
// Main FundManagement
// =====================
export default function FundManagement() {
  const dispatch = useDispatch();
  const adminInfo = useAdminInfo();
  const { users } = useSelector((state) => state.admin);

  const [totals, setTotals] = useState({ credit: 0, debit: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const totalsRes = await axiosInstance.get("/funds/totals");
      const txRes = await axiosInstance.get("/funds");
      setTotals(totalsRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      toast.error("Failed to load funds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
    fetchData();
  }, [dispatch]);

  const filtered = transactions.filter((tx) =>
    tx.purpose?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left */}
        <aside className="space-y-6">
          <AdminProfileCard user={adminInfo} />
          <StatCard
            title="Total Credit"
            value={totals.credit}
            icon={<ArrowUpCircleIcon className="h-8 w-8" />}
            gradient="bg-gradient-to-br from-green-400 to-green-600"
          />
          <StatCard
            title="Total Debit"
            value={totals.debit}
            icon={<ArrowDownCircleIcon className="h-8 w-8" />}
            gradient="bg-gradient-to-br from-red-400 to-red-600"
          />
          <StatCard
            title="Current Balance"
            value={totals.balance}
            icon={<BuildingLibraryIcon className="h-8 w-8" />}
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
          />
          <TransactionForm
            type="credit"
            users={users}
            onTransactionSuccess={fetchData}
            adminId={adminInfo?.id}
          />
          <TransactionForm
            type="debit"
            users={users}
            onTransactionSuccess={fetchData}
            adminId={adminInfo?.id}
          />
        </aside>

        {/* Right */}
        <main className="lg:col-span-2 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Transaction Ledger
          </h2>

          <div className="mb-4 flex items-center gap-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border-gray-300 bg-gray-100 py-2 px-4 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading transactions...
            </p>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((tx) => (
                <TimelineItem key={tx._id} tx={tx} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
