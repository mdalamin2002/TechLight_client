import { BarChart2, Users, Store, ShoppingCart, ShieldAlert, MessageCircle } from "lucide-react";

export  const tabs = [
  { id: "sales", label: "Sales Report", icon: BarChart2 },
  { id: "users", label: "User Report", icon: Users },
  { id: "review", label: "Review Tracking", icon: MessageCircle},
  { id: "orders", label: "Order Report", icon: ShoppingCart },
  { id: "fraud", label: "Fraud Detection", icon: ShieldAlert },
];
