import CVDesktopActions from "../cv-desktop-actions";
import CVDropdownActions from "../cv-dropdown-actions";

export default function CVFormMenu({ id }: { id: string }) {
  return (
    <div className="menu-fade-in flex items-center gap-4">
      <div className="hidden md:block">
        <CVDesktopActions id={id} />
      </div>
      <div className="md:hidden">
        <CVDropdownActions id={id} />
      </div>
    </div>
  );
}
