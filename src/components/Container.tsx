export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1240px] w-full mx-auto px-4 md:px-5">{children}</div>;
}
