import Title from '../components/Title';
import Body from '../components/Body';

import { getContentFiles, readFile, getSlug } from '../utils/content';

export default function Index(props) {
    return <div>
        {
            props.blocks.map(({ _template, ...data }, i) => {
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
    </div>
}

export async function getStaticProps({ params:{ slug } }) {
    if (typeof slug === 'undefined') {
        slug = 'index';
    }

    const content = await readFile(`content/${slug}.json`);

    return {
        props: JSON.parse(content)
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