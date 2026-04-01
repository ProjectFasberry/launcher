import { Icon } from "../ui/icon"
import { news, newsState } from "./news.model"
import { useAtom, useCtx } from "@reatom/npm-solid-js";
import { Component, For, onCleanup, onMount, Show } from "solid-js";

const NewsListLoader = () => {
  return (
    <div class="flex items-center justify-center h-full w-full">
      <Icon
        name="sprite:loader-2"
        class="h-16 w-16 text-white/80 animate-spin duration-200"
      />
    </div>
  )
}

const NewsListCard: Component<{ imageUrl: string, title: string }> = (props) => {
  return (
    <div class='flex shrink-0 flex-col bg-neutral-900 text-white rounded-2xl w-full overflow-hidden'>
      <img
        src={props.imageUrl}
        alt={props.title}
        class='select-none object-cover h-72 w-full'
        loading='lazy'
      />
      <div class='flex flex-col w-full h-full p-4'>
        <p class='font-semibold text-xl'>
          {props.title}
        </p>
        <p></p>
        <button
          class='w-fit text-[14px] text-neutral-400 font-semibold cursor-pointer hover:underline'
          onClick={() => { }}
        >
          подробнее
        </button>
      </div>
    </div>
  )
}

const NewsList = () => {
  const [status] = useAtom(news.fetch.statusesAtom)
  const [data] = useAtom(news.fetch.dataAtom)

  return (
    <Show
      when={!status().isPending}
      fallback={<NewsListLoader />}
    >
      <div class='flex flex-col w-full gap-4'>
        <For each={data()?.data}>
          {(item) => <NewsListCard {...item} />}
        </For>
      </div>
    </Show>
  )
}

const NewsLoaderItem = () => {
  const ctx = useCtx();
  let loaderRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!loaderRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      newsState.inView(ctx, entry.isIntersecting);
    });

    observer.observe(loaderRef);
    onCleanup(() => observer.disconnect());
  });

  return <div ref={loaderRef} class="h-1 min-h-1 w-full" />;
}

export const News = () => {
  return (
    <div class='flex flex-col overflow-y-auto pr-2 scrollable w-[60%] h-full min-h-0'>
      <NewsList />
      <NewsLoaderItem />
    </div>
  )
}