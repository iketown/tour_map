import type { User } from "firebase/auth";
import type { FC } from "react";
import type { GetServerSideProps } from "next";
import { getUser, adminDB } from "~/utils/firebase/serverApp";
import Layout from "~/layout/Layout";
//* depending on what data you're using, this would get different stuff. but just checking if you can get user, and get user's doc.

interface ServerSideDocI {
  user?: User;
  votes: { [doc_id: string]: VoteDoc };
}

const ServerSideDoc: FC<ServerSideDocI> = ({ user, votes }) => {
  return (
    <Layout>
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