// pages/[slug].tsx

import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';

interface Challenge {
  slug: string;
  title: string;
  image_url: string;
  description: string;
}

export default function ChallengeSEO({ challenge }: { challenge: Challenge }) {
  const redirectUrl = `https://peakyminds.com/c/${challenge.slug}`;

  return (
    <>
      <Head>
        <title>{challenge.title} | PeakyMinds</title>
        <meta name="description" content={challenge.description} />
        <meta property="og:title" content={challenge.title} />
        <meta property="og:description" content={challenge.description} />
        <meta property="og:image" content={challenge.image_url} />
        <meta property="og:url" content={redirectUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta httpEquiv="refresh" content={`0; URL='${redirectUrl}'`} />
      </Head>
      <main>
        <p>Redirecting to <a href={redirectUrl}>{redirectUrl}</a>...</p>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(
    'https://bmnmboxfyxmartvuimaq.supabase.co/rest/v1/documents?select=slug',
    {
      headers: {
        apikey: process.env.SUPABASE_API_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_API_KEY!}`,
      },
    }
  );

  const data = await res.json();

  const paths = data.map((doc: { slug: string }) => ({
    params: { slug: doc.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const res = await fetch(
    `https://bmnmboxfyxmartvuimaq.supabase.co/rest/v1/documents?slug=eq.${slug}&select=slug,title,image_url`,
    {
      headers: {
        apikey: process.env.SUPABASE_API_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_API_KEY!}`,
      },
    }
  );

  const data = await res.json();

  if (!data || data.length === 0) {
    return { notFound: true };
  }

  const challenge = {
    ...data[0],
    description:
      'Join this Mind Challenge — test what you know, learn what you don’t, and climb the peak!',
  };

  return {
    props: {
      challenge,
    },
    revalidate: 300, // her 5 dakikada bir güncellenebilir
  };
};
