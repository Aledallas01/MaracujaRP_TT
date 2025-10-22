import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export default function ErrorMessage({
  title = "Errore",
  message,
  action,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">{title}</h3>
          <p className="text-sm text-red-700 mb-3">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
