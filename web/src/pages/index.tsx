import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { Alert, AlertIcon, Button, Stack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import ContentLayout from "../components/ContentLayout";
import PostWrapper from "../components/PostWrapper";
import { useState } from "react";
import { isServer } from "../utils/isServer";
import withApollo from "../utils/withApollo";

const Index = () => {
  type Vars = {
    limit: number;
    cursor: Date | null;
  };
  const [vars, setVariables] = useState<Vars>({
    limit: 10,
    cursor: null,
  });
  const { data, loading, fetchMore } = usePostsQuery({ variables: vars });
  const MeData = useMeQuery({
    skip: isServer(),
  });
  const profile = {
    username: MeData.data?.me?.username,
    title: "Developer",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
  };

  return (
    <>
      <Layout>
        <ContentLayout profile={false} profileProps={profile}>
          {loading ? (
            <div>loading...</div>
          ) : (
            <>
              <Stack shouldWrapChildren spacing={12}>
                {data?.posts.posts.map((p) => (
                  <PostWrapper post={p} />
                ))}
              </Stack>

              {data && data?.posts.hasMore ? (
                <Button
                  my={2}
                  mx={"auto"}
                  onClick={() => {
                    console.log(
                      new Date(
                        Date.parse(
                          data?.posts.posts[data?.posts.posts.length - 1]
                            .createdAt
                        )
                      )
                    );
                    fetchMore({
                      variables: {
                        limit: vars.limit,
                        cursor: new Date(
                          Date.parse(
                            data.posts.posts[data.posts.posts.length - 1]
                              .createdAt
                          )
                        ),
                      },
                    });
                  }}
                >
                  Load More
                </Button>
              ) : (
                <Alert mt={10} status="info">
                  <AlertIcon />
                  You have reached the very earliest posts, it's the end of the
                  tunnel.
                </Alert>
              )}
            </>
          )}
        </ContentLayout>
      </Layout>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
