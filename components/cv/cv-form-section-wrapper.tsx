import { ReactNode } from "react";

import { CollapsibleCard } from "../ui/collapsible-card";

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
  const getClosedSections = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(
      localStorage.getItem("cv-form-closed-sections") || "[]"
    ) as string[];
  };

  const onOpenChangeHandler = (isOpen: boolean) => {
    const closedSections = getClosedSections();

    if (isOpen) {
      // Remove the section ID from the closed sections list
      const newClosedSections = closedSections.filter(
        (sectionId) => sectionId !== id
      );
      localStorage.setItem(
        "cv-form-closed-sections",
        JSON.stringify(newClosedSections)
      );
      return;
    }

    // Add the section ID to the closed sections list
    closedSections.push(id);
    localStorage.setItem(
      "cv-form-closed-sections",
      JSON.stringify(closedSections)
    );
  };

  return (
    <CollapsibleCard
      title={
        <div className="flex flex-row gap-2 items-center">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {title}
          </h4>
          <span className="hover:no-underline flex"> {status}</span>
        </div>
      }
      description={description}
      defaultOpen={!getClosedSections().includes(id)}
      onOpenChange={onOpenChangeHandler}
    >
      <div className="pt-4">{children}</div>
    </CollapsibleCard>
    // <section
    //   id={id}
    //   className="scroll-mt-24 border-border/70 pt-2 first:border-t-0 first:pt-0"
    // >
    //   <Accordion
    //     type="multiple"
    //     defaultValue={defaultValues}
    //     onValueChange={onSectionToogle}
    //   >
    //     <AccordionItem value={id}>
    //       <Card>
    //         <CardHeader className="px-4 sm:px-6">
    //           <CardTitle className="text-lg">
    //             <AccordionTrigger>
    //               <div className="flex flex-row gap-2 items-center">
    //                 <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
    //                   {title}
    //                 </h4>
    //                 <span className="hover:no-underline"> {status}</span>
    //               </div>
    //             </AccordionTrigger>
    //           </CardTitle>
    //           {description && <CardDescription>{description}</CardDescription>}
    //         </CardHeader>
    //         <CardContent className="px-4 sm:px-6">
    //           <AccordionContent>{children} </AccordionContent>
    //         </CardContent>
    //       </Card>
    //     </AccordionItem>
    //   </Accordion>
    // </section>
  );
}
