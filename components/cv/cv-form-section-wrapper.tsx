import { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function SectionWrapper({
  id,
  title,
  status,
  children,
  description,
}: {
  status?: ReactNode;
  id: string;
  title: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-border/70 pt-2 first:border-t-0 first:pt-0"
    >
      <Accordion type="multiple" defaultValue={[id]}>
        <AccordionItem value={id}>
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg">
                <AccordionTrigger>
                  <div className="flex flex-row gap-2 items-center">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      {title}
                    </h4>
                    <span className="hover:no-underline"> {status}</span>
                  </div>
                </AccordionTrigger>
              </CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <AccordionContent>{children} </AccordionContent>
            </CardContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
