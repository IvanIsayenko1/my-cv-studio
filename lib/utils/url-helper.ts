import { usePathname } from "next/navigation";

const normalizePath = (path: string) => {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export const useIsURLActive = () => {
  const pathname = usePathname();

  return (path: string, options?: { exact?: boolean }) => {
    const exact = options?.exact ?? false;
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(path);

    if (exact || targetPath === "/") {
      return currentPath === targetPath;
    }

    return (
      currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
    );
  };
};
