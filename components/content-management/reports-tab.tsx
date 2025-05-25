import { Badge } from "@/components/ui/badge";
import { contentReports, reportTypes } from "@/lib/report-types";
import {
  AlertCircle,
  AlertTriangle,
  Flag,
  Shield,
  ShoppingCart,
} from "lucide-react";

const getReportIcon = (iconName: string) => {
  switch (iconName) {
    case "alert-triangle":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "flag":
      return <Flag className="h-4 w-4 text-red-500" />;
    case "alert-circle":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case "shopping-cart":
      return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    case "shield":
      return <Shield className="h-4 w-4 text-purple-500" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export function ReportsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Report Summary</h3>
        <Badge variant="outline">
          {contentReports.reduce((sum, report) => sum + report.count, 0)}{" "}
          Reports
        </Badge>
      </div>

      <div className="space-y-3">
        {contentReports.map((report) => {
          const reportType = reportTypes.find(
            (type) => type.id === report.reportTypeId
          );
          if (!reportType) return null;

          return (
            <div key={reportType.id} className="p-3 border rounded-md">
              <div className="flex items-center gap-2 mb-1">
                {getReportIcon(reportType.icon)}
                <span className="font-medium text-sm">{reportType.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {report.count} reports
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {reportType.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
