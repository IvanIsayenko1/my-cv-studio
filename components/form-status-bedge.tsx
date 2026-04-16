import { Badge } from "./ui/badge";

export default function FormStatusBedge({
  isNotSaved,
}: {
  isNotSaved: boolean;
}) {
  return isNotSaved && <Badge variant="destructive">Not saved</Badge>;
}
