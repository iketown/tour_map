import type { User } from "firebase/auth";
import type { FC } from "react";
import type { GetServerSideProps } from "next";
import { getUser, adminDB } from "~/utils/firebase/serverApp";
import Layout from "~/layout/Layout";
import Link from "~/components/Link";
//* depending on what data you're using, this would get different stuff. but just checking if you can get user, and get user's doc.

interface ServerSideDocI {
  user?: User;
  votes: { [doc_id: string]: VoteDoc };
}

const ServerSideDoc: FC<ServerSideDocI> = ({ user, votes }) => {
  const hasVoted = votes && user && votes[user?.uid];
  return (
    <Layout>
      {hasVoted ? (
        <p>you've voted already</p>
      ) : (
        <p>
          go to <Link href="/votes">votes</Link> and place your vote for it show
          up here.
        </p>
      )}
      {user ? <div>user: {user.email}</div> : <div>no user</div>}
      {votes ? (
        <pre>{JSON.stringify(votes, null, 2)}</pre>
      ) : (
        <div>no votes doc</div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);
  if (!user)
    return {
      redirect: {
        destination: "/nouser",
        permanent: false,
      },
    };
  const votes = await adminDB
    .collection("votes")
    .get()
    .then((coll) => {
      const _votes: { [doc_id: string]: VoteDoc } = {};
      coll.docs.forEach((doc) => {
        _votes[doc.id] = doc.data() as VoteDoc;
      });
      return _votes;
    });
  return { props: { user, votes } };
};
export default ServerSideDoc;
