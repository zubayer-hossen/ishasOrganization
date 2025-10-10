import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../redux/slices/memberSlice";
import {
  BanknotesIcon,
  ArrowUpCircleIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

// একটি সুন্দর লোডিং স্পিনার কম্পোনেন্ট
const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

export default function Transactions() {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state) => state.member);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // useMemo ব্যবহার করে মোট অনুদানের পরিমাণ হিসাব করা
  const totalContribution = useMemo(() => {
    if (!transactions) return 0;
    // এখানে শুধুমাত্র credit (অনুদান) লেনদেনগুলো যোগ করা হচ্ছে
    return transactions
      .filter((t) => t.type === "credit")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <BanknotesIcon className="h-8 w-8 mr-3 text-indigo-600" />
            My Contribution History
          </h1>
          <p className="mt-1 text-md text-gray-600">
            Here is a detailed record of all your donations.
          </p>
        </div>

        {/* Summary Card */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
          <h3 className="text-lg font-medium opacity-90">
            Total Amount Donated
          </h3>
          <p className="mt-1 text-4xl font-bold">
            ৳ {totalContribution.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <h2 className="p-5 text-xl font-semibold text-gray-800 border-b">
            Detailed Statement
          </h2>
          {loading ? (
            <Spinner />
          ) : transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Donation Month
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Purpose
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {t.month || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {t.purpose || "Monthly Donation"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {t.type === "credit" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                            <ArrowUpCircleIcon className="mr-1.5 h-4 w-4" />৳{" "}
                            {t.amount.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          // অন্য কোনো টাইপের জন্য (যদি থাকে)
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                            ৳ {t.amount.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No Transactions Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't made any donations yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
