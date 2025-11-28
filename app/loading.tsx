export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                {/* Animated Logo */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 animate-ping rounded-lg bg-indigo-500/20" />
                    <div className="relative h-full w-full animate-pulse rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20" />
                </div>
                <p className="font-heading text-sm font-medium text-muted-foreground animate-pulse">
                    Loading Chameleon...
                </p>
            </div>
        </div>
    );
}