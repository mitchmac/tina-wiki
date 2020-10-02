import { withTina, useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, BlocksControls, InlineBlocks, InlineText } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'

import Title from '../components/Title'
import Body from '../components/Body'

function Tina(props) {
    const cms = useCMS();

    const formConfig = {
        id: 'editor',
        loadInitialValues() {
            return getContent()
        },
        onSubmit(data, form) {
            //cms.alerts.success('Saved!')
            return saveContent(data);
        }
    }

    async function saveContent(data) {
        const urlParams = new URLSearchParams(window.location.search);
        let slug = encodeURIComponent(urlParams.get('slug'));

        let contentString = JSON.stringify(data);

        const response = await fetch(`https://gitlab.com/api/v4/projects/mitchmac%2Fwiki-test/repository/files/content%2F${slug}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'PRIVATE-TOKEN': ''
            },
            body: JSON.stringify({
                content: contentString,
                commit_message: 'Testing 123',
                branch: 'master'
            })
        });
        console.log(response);
        /*
author_email (optional) - Specify the commit author’s email address
author_name (optional) - Specify the commit author’s name
         */
    }

    async function getContent() {
        // Handle some errors, please?
        const urlParams = new URLSearchParams(window.location.search);
        let slug = encodeURIComponent(urlParams.get('slug'));

        const res = await fetch(`https://gitlab.com/api/v4/projects/mitchmac%2Fwiki-test/repository/files/content%2F${slug}.json/raw?ref=master`);
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