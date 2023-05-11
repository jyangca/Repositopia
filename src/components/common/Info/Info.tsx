const Info = ({
  icon,
  children,
}: {
  icon: JSX.Element;
  children: React.ReactNode;
}) => (
  <p className="flex items-center gap-1 text-xs">
    {icon}
    <span className="flex items-center gap-1">{children}</span>
  </p>
);

export default Info;
