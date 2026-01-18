import React from "react";
import { cn } from "@/lib/utils";

export type Customer = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive" | "pending";
  revenue: string;
  joinDate: string;
};

export type CustomersTableCardProps = {
  title?: string;
  subtitle?: string;
  customers?: Customer[];
  className?: string;
};

const Badge = ({
  variant,
  children,
}: {
  variant: "success" | "danger" | "warning";
  children: React.ReactNode;
}) => {
  const variantStyles = {
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
};

const defaultCustomers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active",
    revenue: "$12,450",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "active",
    revenue: "$8,920",
    joinDate: "2024-02-03",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "pending",
    revenue: "$0",
    joinDate: "2024-03-20",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "j.wilson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    status: "inactive",
    revenue: "$5,340",
    joinDate: "2023-11-08",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    status: "active",
    revenue: "$15,780",
    joinDate: "2024-01-22",
  },
];

export default function CustomersTableCard({
  title = "Recent Customers",
  subtitle = "A list of your recent customers and their details",
  customers = defaultCustomers,
  className,
}: CustomersTableCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Customer
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Revenue
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="h-10 w-10 rounded-full bg-muted"
                    />
                    <span className="font-medium text-foreground">
                      {customer.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-sm text-muted-foreground">
                  {customer.email}
                </td>
                <td className="py-4">
                  {customer.status === "active" && (
                    <Badge variant="success">Active</Badge>
                  )}
                  {customer.status === "inactive" && (
                    <Badge variant="danger">Inactive</Badge>
                  )}
                  {customer.status === "pending" && (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </td>
                <td className="py-4 font-medium text-foreground">
                  {customer.revenue}
                </td>
                <td className="py-4 text-sm text-muted-foreground">
                  {new Date(customer.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
