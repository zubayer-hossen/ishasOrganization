import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// ✅ Redux slice import: fetchTransactions এবং Redux state ব্যবহার করা হচ্ছে
import { fetchTransactions } from "../../redux/slices/transactionSlice";
import {
  BanknotesIcon,
  ArrowUpCircleIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

// Helper Component for Loading State
const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
  </div>
);

// Helper function to format month from YYYY-MM
const formatMonth = (monthString) => {
  if (!monthString) return "N/A";
  try {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  } catch (e) {
    return monthString;
  }
};

export default function Transactions() {
  const dispatch = useDispatch();
  // ✅ transactionsSlice থেকে state নেওয়া হচ্ছে
  const {
    items: transactions,
    loading,
    error,
    totalContribution, // Redux-এ হিসাব করা মোট অনুদান
  } = useSelector((state) => state.transactions);

  // 1. Fetch data on component mount
  useEffect(() => {
    // API Call: সার্ভার টোকেন থেকে ইউজার আইডি পেয়ে ফিল্টার করবে।
    dispatch(fetchTransactions());
  }, [dispatch]);

  // 2. Conditional Rendering for Loading/Error/No Data
  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="py-16 text-center text-red-600">
          <InformationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium">Error Loading Data</h3>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={() => dispatch(fetchTransactions())}
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Filter only credit transactions (Contributions) as this is a member's view
    const myContributions = transactions.filter((t) => t.type === "credit");

    if (myContributions.length === 0) {
      return (
        <div className="py-16 text-center">
          <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No Donations Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            It looks like you haven't made any contributions yet.
          </p>
        </div>
      );
    }

    // Main Table Rendering
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHead title="Date" alignment="text-left" />
              <TableHead title="Donation Month" alignment="text-left" />
              <TableHead title="Purpose" alignment="text-left" />
              <TableHead title="Recorded By" alignment="text-left" />
              <TableHead title="Amount" alignment="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {myContributions.map((t) => (
              // এখানে শুধুমাত্র Credit/Donation দেখানো হচ্ছে
              <TransactionRow key={t._id} t={t} isCredit={true} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 3. Main Component Structure
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center">
            <BanknotesIcon className="h-8 w-8 mr-3 text-indigo-600" />
            My Contribution History
          </h1>
          <p className="mt-1 text-md text-gray-600">
            A detailed record of your transactions with the organization.
          </p>
        </div>

        {/* Summary Card */}
        <div className="mb-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
          <h3 className="text-lg font-medium opacity-90">
            Total Amount Contributed
          </h3>
          <p className="mt-1 text-5xl font-extrabold">
            ৳ {totalContribution.toLocaleString("en-IN")}
          </p>
          <div className="mt-4 flex items-center text-sm font-light opacity-90">
            <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
            <span>Thank you for your valuable support!</span>
          </div>
        </div>

        {/* Transactions Table Container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <h2 className="p-5 text-xl font-bold text-gray-800 border-b bg-gray-50">
            Detailed Statement
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// ======================
// Sub-Components
// ======================

const TableHead = ({ title, alignment }) => (
  <th
    scope="col"
    className={`px-6 py-3 ${alignment} text-xs font-semibold uppercase tracking-wider text-gray-600`}
  >
    {title}
  </th>
);

const TransactionRow = ({ t, isCredit }) => {
  const badgeClass = "bg-green-100 text-green-800";
  const amountColor = "text-green-600";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {new Date(t.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </td>
      {/* Donation Month */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 text-indigo-400 mr-2" />
          {formatMonth(t.month)}
        </div>
      </td>
      {/* Purpose */}
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
        {t.purpose || "Monthly Contribution"}
      </td>
      {/* Recorded By (Admin/Treasurer's name) */}
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
        {t.createdBy?.name || "System"}
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-6 py-4 text-right">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${badgeClass} ${amountColor}`}
        >
          <ArrowUpCircleIcon className="mr-1.5 h-4 w-4" />+ ৳{" "}
          {t.amount.toLocaleString("en-IN")}
        </span>
      </td>
    </tr>
  );
};
