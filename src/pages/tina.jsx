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
            console.log(data);


            //PUT /projects/:id/repository/files/:file_path

            cms.alerts.success('Saved!')
        }
    }

    async function saveContent(data) {
        const response = await fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
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