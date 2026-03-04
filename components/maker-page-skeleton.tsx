import CVItemSkeleton from "./cv/cv-item/cv-item-skeleton";

export default function MakerPageSeleton() {
  return (
    <div className="grid w-full gap-4 p-2 sm:gap-5 sm:p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <CVItemSkeleton key={index} />
      ))}
    </div>
  );
}
