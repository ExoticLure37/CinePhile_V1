const Skeleton = () => {
    return (
        <div className="space-y-4 w-full">
            {/* 1. Heading skeleton */}
            <div className="skeleton h-6 w-1/3 rounded-xl"></div>

            {/* 2. Subheading / line skeleton */}
            <div className="skeleton h-4 w-1/5 rounded-md"></div>

            {/* 3. Wrapping row of skeleton cards */}
            <div className="flex flex-wrap gap-8">
                {[...Array(12)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-neutral-900 rounded-xl overflow-hidden w-[200px] flex-shrink-0"
                    >
                        <div className="skeleton w-full h-[240px] rounded-none"></div>
                        <div className="p-3">
                            <div className="skeleton h-4 w-3/4 rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


    );
};

export default Skeleton;
