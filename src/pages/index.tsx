import { SignOutButton, useUser } from "@clerk/nextjs";

import Head from "next/head";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { api } from "~/utils/api";

import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="rounded-full"
        width={56}
        height={56}
      />
      <input
        type="text"
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <li className="flex items-center gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profilePicture}
        alt="Profile image"
        className="rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="whitespace-pre font-thin">{`  ~ ${dayjs(
            post.createdAt,
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </li>
  );
};

export default function Home() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>...Loading</div>;

  if (!data) return <div>Something went wrong</div>;

  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {user.isSignedIn && (
              <>
                <CreatePostWizard />
                <div className="flex justify-center">
                  <SignOutButton />
                </div>
              </>
            )}
          </div>
          <ul className="flex flex-col">
            {data.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
