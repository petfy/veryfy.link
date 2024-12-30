import { ScrollArea } from "@/components/ui/scroll-area";

interface BadgeCodeDisplayProps {
  code: string;
  preview: React.ReactNode;
  title: string;
}

export function BadgeCodeDisplay({ code, preview, title }: BadgeCodeDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg space-y-2">
        <p className="font-medium capitalize mb-2">{title}</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <ScrollArea className="h-[120px]">
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
              <code>{code}</code>
            </pre>
          </ScrollArea>
        </div>
      </div>
      <div className="relative border rounded-lg p-4 bg-white min-h-[100px] overflow-visible">
        <p className="text-sm text-gray-500 mb-4">Preview:</p>
        <div className="relative w-full">
          {preview}
        </div>
      </div>
    </div>
  );
}