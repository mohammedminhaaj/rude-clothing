const Skeleton: React.FC<{ className: string }> = ({
    className,
}: {
    className: string;
}) => <div className={`animate-pulse bg-gray-300 ${className}`}></div>;

export default Skeleton;
