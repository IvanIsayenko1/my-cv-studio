import { Badge } from "./ui/badge";

export default function SectionRequiredsBedge({
  isReady,
}: {
  isReady: boolean;

  className?: string;
}) {
  return !isReady && <Badge variant="outline">Required</Badge>;
}
