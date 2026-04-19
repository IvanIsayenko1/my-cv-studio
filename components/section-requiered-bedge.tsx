import { Badge } from "./ui/badge";

export default function SectionRequieredsBedge({
  isReady,
}: {
  isReady: boolean;

  className?: string;
}) {
  return !isReady && <Badge variant="outline">Requiered</Badge>;
}
