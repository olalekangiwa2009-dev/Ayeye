const styles: Record<string, string> = {
  PENDING: "bg-purple-100 text-purple-700",
  READ: "bg-gray-100 text-gray-600",
  REPLIED: "bg-green-100 text-green-700",
};

const labels: Record<string, string> = {
  PENDING: "New",
  READ: "Read",
  REPLIED: "Replied",
};

export default function EnquiryStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status] ?? styles.READ}`}>
      {labels[status] ?? status}
    </span>
  );
}
