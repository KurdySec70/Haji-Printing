import { useAssetPath } from '@/hooks/useAssetPath';

export default function AppLogo() {
    const { getLogoUrl } = useAssetPath();

    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <img
                    src={getLogoUrl()}
                    alt="Haji Printing Logo"
                    className="size-full object-cover"
                />
            </div>
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-base text-white">Haji Printing</span>
            </div>
        </>
    );
}
