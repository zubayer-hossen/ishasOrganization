// src/pages/admin/FundManagement.jsx (Vibrant & Unique Redesign)
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import fundService from "../../services/fundService";
import { fetchUsers } from "../../redux/slices/adminSlice";

// ==> Heroicons for a premium feel
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
} from "@heroicons/react/24/solid";

// ----------------------------------------------------------------------
// 헬퍼 এবং কাস্টম হুক (Helper & Custom Hooks)
// ----------------------------------------------------------------------

/**
 * localStorage থেকে অ্যাডমিনের তথ্য সঠিকভাবে পার্স করার জন্য একটি কাস্টম হুক।
 * আপনার দেওয়া "user{...}" ফরম্যাটটি হ্যান্ডেল করে।
 */
const useAdminInfo = () => {
  return useMemo(() => {
    try {
      const storedData = localStorage.getItem("user");
      if (!storedData) return null;

      // "user{...}" ফরম্যাট থেকে JSON অংশটি বের করা
      const jsonStartIndex = storedData.indexOf("{");
      if (jsonStartIndex === -1) return null;

      const jsonString = storedData.substring(jsonStartIndex);
      const parsedData = JSON.parse(jsonString);

      return {
        name: parsedData.name || "Admin",
        role: parsedData.role || "N/A",
        avatar: parsedData.avatar || "",
      };
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return { name: "Admin", role: "N/A", avatar: "" };
    }
  }, []);
};

// ----------------------------------------------------------------------
// yeniden tasarlanmış UI কম্পোনেন্ট (Redesigned UI Components)
// ----------------------------------------------------------------------

// ==> বাম পাশের কন্ট্রোল প্যানেলের জন্য অ্যাডমিন প্রোফাইল কার্ড
const AdminProfileCard = ({ user }) => {
  if (!user) return null;
  return (
    <div className="mb-8 rounded-xl bg-gray-800 p-5 text-white shadow-2xl">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Admin Avatar"
            className="h-16 w-16 rounded-full border-2 border-indigo-400 object-cover"
          />
        ) : (
          <UserCircleIcon className="h-16 w-16 text-indigo-400" />
        )}
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm capitalize text-indigo-300">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

// ==> সুন্দর গ্রেডিয়েন্টসহ স্ট্যাটাস কার্ড
const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`relative overflow-hidden rounded-xl p-5 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 ${gradient}`}
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

// ==> বাম পাশের কন্ট্রোল প্যানেলের জন্য কমপ্যাক্ট ফর্ম
const TransactionForm = ({ type, users, onTransactionSuccess }) => {
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    purpose: "",
    month: new Date().toISOString().substring(0, 7),
  });
  const [loading, setLoading] = useState(false);
  const isCredit = type === "credit";

  const availableUsers = useMemo(
    () => users.filter((u) => u.isVerified),
    [users]
  );

  useEffect(() => {
    setFormData({
      userId: isCredit ? "" : null,
      amount: "",
      purpose: "",
      month: new Date().toISOString().substring(0, 7),
    });
  }, [type, isCredit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const txPayload = {
      userId: isCredit ? formData.userId : null,
      amount: Number(formData.amount),
      type,
      purpose: formData.purpose,
      month: isCredit ? formData.month : null,
    };

    try {
      await fundService.createTransaction(txPayload);
      toast.success(`✅ ${isCredit ? "Fund" : "Cost"} entry successful!`);
      setFormData({
        userId: isCredit ? "" : null,
        amount: "",
        purpose: "",
        month: new Date().toISOString().substring(0, 7),
      });
      onTransactionSuccess();
    } catch (error) {
      toast.error(
        `❌ Entry failed: ${error.response?.data?.msg || "Server error"}`
      );
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
        {isCredit ? "New Credit Entry" : "New Debit Entry"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isCredit && (
          <>
            <div className="relative">
              <UserGroupIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                required
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full rounded-md border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Donor</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="month"
                required
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                className="w-full rounded-md border-gray-600 bg-gray-700 py-2 pl-10 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        )}
        <div className="relative">
          <BanknotesIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="number"
            required
            min="1"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="Amount (৳)"
            className="w-full rounded-md border-gray-600 bg-gray-700 py-2 pl-10 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <ClipboardDocumentIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            placeholder="Purpose / Note"
            className="w-full rounded-md border-gray-600 bg-gray-700 py-2 pl-10 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || (isCredit && !formData.userId)}
          className={`w-full rounded-lg py-2.5 font-semibold text-white shadow-md transition-all duration-300 ${
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

// ==> ডান পাশের টাইমলাইন আইটেম
const TimelineItem = ({ tx }) => {
  const isCredit = tx.type === "credit";
  const theme = {
    ring: isCredit ? "ring-green-500" : "ring-red-500",
    icon: isCredit ? (
      <ArrowUpCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowDownCircleIcon className="h-5 w-5 text-red-500" />
    ),
    amount: isCredit ? "text-green-400" : "text-red-400",
  };

  return (
    <div className="relative flex items-start pl-10">
      {/* Timeline Line & Dot */}
      <div className="absolute left-4 top-2 h-full w-0.5 bg-gray-300"></div>
      <div
        className={`absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ${theme.ring}`}
      ></div>

      <div className="mb-8 w-full rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <p className={`text-xl font-bold ${theme.amount}`}>
            {isCredit ? "+" : "-"} ৳{tx.amount.toLocaleString("en-IN")}
          </p>
          <span className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
            {theme.icon}
            <span className="ml-1.5 capitalize">{tx.type}</span>
          </span>
        </div>
        <p className="mt-2 text-gray-800">
          {tx.purpose || "No purpose specified"}
        </p>
        {tx.month && <p className="text-xs text-gray-500">Month: {tx.month}</p>}

        <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <UserSolidIcon className="mr-1.5 h-4 w-4" />{" "}
              <strong>Donor:</strong>&nbsp;{tx.user?.name || "N/A"}
            </span>
            <span className="flex items-center">
              <UserCircleIcon className="mr-1.5 h-4 w-4" />{" "}
              <strong>Recorder:</strong>&nbsp;{tx.createdBy?.name || "System"}
            </span>
          </div>
          <div className="mt-1 flex items-center text-gray-500">
            <ClockIcon className="mr-1.5 h-4 w-4" />
            {new Date(tx.date).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// মূল ফান্ড ম্যানেজমেন্ট কম্পোনেন্ট (Main FundManagement Component)
// ----------------------------------------------------------------------
export default function FundManagement() {
  const dispatch = useDispatch();
  const adminInfo = useAdminInfo();
  const { users } = useSelector((state) => state.admin);
  const [totals, setTotals] = useState({ credit: 0, debit: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { totals, transactions } = await fundService.getFundData();
      setTotals(totals);
      setTransactions(transactions);
    } catch (error) {
      toast.error("Failed to load fund data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
    fetchData();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ==> বাম কলাম: কন্ট্রোল প্যানেল */}
        <aside className="lg:col-span-1">
          <AdminProfileCard user={adminInfo} />
          <div className="mb-8 grid grid-cols-1 gap-4">
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
          </div>
          <div className="space-y-6">
            <TransactionForm
              type="credit"
              users={users}
              onTransactionSuccess={fetchData}
            />
            <TransactionForm
              type="debit"
              users={users}
              onTransactionSuccess={fetchData}
            />
          </div>
        </aside>

        {/* ==> ডান কলাম: ট্রানজেকশন টাইমলাইন */}
        <main className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Transaction Ledger
            </h2>
            {loading ? (
              <p className="py-8 text-center text-gray-500">
                Loading ledger...
              </p>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <BanknotesIcon className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-800">
                  No Transactions Yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Use the forms on the left to add a new transaction.
                </p>
              </div>
            ) : (
              <div className="relative">
                {transactions.map((tx) => (
                  <TimelineItem key={tx._id} tx={tx} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
