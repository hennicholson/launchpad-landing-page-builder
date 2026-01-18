import React from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { cn } from "@/lib/utils";
import { SubheadingText } from "./SubheadingText";

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

export default function CustomersTableBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items } = section;

  // Extract styling
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const DEFAULT_PADDING = { top: 96, bottom: 96 };

  return (
    <section
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "w-full rounded-lg border border-border bg-card p-6 shadow-sm",
          )}
        >
          {/* Heading Section */}
          <div className="mb-6">
            {content.showHeading !== false && content.heading && (
              renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "text-2xl font-semibold tracking-tight text-foreground",
                })
              ) : (
                <h3 className="text-2xl font-semibold tracking-tight text-foreground" style={{ color: textColor }}>
                  {content.heading}
                </h3>
              )
            )}
            <SubheadingText
              content={content}
              sectionId={section.id}
              textColor={textColor}
              bodyFont={typography.bodyFont}
              renderText={renderText}
            />
          </div>

          {/* Table */}
          {content.showItems !== false && items && items.length > 0 && (
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
                  {items.map((item) => {
                    const meta = item.metadata ? JSON.parse(item.metadata) : {};
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        {/* Customer Name with Avatar */}
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              renderImage ? (
                                renderImage({
                                  src: item.imageUrl,
                                  sectionId: section.id,
                                  field: "imageUrl",
                                  itemId: item.id,
                                  className: "h-10 w-10 rounded-full bg-muted",
                                  alt: item.title || "Customer avatar",
                                })
                              ) : (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title || "Customer avatar"}
                                  className="h-10 w-10 rounded-full bg-muted"
                                />
                              )
                            )}
                            {renderText ? (
                              renderText({
                                value: item.title || "",
                                sectionId: section.id,
                                field: "title",
                                itemId: item.id,
                                className: "font-medium text-foreground",
                              })
                            ) : (
                              <span className="font-medium text-foreground" style={{ color: textColor }}>
                                {item.title}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4">
                          {renderText ? (
                            renderText({
                              value: item.description || "",
                              sectionId: section.id,
                              field: "description",
                              itemId: item.id,
                              className: "text-sm text-muted-foreground",
                            })
                          ) : (
                            <span className="text-sm text-muted-foreground" style={{ color: `${textColor}99` }}>
                              {item.description}
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4">
                          {meta.status === "active" && (
                            <Badge variant="success">Active</Badge>
                          )}
                          {meta.status === "inactive" && (
                            <Badge variant="danger">Inactive</Badge>
                          )}
                          {meta.status === "pending" && (
                            <Badge variant="warning">Pending</Badge>
                          )}
                        </td>

                        {/* Revenue */}
                        <td className="py-4 font-medium text-foreground" style={{ color: textColor }}>
                          {meta.revenue || "$0"}
                        </td>

                        {/* Join Date */}
                        <td className="py-4 text-sm text-muted-foreground" style={{ color: `${textColor}99` }}>
                          {meta.joinDate ? new Date(meta.joinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }) : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
