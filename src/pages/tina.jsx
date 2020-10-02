import { withTina, useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, BlocksControls, InlineBlocks, InlineText } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'

import Title from '../components/Title'
import Body from '../components/Body'

function Tina(props) {
    const cms = useCMS();

    //&state
    (function() {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.replace("#","?"));
            let token = hashParams.get('access_token');
            localStorage.setItem('token', token);

            window.location.replace(window.location.href.split('#')[0] + '?slug=' + localStorage.getItem('last_slug'));
        }

        if (typeof localStorage !== 'undefined' && !localStorage.getItem('token')) {
            const urlParams = new URLSearchParams(window.location.search);
            let slug = encodeURIComponent(urlParams.get('slug'));

            localStorage.setItem('last_slug', slug);
            window.location.replace(`https://gitlab.com/oauth/authorize?client_id=${process.env['NEXT_PUBLIC_GITLAB_CLIENT_ID']}&redirect_uri=${process.env['NEXT_PUBLIC_GITLAB_OAUTH_REDIRECT']}&response_type=token&scope=api`);
        }
    }());

    const formConfig = {
        id: 'editor',
        loadInitialValues() {
            return getContent()
        },
        onSubmit(data, form) {
            return saveContent(data);
        }
    };

    async function saveContent(data) {
        const urlParams = new URLSearchParams(window.location.search);
        let slug = encodeURIComponent(urlParams.get('slug'));
        let repo = encodeURIComponent(process.env['NEXT_PUBLIC_GITLAB_REPOSITORY']);

        let contentString = JSON.stringify(data);

        const response = await fetch(`https://gitlab.com/api/v4/projects/${repo}/repository/files/content%2F${slug}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                content: contentString,
                commit_message: 'Testing 123',
                branch: 'master'
            })
        });
        console.log(response);
    }

    async function getContent() {
        // Handle some errors, please?
        const urlParams = new URLSearchParams(window.location.search);
        let slug = encodeURIComponent(urlParams.get('slug'));
        let repo = encodeURIComponent(process.env['NEXT_PUBLIC_GITLAB_REPOSITORY']);

        const res = await fetch(`https://gitlab.com/api/v4/projects/${repo}/repository/files/content%2F${slug}.json/raw?ref=master`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        return await res.json();
    }

    const [_, form] = useForm(formConfig)
    usePlugin(form)

    return <div>
        <InlineForm form={form}>
            <InlineBlocks name="blocks" blocks={PAGE_BLOCKS} />
        </InlineForm>
    </div>

}

export function InlineTitle(props) {
    return (
        <BlocksControls index={props.index}>
            <Title><InlineText name="value" /></Title>
        </BlocksControls>
    )
}

//props.data._template
export function InlineBody(props) {
    return (
        <BlocksControls index={props.index}>
            <Body>
            <InlineWysiwyg name="value" format="markdown">

            </InlineWysiwyg>
           </Body>
        </BlocksControls>
    )
}

const PAGE_BLOCKS = {
    Title: {
        Component: InlineTitle,
        template: {label: 'Title'}
    },
    Body: {
        Component: InlineBody,
        template: {label: 'Body'}
    }
};

export default withTina(Tina, {
    enabled: true,
    toolbar: true
})