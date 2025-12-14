import { onMounted, onUnmounted, type Ref } from 'vue';

export function useIntersectionObserver(
    target: Ref<HTMLElement | null>,
    callback: () => void,
    options: IntersectionObserverInit = {}
) {
    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                callback();
            }
        }, options);

        if (target.value) {
            observer.observe(target.value);
        }
    };

    onMounted(() => {
        setupObserver();
    });

    onUnmounted(() => {
        if (observer) observer.disconnect();
    });

    return {
        setupObserver
    };
}
