import { reatomComponent, useUpdate } from "@reatom/npm-react"
import { Icon } from "../ui/icon"
import { useInView } from "react-intersection-observer";
import { news, newsState } from "./news.model"

const NewsListLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Icon
        name="sprite:loader-2"
        className="h-16 w-16 text-white/80 animate-spin duration-200"
      />
    </div>
  )
}

const NewsListCard = ({ imageUrl, title }: any) => {
  return (
    <div className='flex shrink-0 flex-col bg-neutral-900 text-white rounded-2xl w-full overflow-hidden'>
      <img
        src={imageUrl}
        alt={title}
        className='select-none object-cover h-72 w-full'
        loading='lazy'
      />
      <div className='flex flex-col w-full h-full p-4'>
        <p className='font-semibold text-xl'>
          {title}
        </p>
        <p></p>
        <button
          className='w-fit text-[14px] text-neutral-400 font-semibold cursor-pointer hover:underline'
          onClick={() => { }}
        >
          подробнее
        </button>
      </div>
    </div>
  )
}

const NewsList = reatomComponent(({ ctx }) => {
  if (ctx.spy(news.fetch.statusesAtom).isPending) return <NewsListLoader />

  const data = ctx.spy(news.fetch.dataAtom);
  if (!data) return null;

  return (
    <div className='flex flex-col w-full gap-4'>
      {data.data.map(news => <NewsListCard key={news.id} {...news} />)}
    </div>
  )
}, "NewsList")

const NewsLoaderItem = () => {
  const { ref, inView } = useInView({  threshold: 0 });

  useUpdate((ctx) => newsState.inView(ctx, inView), [inView])

  return <div ref={ref} className="h-1 min-h-1 w-full" />
}

export const News = () => {
  return (
    <div className='flex flex-col overflow-y-auto pr-2 scrollable w-[60%] h-full min-h-0'>
      <NewsList />
      <NewsLoaderItem />
    </div>
  )
}