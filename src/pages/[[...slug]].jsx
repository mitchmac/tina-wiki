import Title from '../components/Title';
import Body from '../components/Body';
import EditLink from '../components/EditLink';

import { getContentFiles, readFile, getSlug } from '../utils/content';

import Head from 'next/head'

export const config = {
  unstable_runtimeJS: false
}

export default function Index(props) {
    return <div>
        <Head>
            <title>{props.data.meta.title}</title>
            <meta name="Description" content={props.data.meta.description} />
        </Head>
        {
            props.data.blocks.map(({ _template, ...data }, i) => {
                switch (_template) {
                    case 'Title':
                        return ( <Title key={i}>{data.value}</Title> );
                    case 'Body':
                        return ( <Body key={i}>{data.value}</Body>);
                    default:
                        return null
                }
            })
        }
        <EditLink slug={props.slug} />
    </div>
}

export async function getStaticProps({ params:{ slug } }) {
    if (typeof slug === 'undefined') {
        slug = 'index';
    }

    const content = await readFile(`content/${slug}.json`);

    return {
        props: {data: JSON.parse(content), slug: slug}
    };
}

export async function getStaticPaths() {
    let pages = await getContentFiles('content/**/*.json');

    let paths = pages.map(file => {
        return getSlug(file);
    });

    paths.push('/');

    return {
        paths: paths,
        fallback: false
    };
}
