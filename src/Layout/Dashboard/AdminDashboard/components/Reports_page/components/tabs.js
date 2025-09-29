import { BarChart2, Users, Store, ShoppingCart, ShieldAlert } from "lucide-react";

export  const tabs = [
  { id: "sales", label: "Sales Report", icon: BarChart2 },
  { id: "users", label: "User Report", icon: Users },
  { id: "sellers", label: "Seller Report", icon: Store },
  { id: "orders", label: "Order Report", icon: ShoppingCart },
  { id: "moderator", label: "Moderator Activity", icon: ShieldAlert },
  { id: "fraud", label: "Fraud Detection", icon: ShieldAlert },
];
