// import React from "react";
// import { CheckCircle, Clock, Check } from "lucide-react";

// const PayoutsTable = () => {
//   const payouts = [
//     { id: "PO-001", seller: "Tech Store Pro", amount: "$500", status: "Pending" },
//     { id: "PO-002", seller: "Fashion Hub", amount: "$200", status: "Completed" },
//     { id: "PO-001", seller: "Tech Store Pro", amount: "$500", status: "Pending" },
//     { id: "PO-002", seller: "Fashion Hub", amount: "$200", status: "Completed" },
//     { id: "PO-001", seller: "Tech Store Pro", amount: "$500", status: "Pending" },
//     { id: "PO-002", seller: "Fashion Hub", amount: "$200", status: "Completed" },
//   ];

//   return (
//     <table className="min-w-full border-collapse">
//       <thead className="bg-indigo-600 text-white">
//         <tr>
//           <th className="px-4 py-3 text-sm font-semibold text-left">Payout ID</th>
//           <th className="px-4 py-3 text-sm font-semibold text-left">Seller</th>
//           <th className="px-4 py-3 text-sm font-semibold text-left">Amount</th>
//           <th className="px-4 py-3 text-sm font-semibold text-left">Status</th>
//           <th className="px-4 py-3 text-sm font-semibold text-left">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {payouts.map((po, i) => (
//           <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"} hover:bg-indigo-100/70 transition-colors`}>
//             <td className="px-4 py-3 text-purple-600 font-medium">{po.id}</td>
//             <td className="px-4 py-3 font-medium">{po.seller}</td>
//             <td className="px-4 py-3  font-medium">{po.amount}</td>
//             <td className="py-3 px-4 flex items-center gap-2">
//               {po.status === "Completed" ? (
//                 <CheckCircle className="w-5 h-5 text-green-500" />
//               ) : (
//                 <Clock className="w-5 h-5 text-yellow-400" />
//               )}
//               <span
//                 className={`text-sm font-medium ${
//                   po.status === "Completed" ? "text-green-500" : "text-yellow-400"
//                 }`}
//               >
//                 {po.status}
//               </span>
//             </td>
//             <td className="py-3 px-4">
//               {po.status === "Pending" && (
//                 <button className="p-1 bg-green-600/20 rounded hover:bg-green-600/30">
//                   <Check className="w-4 h-4 text-green-400" />
//                 </button>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default PayoutsTable;
