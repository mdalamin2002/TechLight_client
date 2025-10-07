// // User.jsx
// import React from "react";
// import { Shield, User as UserIcon, Crown, Settings } from "lucide-react";

// const User = ({
//   users,
//   openMenu,
//   setOpenMenu,
//   handleToggleBan,
//   handleMakeModerator,
//   handleMakeAdmin,
//   handleRemoveRole,
// }) => {
//   return (
//     <tbody className="text-center">
//       {users.map((user, i) => {
//         // last row বা second last row detect
//         const isLastRow = i >= users.length - 1;
//         const menuClasses = `absolute right-0 w-44 bg-white border rounded-lg shadow-xl z-20 text-left ${
//           isLastRow ? "bottom-full mb-2" : "mt-2"
//         }`;

//         return (
//           <tr
//             key={user.id}
//             className="hover:bg-gray-50 transition-colors border-b last:border-0"
//           >
//             {/* Avatar */}
//             <td className="py-3 px-4">
//               <img
//                 src={user.avatar}
//                 alt={user.user}
//                 className="w-10 h-10 rounded-full mx-auto"
//               />
//             </td>

//             {/* User Info */}
//             <td className="py-3 px-4">
//               <div className="flex flex-col items-center">
//                 <p className="font-medium">{user.user}</p>
//                 <p className="text-xs text-gray-400">{user.email}</p>
//               </div>
//             </td>

//             {/* Role */}
//             <td className="py-3 px-4 flex justify-center items-center gap-2">
//               {user.role === "Admin" ? (
//                 <Crown className="w-4 h-4 text-yellow-500" />
//               ) : user.role === "Moderator" ? (
//                 <Shield className="w-4 h-4 text-blue-500" />
//               ) : (
//                 <UserIcon className="w-4 h-4 text-gray-400" />
//               )}
//               <span>{user.role}</span>
//             </td>

//             {/* Status */}
//             <td className="py-3 px-4">
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   user.status === "Active"
//                     ? "bg-green-100 text-green-600"
//                     : user.status === "Pending"
//                     ? "bg-yellow-100 text-yellow-600"
//                     : "bg-red-100 text-red-600"
//                 }`}
//               >
//                 {user.status}
//               </span>
//             </td>

//             {/* Join Date */}
//             <td className="py-3 px-4">{user.joinDate}</td>

//             {/* Actions */}
//             <td className="py-3 px-4 relative">
//               <button
//                 className="p-2 rounded-full hover:bg-gray-100 transition"
//                 onClick={() => setOpenMenu(openMenu === i ? null : i)}
//               >
//                 <Settings className="w-5 h-5 text-gray-600" />
//               </button>

//               {openMenu === i && (
//                 <div className={menuClasses}>
//                   <button
//                     onClick={() => handleToggleBan(user.id)}
//                     className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     {user.status === "Active" ? "Ban" : "Unban"}
//                   </button>
//                   {user.role === "User" && (
//                     <button
//                       onClick={() => handleMakeModerator(user.id)}
//                       className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Make Moderator
//                     </button>
//                   )}
//                   {(user.role === "User" || user.role === "Moderator") && (
//                     <button
//                       onClick={() => handleMakeAdmin(user.id)}
//                       className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Make Admin
//                     </button>
//                   )}
//                   {(user.role === "Admin" || user.role === "Moderator") && (
//                     <button
//                       onClick={() => handleRemoveRole(user.id)}
//                       className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Remove Role
//                     </button>
//                   )}
//                 </div>
//               )}
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   );
// };

// export default User;
