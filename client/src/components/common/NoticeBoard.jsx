// src/components/common/NoticeBoard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices } from "../../redux/slices/noticeSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NoticeBoard() {
  const dispatch = useDispatch();
  const { notices, loading, error } = useSelector((state) => state.notice);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center text-blue-600 mt-6 text-lg animate-pulse">
        Loading notices...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-6 text-lg font-semibold">
        {error}
      </p>
    );

  return (
    <>
      <main>
        <div className="p-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
            📢 Notice Board
          </h2>

          {notices.length === 0 ? (
            <p className="text-gray-500 text-center">No notices available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notices.map((n, idx) => (
                    <tr
                      key={n._id}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {n.title}
                      </td>
                      <td className="px-6 py-4 text-gray-700 line-clamp-2">
                        {n.content || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(n.createdAt).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {n.pinned ? (
                          <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                            📌 Pinned
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
