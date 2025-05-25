export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const reportTypes: ReportType[] = [
  {
    id: "hate-speech",
    name: "Hate Speech",
    description:
      "Content contains language that may be offensive or harmful to certain groups.",
    icon: "alert-triangle",
    color: "amber",
  },
  {
    id: "misinformation",
    name: "Misinformation",
    description: "Content contains false or misleading information.",
    icon: "flag",
    color: "red",
  },
  {
    id: "harassment",
    name: "Harassment",
    description:
      "Content targets individuals with abusive or threatening language.",
    icon: "alert-circle",
    color: "orange",
  },
  {
    id: "spam",
    name: "Spam/Scam",
    description:
      "Content appears to be unsolicited advertising or a potential scam.",
    icon: "shopping-cart",
    color: "blue",
  },
  {
    id: "violence",
    name: "Violence",
    description: "Content depicts or promotes violence or harm to individuals.",
    icon: "shield",
    color: "purple",
  },
];

export const contentReports = [
  {
    reportTypeId: "hate-speech",
    count: 3,
  },
  {
    reportTypeId: "misinformation",
    count: 2,
  },
  {
    reportTypeId: "harassment",
    count: 4,
  },
  {
    reportTypeId: "spam",
    count: 1,
  },
  {
    reportTypeId: "violence",
    count: 2,
  },
];
